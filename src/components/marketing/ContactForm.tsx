"use client";

import React, { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sent");
    event.currentTarget.reset();
    window.setTimeout(() => setStatus("idle"), 2500);
  };

  const fieldClass =
    "w-full rounded-xl border border-[#4f46e5]/20 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-body text-sm font-medium text-ink/80"
        >
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block font-body text-sm font-medium text-ink/80"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-body text-sm font-medium text-ink/80"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-body text-sm font-medium text-ink/80"
        >
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell us how we can help you..."
          rows={5}
          required
          className={`${fieldClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sent"}
        className="w-full rounded-full bg-[#4f46e5] py-3.5 font-body text-sm font-semibold text-white transition-all hover:bg-[#4338ca] hover:scale-[1.01] disabled:cursor-default disabled:opacity-90"
      >
        {status === "sent" ? "Message Sent!" : "Send Message"}
      </button>

      {status === "sent" && (
        <p className="text-center font-body text-sm text-[#4f46e5]">
          Thank you — we&apos;ll get back to you soon.
        </p>
      )}
    </form>
  );
}
