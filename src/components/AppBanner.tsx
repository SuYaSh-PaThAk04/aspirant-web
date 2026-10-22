"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { openInApp } from "@/components/OpenInApp";
import { ThemeImage } from "@/components/ThemeImage";

const dismissedKey = "aa-open-app-dismissed";

export function OpenAppPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    if (sessionStorage.getItem(dismissedKey) === "1") return;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    sessionStorage.setItem(dismissedKey, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-heading/50 p-4 backdrop-blur-[2px] lg:hidden">
      <div className="border-line relative w-full max-w-sm overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="text-heading absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-card/90 shadow-sm"
        >
          <X size={16} />
        </button>
        <button type="button" onClick={() => openInApp()} className="block w-full">
          <ThemeImage alt="Connecting Aspirants" className="max-h-[70vh] w-full object-cover object-top" />
        </button>
      </div>
    </div>
  );
}
