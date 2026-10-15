"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { identifyMixpanel, track } from "@/lib/track";

let lastPath = "";
let lastPathAt = 0;

export function Analytics() {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) identifyMixpanel(user.id);
  }, [user?.id]);

  useEffect(() => {
    const now = Date.now();
    if (lastPath === pathname && now - lastPathAt < 1000) return;
    lastPath = pathname;
    lastPathAt = now;
    track("page_viewed", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    const end = () => track("session_ended");
    window.addEventListener("pagehide", end);
    return () => window.removeEventListener("pagehide", end);
  }, []);

  return null;
}
