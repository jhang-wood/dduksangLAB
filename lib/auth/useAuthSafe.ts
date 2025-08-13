"use client";

import { useState, useEffect } from "react";
import { data } from "../data/provider";
import { User } from "../data/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  mounted: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
}

/**
 * Safe authentication hook with SSR protection and error handling
 */
export function useAuthSafe(): AuthState & {
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    mounted: false,
    status: "loading"
  });

  const isSSR = typeof window === "undefined";

  useEffect(() => {
    // Skip loading user in SSR
    if (isSSR) return;

    let mounted = true;

    const loadUser = async () => {
      try {
        setAuthState(prev => ({ ...prev, loading: true, mounted: true }));
        
        const user = await data.getCurrentUser();
        
        if (mounted) {
          setAuthState({
            user,
            loading: false,
            mounted: true,
            status: user ? "authenticated" : "unauthenticated"
          });
        }
      } catch (error) {
        // Only log auth errors in development
        if (process.env.NODE_ENV === "development") {
          console.warn("[useAuthSafe] Failed to load user:", error);
        }
        if (mounted) {
          setAuthState({
            user: null,
            loading: false,
            mounted: true,
            status: "unauthenticated"
          });
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [isSSR]); // Add isSSR to dependencies

  const signOut = async () => {
    try {
      await data.signOut();
      setAuthState(prev => ({
        ...prev,
        user: null,
        status: "unauthenticated"
      }));
    } catch (error) {
      // Only log sign out errors in development
      if (process.env.NODE_ENV === "development") {
        console.error("[useAuthSafe] Sign out failed:", error);
      }
    }
  };

  const refresh = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const user = await data.getCurrentUser();
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false,
        status: user ? "authenticated" : "unauthenticated"
      }));
    } catch (error) {
      // Only log refresh errors in development
      if (process.env.NODE_ENV === "development") {
        console.warn("[useAuthSafe] Refresh failed:", error);
      }
      setAuthState(prev => ({
        ...prev,
        loading: false,
        status: "unauthenticated"
      }));
    }
  };

  // Return safe defaults for SSR
  if (isSSR) {
    return {
      user: null,
      loading: false,
      mounted: false,
      status: "unauthenticated",
      signOut: async () => {},
      refresh: async () => {}
    };
  }

  return {
    ...authState,
    signOut,
    refresh
  };
}