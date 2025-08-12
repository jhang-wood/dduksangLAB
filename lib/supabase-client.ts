import { createClient } from '@supabase/supabase-js';

// Environment variables (required)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
// Validate environment variables - Skip in CI/test environments
const isCIEnvironment = process.env.CI === "true" || process.env.NODE_ENV === "test";
if (!isCIEnvironment && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error("Missing required Supabase environment variables. Please check your .env file.");
}

// Log environment variable status for debugging (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Client Environment Check:', {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    urlPreview: `${supabaseUrl.substring(0, 30)}...`,
    keyPreview: `${supabaseAnonKey.substring(0, 20)}...`,
  });
}

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
