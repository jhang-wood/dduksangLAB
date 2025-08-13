import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

/**
 * Safe Supabase client creation
 * Returns null if real keys are not available
 */
export const supabase = (() => {
  if (env.HAS_REAL_KEYS && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    try {
      return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    } catch (error) {
      console.error("[supabase] Failed to create client:", error);
      return null;
    }
  }
  
  if (process.env.NODE_ENV === "development") {
    console.log("[supabase] Using mock mode - no real keys available");
  }
  
  return null;
})();

export type SupabaseClient = typeof supabase;