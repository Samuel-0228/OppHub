import { supabase } from "./supabaseClient.js";

export const postsRepo = {
  async getAll(filters: any = {}) {
    let query = supabase.from("opportunities").select("*");
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,organization.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    return query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
  },

  async getById(id: string) {
    return supabase.from("opportunities").select("*").eq("id", id).single();
  },

  async create(data: any) {
    return supabase.from("opportunities").insert(data);
  },

  async update(id: string, data: any) {
    return supabase.from("opportunities").update(data).eq("id", id);
  },

  async delete(id: string) {
    return supabase.from("opportunities").delete().eq("id", id);
  },

  async incrementViews(id: string) {
    return supabase.rpc("increment_view_count", { row_id: id });
  }
};
