"use client";

import { APP_STORE_URL, appPostUrl, PLAY_STORE_URL } from "@/lib/site";

export function openInApp(postId?: string) {
  const appUrl = postId ? appPostUrl(postId) : "https://aspirantadda.in";
  const agent = navigator.userAgent;
  const isAndroid = /Android/i.test(agent);
  const isIOS = /iPhone|iPad|iPod/i.test(agent);
  if (!isAndroid && !isIOS) {
    window.location.href = appUrl;
    return;
  }
  const store = isIOS ? APP_STORE_URL : PLAY_STORE_URL;
  const started = Date.now();
  window.location.href = appUrl;
  window.setTimeout(() => {
    if (document.visibilityState === "visible" && Date.now() - started < 2500) {
      window.location.href = store;
    }
  }, 1200);
}

export function OpenInAppButton({
  postId,
  label,
  prominent = false,
}: {
  postId?: string;
  label: string;
  prominent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => openInApp(postId)}
      className={
        prominent
          ? "bg-accent text-on-primary w-full rounded-xl px-4 py-3 text-sm font-bold"
          : "text-accent text-sm font-bold"
      }
    >
      {label}
    </button>
  );
}
