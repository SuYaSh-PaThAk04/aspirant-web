"use client";

import { Phone, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const dismissedKey = "aa-join-dismissed";

export function JoinPanel({ onContinue }: { onContinue: () => void }) {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(dismissedKey, "1");
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (sessionStorage.getItem(dismissedKey) === "1") return;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [dismiss, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-panel-title"
      className="fixed inset-0 z-40 hidden items-center justify-center bg-heading/50 p-4 backdrop-blur-[2px] lg:flex"
    >
      <div className="border-line bg-card text-heading relative w-full max-w-sm rounded-2xl border p-5 shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="text-heading absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-sunken"
        >
          <X size={16} />
        </button>
        <p id="join-panel-title" className="pr-8 text-2xl leading-tight font-bold">
          Join the aspirant first platform on the internet
        </p>
        <div className="my-4 flex max-h-52 items-center justify-center">
          <img src="/join-illustration.png" alt="" className="max-h-52 w-full object-contain" />
        </div>
        <button
          type="button"
          onClick={() => {
            dismiss();
            onContinue();
          }}
          className="border-line text-heading bg-sunken flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold whitespace-nowrap"
        >
          <Phone size={18} className="shrink-0" />
          Continue with Phone Number
        </button>
        <p className="text-muted mt-3 text-center text-xs">We will text you a code. Same signup as the Aspirant Adda app.</p>
      </div>
    </div>
  );
}
