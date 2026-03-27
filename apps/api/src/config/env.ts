import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required.`);
  }
  return value;
};

export const config = {
  supabaseUrl: getEnv("SUPABASE_URL"),
  supabaseKey: getEnv("SUPABASE_ANON_KEY"),
  supabaseServiceKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  adminEmail: getEnv("ADMIN_EMAIL", "admin@opphub.com"),
  adminPassword: getEnv("ADMIN_PASSWORD", "admin123"),
  geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  port: 3000,
};
