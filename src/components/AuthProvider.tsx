"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LoginSheet, type LoginRequest } from "@/components/LoginSheet";
import type { SessionUser } from "@/lib/session";
import { resetMixpanel, track } from "@/lib/track";

type AuthValue = {
  user: SessionUser | null;
  ready: boolean;
  login: (request?: LoginRequest) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<LoginRequest | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data: { user?: SessionUser | null }) => {
        if (!cancelled) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function login(next: LoginRequest = {}) {
    setRequest(next);
    setOpen(true);
    track("signup_started");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    resetMixpanel();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
      <LoginSheet open={open} request={request} onClose={() => setOpen(false)} onAuthed={setUser} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
