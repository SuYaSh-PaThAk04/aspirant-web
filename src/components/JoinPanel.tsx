"use client";

import { Phone } from "lucide-react";

export function JoinPanel({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="border-line bg-card text-heading flex flex-col rounded-2xl border p-5 lg:h-[calc((100vh-6.25rem)/2)]">
      <p className="text-2xl leading-tight font-bold">Join the aspirant first platform on the internet</p>
      <div className="my-3 flex max-h-36 min-h-0 items-center justify-center lg:max-h-none lg:flex-1">
        <img src="/join-illustration.png" alt="" className="max-h-full w-full object-contain" />
      </div>
      <div>
        <button
          type="button"
          onClick={onContinue}
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
