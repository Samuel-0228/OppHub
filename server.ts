import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("opportunities.db");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT UNIQUE,
    title TEXT NOT NULL,
    type TEXT,
    organization TEXT,
    location TEXT,
    deadline TEXT,
    apply_link TEXT,
    description TEXT,
    category TEXT,
    tags TEXT,
    status TEXT DEFAULT 'pending',
    is_pinned INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API Routes
  app.get("/api/settings", authenticate, (req, res) => {
    const rows = db.prepare("SELECT * FROM settings").all() as { key: string, value: string }[];
    const settings = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
    res.json(settings);
  });

  app.post("/api/settings", authenticate, (req, res) => {
    const { telegram_bot_token, telegram_chat_id } = req.body;
    if (telegram_bot_token) db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('telegram_bot_token', ?)").run(telegram_bot_token);
    if (telegram_chat_id) db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('telegram_chat_id', ?)").run(telegram_chat_id);
    res.json({ success: true });
  });

  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.get("/api/opportunities", (req, res) => {
    const { category, status, search } = req.query;
    let query = "SELECT * FROM opportunities WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    } else {
      query += " AND status = 'approved'";
    }
    if (search) {
      query += " AND (title LIKE ? OR organization LIKE ? OR description LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += " ORDER BY is_pinned DESC, created_at DESC";
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  });

  app.get("/api/opportunities/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM opportunities WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    db.prepare("UPDATE opportunities SET view_count = view_count + 1 WHERE id = ?").run(req.params.id);
    res.json(row);
  });

  app.post("/api/opportunities/:id/approve", authenticate, (req, res) => {
    db.prepare("UPDATE opportunities SET status = 'approved' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/opportunities/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM opportunities WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.patch("/api/opportunities/:id", authenticate, (req, res) => {
    const { title, category, organization, deadline, description, apply_link, is_pinned, is_featured } = req.body;
    db.prepare(`
      UPDATE opportunities 
      SET title = ?, category = ?, organization = ?, deadline = ?, description = ?, apply_link = ?, is_pinned = ?, is_featured = ?
      WHERE id = ?
    `).run(title, category, organization, deadline, description, apply_link, is_pinned ? 1 : 0, is_featured ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/sync", authenticate, async (req, res) => {
    const { botToken, chatId } = req.body;
    try {
      // Get last offset
      const offsetRow = db.prepare("SELECT value FROM settings WHERE key = 'telegram_offset'").get() as { value: string } | undefined;
      const offset = offsetRow ? parseInt(offsetRow.value) : 0;

      // Fetch updates from Telegram
      const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}`);
      const updates = response.data.result;
      
      let importedCount = 0;
      let lastUpdateId = offset - 1;

      for (const update of updates) {
        lastUpdateId = update.update_id;
        const message = update.channel_post || update.message;
        if (!message || !message.text) continue;

        // If it's a channel post, check if it's from the right chat (optional but good)
        // if (chatId && message.chat.id.toString() !== chatId) continue;

        const telegramId = message.message_id.toString();
        const existing = db.prepare("SELECT id FROM opportunities WHERE telegram_id = ?").get(telegramId);
        if (existing) continue;

        // AI Processing
        const prompt = `
          Extract structured information from this Telegram post about an opportunity.
          Return a JSON object with these fields:
          - title (string)
          - type (string: Internship, Event, Competition, Scholarship, Job, Fellowship, Conference, Grant, or General)
          - organization (string)
          - location (string)
          - deadline (string, ISO format if possible or readable)
          - apply_link (string)
          - description (string, detailed)
          - category (string, one of: Internships, Events, Competitions, Scholarships, Jobs, Fellowships, Conferences, Grants, General)
          - tags (array of strings)

          Post content:
          ${message.text}
        `;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(aiResponse.text || "{}");
        
        db.prepare(`
          INSERT INTO opportunities (telegram_id, title, type, organization, location, deadline, apply_link, description, category, tags, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `).run(
          telegramId,
          data.title || "Untitled Opportunity",
          data.type || "General",
          data.organization || "Unknown",
          data.location || "Remote",
          data.deadline || "",
          data.apply_link || "",
          data.description || message.text,
          data.category || "General",
          JSON.stringify(data.tags || []),
        );
        importedCount++;
      }

      // Update offset
      if (lastUpdateId >= offset) {
        db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('telegram_offset', ?)").run((lastUpdateId + 1).toString());
      }

      res.json({ success: true, importedCount });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
  });

  // Background Polling
  const pollTelegram = async () => {
    const botTokenRow = db.prepare("SELECT value FROM settings WHERE key = 'telegram_bot_token'").get() as { value: string } | undefined;
    const chatIdRow = db.prepare("SELECT value FROM settings WHERE key = 'telegram_chat_id'").get() as { value: string } | undefined;

    if (!botTokenRow?.value) return;

    try {
      const offsetRow = db.prepare("SELECT value FROM settings WHERE key = 'telegram_offset'").get() as { value: string } | undefined;
      const offset = offsetRow ? parseInt(offsetRow.value) : 0;

      const response = await axios.get(`https://api.telegram.org/bot${botTokenRow.value}/getUpdates?offset=${offset}`);
      const updates = response.data.result;
      
      let lastUpdateId = offset - 1;

      for (const update of updates) {
        lastUpdateId = update.update_id;
        const message = update.channel_post || update.message;
        if (!message || !message.text) continue;

        const telegramId = message.message_id.toString();
        const existing = db.prepare("SELECT id FROM opportunities WHERE telegram_id = ?").get(telegramId);
        if (existing) continue;

        const prompt = `
          Extract structured information from this Telegram post about an opportunity.
          Return a JSON object with these fields:
          - title (string)
          - type (string: Internship, Event, Competition, Scholarship, Job, Fellowship, Conference, Grant, or General)
          - organization (string)
          - location (string)
          - deadline (string, ISO format if possible or readable)
          - apply_link (string)
          - description (string, detailed)
          - category (string, one of: Internships, Events, Competitions, Scholarships, Jobs, Fellowships, Conferences, Grants, General)
          - tags (array of strings)

          Post content:
          ${message.text}
        `;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(aiResponse.text || "{}");
        
        db.prepare(`
          INSERT INTO opportunities (telegram_id, title, type, organization, location, deadline, apply_link, description, category, tags, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `).run(
          telegramId,
          data.title || "Untitled Opportunity",
          data.type || "General",
          data.organization || "Unknown",
          data.location || "Remote",
          data.deadline || "",
          data.apply_link || "",
          data.description || message.text,
          data.category || "General",
          JSON.stringify(data.tags || []),
        );
      }

      if (lastUpdateId >= offset) {
        db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('telegram_offset', ?)").run((lastUpdateId + 1).toString());
      }
    } catch (error) {
      console.error("Background poll error:", error);
    }
  };

  // Poll every 5 minutes
  setInterval(pollTelegram, 5 * 60 * 1000);
  // Initial poll
  pollTelegram();
}

startServer();
