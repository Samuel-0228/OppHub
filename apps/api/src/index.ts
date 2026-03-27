import express from "express";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { config } from "./config/env.js";
import { supabase, supabaseAdmin } from "./db/supabaseClient.js";
import postsRoutes, { authenticate } from "./routes/posts.routes.js";
import { categorizeOpportunity } from "./services/categorize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bootstrap Admin User
async function bootstrapAdmin() {
  if (!config.supabaseServiceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set. Skipping admin user bootstrap.");
    return;
  }

  console.log(`Bootstrapping admin user: ${config.adminEmail}...`);
  try {
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const adminUser = users.users.find(u => u.email === config.adminEmail);

    if (adminUser) {
      console.log("Admin user exists. Updating password...");
      await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
        password: config.adminPassword,
        email_confirm: true
      });
    } else {
      console.log("Admin user does not exist. Creating...");
      await supabaseAdmin.auth.admin.createUser({
        email: config.adminEmail,
        password: config.adminPassword,
        email_confirm: true,
        user_metadata: { role: "admin" }
      });
    }
    console.log("Admin user bootstrap complete.");
  } catch (error) {
    console.error("Admin bootstrap failed:", error);
  }
}

async function startServer() {
  await bootstrapAdmin();

  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", async (req, res) => {
    try {
      const { error: oppsError } = await supabase.from("opportunities").select("id").limit(1);
      const { error: settingsError } = await supabase.from("settings").select("key").limit(1);
      res.json({
        status: "ok",
        supabase: {
          opportunities_table: !oppsError,
          settings_table: !settingsError,
          errors: { opportunities: oppsError?.message, settings: settingsError?.message }
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // Settings
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

  // Login
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email || config.adminEmail,
        password: password
      });
      if (error) throw error;
      res.json({ token: data.session?.access_token });
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Invalid credentials" });
    }
  });

  // Posts Routes
  app.use("/api/opportunities", postsRoutes);

  // Sync Route
  app.post("/api/sync", authenticate, async (req, res) => {
    const { botToken, chatId } = req.body;
    console.log(`Sync started with botToken: ${botToken?.substring(0, 5)}... and chatId: ${chatId}`);
    try {
      const { data: offsetData, error: offsetError } = await supabase.from("settings").select("value").eq("key", "telegram_offset").maybeSingle();
      if (offsetError) {
        console.error("Failed to fetch telegram_offset:", offsetError);
        return res.status(500).json({ error: `Supabase error (settings): ${offsetError.message}` });
      }
      const offset = offsetData ? parseInt(offsetData.value) : 0;
      console.log(`Fetching updates from Telegram with offset: ${offset}`);
      
      const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}`);
      if (!response.data.ok) {
        console.error("Telegram API error:", response.data);
        return res.status(500).json({ error: `Telegram API error: ${response.data.description}` });
      }
      
      const updates = response.data.result;
      console.log(`Found ${updates.length} updates from Telegram.`);
      
      let importedCount = 0;
      let lastUpdateId = offset - 1;

      for (const update of updates) {
        lastUpdateId = update.update_id;
        const message = update.channel_post || update.message;
        if (!message || !message.text) continue;

        const telegramId = message.message_id.toString();
        const { data: existing, error: existingError } = await supabase.from("opportunities").select("id").eq("telegram_id", telegramId).maybeSingle();
        if (existingError) {
          console.error("Failed to check existing opportunity:", existingError);
          continue;
        }
        if (existing) continue;

        console.log(`Categorizing message: ${message.text.substring(0, 50)}...`);
        const data = await categorizeOpportunity(message.text);
        if (!data) {
          console.warn("Categorization returned null for message:", telegramId);
          continue;
        }

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

        if (insertError) {
          console.error("Failed to insert opportunity:", insertError);
        } else {
          importedCount++;
        }
      }

      if (lastUpdateId >= offset) {
        const { error: upsertError } = await supabase.from("settings").upsert({ key: "telegram_offset", value: (lastUpdateId + 1).toString() });
        if (upsertError) {
          console.error("Failed to update telegram_offset:", upsertError);
        }
      }
      
      console.log(`Sync completed. Imported ${importedCount} opportunities.`);
      res.json({ success: true, importedCount });
    } catch (error: any) {
      console.error("Sync failed with error:", error.message);
      if (error.response) {
        console.error("Telegram API response error:", error.response.data);
        return res.status(500).json({ error: `Telegram API error: ${error.response.data.description || error.message}` });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Next.js setup
  const dev = process.env.NODE_ENV !== "production";
  const nextApp = next({ dev, dir: path.join(process.cwd(), "apps/web") });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();
  app.all("*", (req, res) => handle(req, res));

  app.listen(config.port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

startServer();
