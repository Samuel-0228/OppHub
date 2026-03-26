import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env.js";

export const supabase = createClient(config.supabaseUrl, config.supabaseKey);
export const supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceKey);
