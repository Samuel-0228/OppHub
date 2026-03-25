import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@opphub.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Bootstrap Admin User
async function bootstrapAdmin() {
  if (!supabaseServiceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set. Skipping admin user bootstrap.");
    return;
  }

  console.log(`Bootstrapping admin user: ${ADMIN_EMAIL}...`);
  try {
    // Check if user exists
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const adminUser = users.users.find(u => u.email === ADMIN_EMAIL);

    if (adminUser) {
      console.log("Admin user exists. Updating password...");
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
        password: ADMIN_PASSWORD,
        email_confirm: true
      });
      if (updateError) throw updateError;
    } else {
      console.log("Admin user does not exist. Creating...");
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { role: "admin" }
      });
      if (createError) throw createError;
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

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Auth Middleware using Supabase
  const authenticate = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) throw error;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired session" });
    }
  };

  // API Routes
  app.get("/api/health", async (req, res) => {
    try {
      const { data: opps, error: oppsError } = await supabase.from("opportunities").select("id").limit(1);
      const { data: settings, error: settingsError } = await supabase.from("settings").select("key").limit(1);
      
      res.json({
        status: "ok",
        supabase: {
          opportunities_table: !oppsError,
          settings_table: !settingsError,
          errors: {
            opportunities: oppsError?.message,
            settings: settingsError?.message
          }
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

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

  app.post("/api/login", async (req, res) => {
    const { password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password
      });

      if (error) throw error;
      res.json({ token: data.session?.access_token });
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Invalid password" });
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
    console.log("Manual sync triggered...");
    try {
      // Get last offset - use maybeSingle to avoid error if not found
      const { data: offsetData, error: offsetError } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "telegram_offset")
        .maybeSingle();
      
      if (offsetError) console.error("Error fetching offset:", offsetError);
      const offset = offsetData ? parseInt(offsetData.value) : 0;
      console.log(`Current Telegram offset: ${offset}`);

      const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}`);
      const updates = response.data.result;
      console.log(`Fetched ${updates.length} updates from Telegram.`);
      
      let importedCount = 0;
      let lastUpdateId = offset - 1;

      for (const update of updates) {
        lastUpdateId = update.update_id;
        const message = update.channel_post || update.message;
        if (!message || !message.text) continue;

        const telegramId = message.message_id.toString();
        
        // Check if already exists - use maybeSingle
        const { data: existing, error: checkError } = await supabase
          .from("opportunities")
          .select("id")
          .eq("telegram_id", telegramId)
          .maybeSingle();
        
        if (checkError) console.error("Error checking existing:", checkError);
        if (existing) {
          console.log(`Skipping duplicate Telegram ID: ${telegramId}`);
          continue;
        }

        console.log(`Processing message ${telegramId} with AI...`);
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

        if (insertError) {
          console.error(`Error inserting opportunity ${telegramId}:`, insertError);
        } else {
          console.log(`Successfully imported opportunity: ${data.title}`);
          importedCount++;
        }
      }

      if (lastUpdateId >= offset) {
        const { error: upsertError } = await supabase
          .from("settings")
          .upsert({ key: "telegram_offset", value: (lastUpdateId + 1).toString() });
        if (upsertError) console.error("Error updating offset:", upsertError);
      }

      res.json({ success: true, importedCount });
    } catch (error: any) {
      console.error("Sync process error:", error);
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
    console.log("Background poll checking for updates...");
    const { data: botTokenData, error: tokenError } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "telegram_bot_token")
      .maybeSingle();
    
    if (tokenError) {
      console.error("Background poll: Error fetching bot token:", tokenError);
      return;
    }
    if (!botTokenData?.value) {
      console.log("Background poll: No bot token found in settings.");
      return;
    }

    try {
      const { data: offsetData, error: offsetError } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "telegram_offset")
        .maybeSingle();
      
      if (offsetError) console.error("Background poll: Error fetching offset:", offsetError);
      const offset = offsetData ? parseInt(offsetData.value) : 0;

      const response = await axios.get(`https://api.telegram.org/bot${botTokenData.value}/getUpdates?offset=${offset}`);
      const updates = response.data.result;
      
      if (updates.length > 0) {
        console.log(`Background poll: Found ${updates.length} new updates.`);
      }
      
      let lastUpdateId = offset - 1;

      for (const update of updates) {
        lastUpdateId = update.update_id;
        const message = update.channel_post || update.message;
        if (!message || !message.text) continue;

        const telegramId = message.message_id.toString();
        
        // Check if already exists
        const { data: existing, error: checkError } = await supabase
          .from("opportunities")
          .select("id")
          .eq("telegram_id", telegramId)
          .maybeSingle();
        
        if (checkError) console.error("Background poll: Error checking existing:", checkError);
        if (existing) continue;

        console.log(`Background poll: Processing message ${telegramId}...`);
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

        if (insertError) {
          console.error(`Background poll: Error inserting ${telegramId}:`, insertError);
        } else {
          console.log(`Background poll: Imported ${data.title}`);
        }
      }

      if (lastUpdateId >= offset) {
        const { error: upsertError } = await supabase
          .from("settings")
          .upsert({ key: "telegram_offset", value: (lastUpdateId + 1).toString() });
        if (upsertError) console.error("Background poll: Error updating offset:", upsertError);
      }
    } catch (error) {
      console.error("Background poll error:", error);
    }
  };

  setInterval(pollTelegram, 5 * 60 * 1000);
  pollTelegram();
}

startServer();
