import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
if (process.env.ADMIN_PASSWORD) {
  console.log("ADMIN_PASSWORD is set from environment variables.");
} else {
  console.log("ADMIN_PASSWORD is not set, using default 'admin123'.");
}
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

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
  app.get("/api/settings", authenticate, async (req, res) => {
    const { data, error } = await supabase.from("settings").select("*");
    if (error) return res.status(500).json({ error: error.message });
    const settings = data.reduce((acc: any, row: any) => ({ ...acc, [row.key]: row.value }), {});
    res.json(settings);
  });

  app.post("/api/settings", authenticate, async (req, res) => {
    const { telegram_bot_token, telegram_chat_id } = req.body;
    const updates = [];
    if (telegram_bot_token) updates.push({ key: "telegram_bot_token", value: telegram_bot_token });
    if (telegram_chat_id) updates.push({ key: "telegram_chat_id", value: telegram_chat_id });
    
    if (updates.length > 0) {
      const { error } = await supabase.from("settings").upsert(updates);
      if (error) return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  });

  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.get("/api/opportunities", async (req, res) => {
    const { category, status, search } = req.query;
    let query = supabase.from("opportunities").select("*");

    if (category) {
      query = query.eq("category", category);
    }
    if (status) {
      query = query.eq("status", status);
    } else {
      query = query.eq("status", "approved");
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,organization.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/opportunities/:id", async (req, res) => {
    const { data, error } = await supabase.from("opportunities").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    
    // Increment view count
    await supabase.rpc("increment_view_count", { row_id: req.params.id });
    
    res.json(data);
  });

  app.post("/api/opportunities/:id/approve", authenticate, async (req, res) => {
    const { error } = await supabase.from("opportunities").update({ status: "approved" }).eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete("/api/opportunities/:id", authenticate, async (req, res) => {
    const { error } = await supabase.from("opportunities").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.patch("/api/opportunities/:id", authenticate, async (req, res) => {
    const { title, category, organization, deadline, description, apply_link, is_pinned, is_featured } = req.body;
    const { error } = await supabase.from("opportunities").update({
      title, category, organization, deadline, description, apply_link, 
      is_pinned: is_pinned ? true : false, 
      is_featured: is_featured ? true : false
    }).eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.post("/api/sync", authenticate, async (req, res) => {
    const { botToken, chatId } = req.body;
    try {
      const { data: offsetData } = await supabase.from("settings").select("value").eq("key", "telegram_offset").single();
      const offset = offsetData ? parseInt(offsetData.value) : 0;

      const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}`);
      const updates = response.data.result;
      
      let importedCount = 0;
      let lastUpdateId = offset - 1;

      for (const update of updates) {
        lastUpdateId = update.update_id;
        const message = update.channel_post || update.message;
        if (!message || !message.text) continue;

        const telegramId = message.message_id.toString();
        const { data: existing } = await supabase.from("opportunities").select("id").eq("telegram_id", telegramId).single();
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
        
        const { error: insertError } = await supabase.from("opportunities").insert({
          telegram_id: telegramId,
          title: data.title || "Untitled Opportunity",
          type: data.type || "General",
          organization: data.organization || "Unknown",
          location: data.location || "Remote",
          deadline: data.deadline || "",
          apply_link: data.apply_link || "",
          description: data.description || message.text,
          category: data.category || "General",
          tags: data.tags || [],
          status: 'pending'
        });

        if (!insertError) importedCount++;
      }

      if (lastUpdateId >= offset) {
        await supabase.from("settings").upsert({ key: "telegram_offset", value: (lastUpdateId + 1).toString() });
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
    const { data: botTokenData } = await supabase.from("settings").select("value").eq("key", "telegram_bot_token").single();
    if (!botTokenData?.value) return;

    try {
      const { data: offsetData } = await supabase.from("settings").select("value").eq("key", "telegram_offset").single();
      const offset = offsetData ? parseInt(offsetData.value) : 0;

      const response = await axios.get(`https://api.telegram.org/bot${botTokenData.value}/getUpdates?offset=${offset}`);
      const updates = response.data.result;
      
      let lastUpdateId = offset - 1;

      for (const update of updates) {
        lastUpdateId = update.update_id;
        const message = update.channel_post || update.message;
        if (!message || !message.text) continue;

        const telegramId = message.message_id.toString();
        const { data: existing } = await supabase.from("opportunities").select("id").eq("telegram_id", telegramId).single();
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
        
        await supabase.from("opportunities").insert({
          telegram_id: telegramId,
          title: data.title || "Untitled Opportunity",
          type: data.type || "General",
          organization: data.organization || "Unknown",
          location: data.location || "Remote",
          deadline: data.deadline || "",
          apply_link: data.apply_link || "",
          description: data.description || message.text,
          category: data.category || "General",
          tags: data.tags || [],
          status: 'pending'
        });
      }

      if (lastUpdateId >= offset) {
        await supabase.from("settings").upsert({ key: "telegram_offset", value: (lastUpdateId + 1).toString() });
      }
    } catch (error) {
      console.error("Background poll error:", error);
    }
  };

  setInterval(pollTelegram, 5 * 60 * 1000);
  pollTelegram();
}

startServer();
