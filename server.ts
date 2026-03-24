import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Telegraf } from "telegraf";
import { GoogleGenAI, Type } from "@google/genai";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}
const db = admin.firestore();
if (firebaseConfig.firestoreDatabaseId) {
  // @ts-ignore - databaseId is a property of Firestore
  db.databaseId = firebaseConfig.firestoreDatabaseId;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Initialize Telegram Bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

// AI Extraction Logic
async function extractOpportunityData(text: string) {
  try {
    const model = "gemini-3-flash-preview";
    const response = await genAI.models.generateContent({
      model,
      contents: `Extract opportunity details from this Telegram post. Return ONLY JSON.
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            organization: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { 
              type: Type.STRING, 
              enum: ["Internships", "Events", "Competitions", "Scholarships", "Jobs", "Fellowships", "Conferences", "Grants", "General"] 
            },
            location: { type: Type.STRING },
            deadline: { type: Type.STRING, description: "ISO 8601 format if possible, otherwise a string" },
            applyLink: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            field: { type: Type.STRING, description: "Tech, Business, Engineering, etc." },
            isRemote: { type: Type.BOOLEAN },
            seoArticle: { type: Type.STRING, description: "A short SEO-friendly article about this opportunity" }
          },
          required: ["title", "category", "description"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Extraction Error:", error);
    return null;
  }
}

// Telegram Webhook
app.post("/api/telegram-webhook", async (req, res) => {
  try {
    const { message, channel_post } = req.body;
    const post = channel_post || message;

    if (post && post.text) {
      const extractedData = await extractOpportunityData(post.text);
      if (extractedData) {
        await db.collection("opportunities").add({
          ...extractedData,
          rawTelegramText: post.text,
          isApproved: false,
          isFeatured: false,
          viewCount: 0,
          createdAt: new Date().toISOString(),
        });
        console.log("Opportunity imported successfully:", extractedData.title);
      }
    }
    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Admin endpoint to set webhook (one-time call)
app.get("/api/setup-telegram", async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.APP_URL;
  if (!token || !appUrl) {
    return res.status(400).send("Missing token or app URL");
  }
  try {
    await bot.telegram.setWebhook(`${appUrl}/api/telegram-webhook`);
    res.send("Webhook set successfully");
  } catch (error) {
    res.status(500).send("Failed to set webhook");
  }
});

// Endpoint to share weekly digest back to Telegram
app.post("/api/share-digest", async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(400).send("Missing token");

  const { internships, scholarships, events, competitions } = req.body;
  const appUrl = process.env.APP_URL;

  let message = "🌟 *Top Opportunities This Week* 🌟\n\n";

  if (internships?.length) {
    message += "💼 *Internships:*\n" + internships.map((t: string) => `• ${t}`).join("\n") + "\n\n";
  }
  if (scholarships?.length) {
    message += "🎓 *Scholarships:*\n" + scholarships.map((t: string) => `• ${t}`).join("\n") + "\n\n";
  }
  if (events?.length) {
    message += "📅 *Events:*\n" + events.map((t: string) => `• ${t}`).join("\n") + "\n\n";
  }
  if (competitions?.length) {
    message += "🏆 *Competitions:*\n" + competitions.map((t: string) => `• ${t}`).join("\n") + "\n\n";
  }

  message += `🚀 View all details and apply here: ${appUrl}/weekly-digest\n\n`;
  message += "Join our channel for real-time alerts!";

  try {
    // We need a chat ID. For simplicity, we assume the bot is in the channel and we can send to it.
    // In a real app, you'd store the channel ID after the first webhook or via config.
    // For now, we'll try to send it to the channel if we have an ID, or just return success if it's a demo.
    const channelId = process.env.TELEGRAM_CHANNEL_ID; 
    if (channelId) {
      await bot.telegram.sendMessage(channelId, message, { parse_mode: "Markdown" });
      res.send("Digest shared successfully");
    } else {
      console.log("No TELEGRAM_CHANNEL_ID set. Digest message:\n", message);
      res.send("Digest generated (check server logs as no channel ID is set)");
    }
  } catch (error) {
    console.error("Failed to share digest:", error);
    res.status(500).send("Failed to share digest");
  }
});

async function startServer() {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
