"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; email: string } | null;

type AuthState = {
  user: User;
  loading: boolean;
  // add login/logout methods if needed
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-only: restore session here (cookie/localStorage/fetch). For now, just stop loading.
    // Example:
    // const token = document.cookie.match(/auth=([^;]+)/)?.[1];
    // if (token) fetch("/api/me").then(r=>r.json()).then((u)=>setUser(u)).finally(()=>setLoading(false));
    // else setLoading(false);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  if (typeof window === "undefined") {
    throw new Error("useAuth()는 클라이언트에서만 호출해야 합니다 (SSR 금지).");
  }
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("AuthProvider 하위에서만 useAuth()를 호출하세요.");
  return ctx;
}