import { createClient } from '@supabase/supabase-js';

// Environment variables (required)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Validate environment variables
// Validate environment variables - Skip in CI/test/build environments
const isCIEnvironment = process.env.CI === "true" || process.env.NODE_ENV === "test" || process.env.VERCEL === "1";
const hasValidUrl = supabaseUrl && supabaseUrl !== "" && !supabaseUrl.includes("placeholder");
const hasValidKey = supabaseAnonKey && supabaseAnonKey !== "" && !supabaseAnonKey.includes("placeholder");

if (!isCIEnvironment && (!hasValidUrl || !hasValidKey)) {
  console.warn("⚠️  Supabase environment variables not properly configured. Some features may not work.");
  // Don't throw error to allow build to proceed
}

// Environment variable status check moved to development logs only when needed

// Singleton Supabase client instance to prevent multiple GoTrueClient instances
let supabaseInstance: any = null;

const createSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'sb-dduksang-auth-token',
        flowType: 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': 'dduksang-lab@0.1.0',
        },
      },
    });
  }
  return supabaseInstance;
};

// Client-side Supabase client (uses anon key)
export const supabase = createSupabaseClient();

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
