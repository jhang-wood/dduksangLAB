import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, SignUpMetadata } from '@/types';
import { createUserProfile, getUserProfile, validateSignupData } from '@/lib/auth-utils';
import { logger } from '@/lib/logger';

export interface AuthStore {
  // State
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  mounted: boolean;
  
  // Actions
  setMounted: () => void;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: SupabaseAuthError | null }>;
  signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<{ error: SupabaseAuthError | null }>;
  signOut: () => Promise<void>;
  
  // Computed properties
  isAdmin: boolean;
  
  // Internal methods
  fetchUserProfile: (userId: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

// Next.js App Router용 스토어 팩토리 함수
export const createAuthStore = () => {
  return createStore<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userProfile: null,
      loading: true,
      mounted: false,
      isAdmin: false,

      // Actions
      setMounted: () => {
        set({ mounted: true });
        // Initialize auth after mounting
        get().initializeAuth();
      },

      setUser: (user) => {
        set({ user });
        // Recalculate isAdmin when user changes
        const { userProfile, mounted } = get();
        const isAdmin = mounted && userProfile?.role === 'admin';
        set({ isAdmin });
      },

      setUserProfile: (userProfile) => {
        set({ userProfile });
        // Recalculate isAdmin when profile changes
        const { mounted } = get();
        const isAdmin = mounted && userProfile?.role === 'admin';
        set({ isAdmin });
      },

      setLoading: (loading) => set({ loading }),

      // Fetch user profile
      fetchUserProfile: async (userId: string) => {
        logger.log('[AuthStore] Fetching profile for user:', userId);
        
        const result = await getUserProfile(userId);
        
        if (result.success && result.profile) {
          logger.log('[AuthStore] Profile fetched:', result.profile);
          get().setUserProfile(result.profile as UserProfile);
        } else {
          // Try to create profile if it doesn't exist
          logger.log('[AuthStore] Profile not found, creating new profile...');
          const { data: userData } = await supabase.auth.getUser();

          if (userData?.user) {
            const createResult = await createUserProfile({
              id: userId,
              email: userData.user.email!,
              name: userData.user.email?.split('@')[0] ?? 'User',
              role: 'user',
            });

            if (createResult.success && createResult.profile) {
              logger.log('[AuthStore] Profile created:', createResult.profile);
              get().setUserProfile(createResult.profile as UserProfile);
            } else {
              logger.error('[AuthStore] Failed to create profile:', createResult.error);
              get().setUserProfile(null);
            }
          } else {
            get().setUserProfile(null);
          }
        }
      },

      // Initialize authentication
      initializeAuth: async () => {
        if (typeof window === 'undefined') return; // Server-side guard
        
        try {
          // Initial session check
          const { data: { session } } = await supabase.auth.getSession();
          get().setUser(session?.user ?? null);
          
          if (session?.user) {
            await get().fetchUserProfile(session.user.id);
          }
          
          get().setLoading(false);

          // Auth state change listener
          supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
            get().setUser(session?.user ?? null);
            
            if (session?.user) {
              await get().fetchUserProfile(session.user.id);
            } else {
              get().setUserProfile(null);
            }
          });
        } catch (error) {
          logger.error('[AuthStore] Initialization error:', error);
          get().setLoading(false);
        }
      },

      // Sign in
      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data.user) {
          await get().fetchUserProfile(data.user.id);
        }

        return { error };
      },

      // Sign up
      signUp: async (email: string, password: string, metadata?: SignUpMetadata) => {
        // Input validation
        const validation = validateSignupData({
          email,
          password,
          name: metadata?.name,
          phone: metadata?.phone,
        });

        if (!validation.isValid) {
          return {
            error: {
              message: validation.errors[0],
            } as SupabaseAuthError,
          };
        }

        const { data, error } = await supabase.auth.signUp(
          metadata
            ? {
                email,
                password,
                options: {
                  data: metadata,
                },
              }
            : {
                email,
                password,
              }
        );

        if (data.user && !error) {
          // Create user profile
          const createResult = await createUserProfile({
            id: data.user.id,
            email: data.user.email!,
            name: metadata?.name ?? email.split('@')[0],
            phone: metadata?.phone,
            role: 'user',
          });

          if (!createResult.success) {
            logger.error('Profile creation error:', createResult.error);
            // Continue even if profile creation fails
          }
        }

        return { error };
      },

      // Sign out
      signOut: async () => {
        await supabase.auth.signOut();
        get().setUserProfile(null);
        
        // Navigate to home (if router is available)
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Server-side fallback
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        // Only persist user and userProfile, not loading/mounted states
        user: state.user,
        userProfile: state.userProfile,
      }),
      skipHydration: true, // Critical for SSR safety
    }
  )
  );
};