import { supabase } from "../supabase/client";
import * as mock from "./mock";
import { withFallback } from "./withFallback";
import { env } from "../env";
import { Lecture, Enrollment, User } from "./types";

// Determine data source mode
export type DataSourceMode = "MOCK" | "SUPABASE";
export const USE_MOCK = env.USE_MOCK || !supabase;
export const dataSourceMode: DataSourceMode = USE_MOCK ? "MOCK" : "SUPABASE";

// Debug logging
if (process.env.NODE_ENV === "development") {
  console.log(`[data-provider] Mode: ${dataSourceMode}`, {
    hasSupabase: !!supabase,
    forceMock: env.USE_MOCK,
    hasRealKeys: env.HAS_REAL_KEYS
  });
}

/**
 * Unified data access layer with automatic fallback
 */
export const data = {
  /**
   * List all active lectures
   */
  async listLectures(): Promise<Lecture[]> {
    if (USE_MOCK) {
      return mock.listLectures();
    }
    
    return withFallback(
      async () => {
        if (!supabase) throw new Error("Supabase client not available");
        
        const { data: lectures, error } = await supabase
          .from("lectures")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        return lectures ?? [];
      },
      () => mock.listLectures(),
      "listLectures"
    );
  },

  /**
   * Get lecture by ID
   */
  async getLectureById(id: string): Promise<Lecture | null> {
    if (USE_MOCK) {
      return mock.getLectureById(id);
    }
    
    return withFallback(
      async () => {
        if (!supabase) throw new Error("Supabase client not available");
        
        const { data: lecture, error } = await supabase
          .from("lectures")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        return lecture ?? null;
      },
      () => mock.getLectureById(id),
      "getLectureById"
    );
  },

  /**
   * Get lectures by category
   */
  async getLecturesByCategory(category: string): Promise<Lecture[]> {
    if (USE_MOCK) {
      return mock.getLecturesByCategory(category);
    }
    
    return withFallback(
      async () => {
        if (!supabase) throw new Error("Supabase client not available");
        
        let query = supabase
          .from("lectures")
          .select("*")
          .eq("status", "active");
          
        if (category !== 'all') {
          query = query.eq("category", category);
        }
        
        const { data: lectures, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        return lectures ?? [];
      },
      () => mock.getLecturesByCategory(category),
      "getLecturesByCategory"
    );
  },

  /**
   * Get user enrollments
   */
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    if (USE_MOCK) {
      return mock.getUserEnrollments(userId);
    }
    
    return withFallback(
      async () => {
        if (!supabase) throw new Error("Supabase client not available");
        
        const { data: enrollments, error } = await supabase
          .from("lecture_enrollments")
          .select("lecture_id, progress, completed")
          .eq("user_id", userId);
          
        if (error) throw error;
        return enrollments ?? [];
      },
      () => mock.getUserEnrollments(userId),
      "getUserEnrollments"
    );
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    if (USE_MOCK) {
      return mock.getCurrentUser();
    }
    
    return withFallback(
      async () => {
        if (!supabase) throw new Error("Supabase client not available");
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        if (!user) return null;
        
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: profile?.name || user.email?.split('@')[0],
          role: profile?.role || 'user'
        };
      },
      async () => {
        const user = await mock.getCurrentUser();
        if (!user) return null;
        return {
          id: user.id,
          email: user.email || undefined,
          name: user.name,
          role: user.role
        };
      },
      "getCurrentUser"
    );
  },

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    if (USE_MOCK) {
      return mock.signOut();
    }
    
    return withFallback(
      async () => {
        if (!supabase) throw new Error("Supabase client not available");
        
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      () => mock.signOut(),
      "signOut"
    );
  }
};