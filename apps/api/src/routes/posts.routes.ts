import { Router } from "express";
import { postsRepo } from "../db/posts.repo.js";
import { supabase } from "../db/supabaseClient.js";

const router = Router();

// Auth Middleware using Supabase
export const authenticate = async (req: any, res: any, next: any) => {
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

router.get("/", async (req, res) => {
  const { category, status, search } = req.query;
  const { data, error } = await postsRepo.getAll({ 
    category, 
    status: status || "approved", 
    search 
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await postsRepo.getById(req.params.id);
  if (error || !data) return res.status(404).json({ error: "Not found" });
  await postsRepo.incrementViews(req.params.id);
  res.json(data);
});

router.post("/:id/approve", authenticate, async (req, res) => {
  const { error } = await postsRepo.update(req.params.id, { status: "approved" });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete("/:id", authenticate, async (req, res) => {
  const { error } = await postsRepo.delete(req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.patch("/:id", authenticate, async (req, res) => {
  const { title, category, organization, deadline, description, apply_link, is_pinned, is_featured } = req.body;
  const { error } = await postsRepo.update(req.params.id, {
    title, category, organization, deadline, description, apply_link, 
    is_pinned: !!is_pinned, 
    is_featured: !!is_featured
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
