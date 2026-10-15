"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Phone, X } from "lucide-react";
import { OpenInAppButton } from "@/components/OpenInApp";
import { ThemeImage } from "@/components/ThemeImage";
import type { SessionUser } from "@/lib/session";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";
import { trackMixpanel } from "@/lib/track";
import { normalizeUsername, suggestUsername } from "@/lib/username";

const phonePattern = /^[6-9]\d{9}$/;
const helpUrl = "https://wa.me/+917011596808?text=Hi%2C+I+need+help+with+Aspirant+Adda+App";

export type WebAction =
  | { type: "like" }
  | { type: "comment"; text: string; parentCommentId?: string }
  | { type: "continue" };

export type LoginRequest = {
  pendingPostId?: string;
  action?: WebAction;
  openApp?: boolean;
  appNote?: string;
  onDone?: (result: { actionError: string | null; user: SessionUser }) => void;
};

export function LoginSheet({
  open,
  request,
  onClose,
  onAuthed,
}: {
  open: boolean;
  request: LoginRequest | null;
  onClose: () => void;
  onAuthed: (user: SessionUser) => void;
}) {
  const [step, setStep] = useState<"phone" | "otp" | "username" | "app">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [seconds, setSeconds] = useState(60);
  const otpRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep("phone");
    setPhone("");
    setOtp("");
    setUsername("");
    setError("");
    setActionError("");
    setSeconds(60);
  }, [open]);

  useEffect(() => {
    if (!open || step !== "username") return;
    usernameRef.current?.focus();
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== "otp" || seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [open, step, seconds]);

  if (!open) return null;

  const phoneReady = phonePattern.test(phone);

  async function sendCode(event?: React.FormEvent) {
    event?.preventDefault();
    if (!phoneReady || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message || "Could not send the code.");
        return;
      }
      setOtp("");
      setSeconds(60);
      setStep("otp");
    } catch {
      setError("Could not send the code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event?: React.FormEvent) {
    event?.preventDefault();
    if (otp.length !== 6 || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp,
          ...(request?.pendingPostId ? { pendingPostId: request.pendingPostId } : {}),
          action: request?.action ?? { type: "continue" },
        }),
      });
      const data = (await response.json()) as {
        message?: string;
        actionError?: string | null;
        user?: SessionUser;
        isNew?: boolean;
      };
      if (!response.ok || !data.user) {
        setError(data.message || "That code is not valid.");
        return;
      }
      if (data.isNew) trackMixpanel("signup_completed");
      onAuthed(data.user);
      request?.onDone?.({ actionError: data.actionError ?? null, user: data.user });
      if (!data.user.username) {
        setUsername(suggestUsername(data.user.name));
        setActionError(data.actionError || "");
        setStep("username");
        return;
      }
      const needsApp = Boolean(request?.openApp) || !data.user.name;
      if (needsApp) {
        setActionError(data.actionError || "");
        setStep("app");
        return;
      }
      onClose();
    } catch {
      setError("Could not verify the code.");
    } finally {
      setBusy(false);
    }
  }

  async function saveUsername(event?: React.FormEvent) {
    event?.preventDefault();
    const next = normalizeUsername(username);
    if (next.length < 3 || busy) {
      if (next.length < 3) setError("Username must be at least 3 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: next }),
      });
      const data = (await response.json()) as { message?: string; user?: SessionUser };
      if (!response.ok || !data.user?.username) {
        setError(data.message || "Could not save that username.");
        return;
      }
      onAuthed(data.user);
      const needsApp = Boolean(request?.openApp) || !data.user.name;
      if (needsApp) {
        setStep("app");
        return;
      }
      onClose();
    } catch {
      setError("Could not save that username.");
    } finally {
      setBusy(false);
    }
  }

  const activeIndex = Math.min(otp.length, 5);
  const usernameReady = normalizeUsername(username).length >= 3;

  const continueClass = (ready: boolean) =>
    `w-full rounded-full px-8 py-3.5 text-sm font-bold ${
      ready && !busy ? "bg-accent text-on-primary shadow-md" : "bg-line text-muted"
    }`;

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-heading/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={() => {
        if (step !== "username") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="border-line relative w-full max-w-[420px] overflow-hidden rounded-t-3xl border bg-card shadow-2xl sm:rounded-3xl"
      >
        {step === "otp" || step === "username" ? null : (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:bg-sunken absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full"
          >
            <X size={16} />
          </button>
        )}

        <div className="px-6 pt-8 pb-6">
          {step === "app" ? (
            <div className="flex flex-col">
              <h2 id="login-title" className="text-heading text-2xl leading-8 font-bold">
                Continue in the Aspirant Adda app
              </h2>
              <p className="text-muted mt-2 text-sm leading-6">
                {request?.appNote || "Your number is on Aspirant Adda. Open the app to finish."}
              </p>
              {actionError ? <p className="text-danger mt-3 text-sm">{actionError}</p> : null}
              <div className="mt-4">
                <OpenInAppButton postId={request?.pendingPostId} label="Continue in app" prominent />
              </div>
              <p className="text-muted mt-3 text-center text-xs">
                <a href={PLAY_STORE_URL} className="underline">
                  Play Store
                </a>
                {" · "}
                <a href={APP_STORE_URL} className="underline">
                  App Store
                </a>
              </p>
              <button type="button" className="text-muted mt-2 w-full py-1 text-sm" onClick={onClose}>
                Keep reading
              </button>
              <ThemeImage
                alt="Connecting Aspirants"
                className="-mx-6 -mb-6 mt-4 max-h-[36vh] w-[calc(100%+3rem)] object-contain object-bottom"
              />
            </div>
          ) : step === "username" ? (
            <form onSubmit={(event) => void saveUsername(event)}>
              <h2 id="login-title" className="text-heading text-[26px] leading-8 font-bold">
                Choose a username
              </h2>
              <p className="text-muted mt-2 text-[15px] leading-6">
                This will be your unique identifier on Aspirant Adda.
              </p>
              <label className="text-heading mt-6 block text-sm font-medium" htmlFor="login-username">
                Username
              </label>
              <div
                className={`bg-sunken mt-2 flex h-14 items-center rounded-2xl border px-3 ${
                  error ? "border-danger" : focused ? "border-accent ring-4 ring-accent/15" : "border-line"
                }`}
              >
                <span className="text-heading pr-1 text-sm font-bold">@</span>
                <input
                  ref={usernameRef}
                  id="login-username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => {
                    setError("");
                    setUsername(normalizeUsername(event.target.value));
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{ background: "transparent" }}
                  className="text-heading w-full border-0 text-base outline-none"
                />
              </div>
              {error ? <p className="text-danger mt-3 text-sm">{error}</p> : null}
              <button type="submit" disabled={!usernameReady || busy} className={`mt-6 ${continueClass(usernameReady)}`}>
                {busy ? "Please wait…" : "Continue"}
              </button>
            </form>
          ) : step === "phone" ? (
            <form onSubmit={(event) => void sendCode(event)}>
              <span className="bg-accent-soft text-accent flex size-14 items-center justify-center rounded-2xl">
                <Phone size={26} />
              </span>
              <h2 id="login-title" className="text-heading mt-5 text-[26px] leading-8 font-bold">
                Welcome to Aspirant Adda
              </h2>
              <p className="text-muted mt-2 text-[15px] leading-6">Enter your phone number to make your account</p>

              <label className="text-heading mt-6 block text-sm font-medium" htmlFor="login-phone">
                Number
              </label>
              <div
                className={`bg-sunken mt-2 flex h-14 items-center rounded-2xl border px-3 ${
                  focused ? "border-accent ring-4 ring-accent/15" : "border-line"
                }`}
              >
                <span className="text-heading border-line border-r pr-3 text-sm font-bold">+91</span>
                <input
                  id="login-phone"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{ background: "transparent" }}
                  className="text-heading placeholder:text-muted w-full border-0 px-3 text-lg tracking-[0.18em] outline-none placeholder:text-sm placeholder:tracking-normal"
                />
              </div>
              <p className="text-muted mt-2 text-sm leading-5">We&apos;ll verify your device and send you an OTP</p>
              {error ? <p className="text-danger mt-3 text-sm">{error}</p> : null}
              <button type="submit" disabled={!phoneReady || busy} className={`mt-6 ${continueClass(phoneReady)}`}>
                {busy ? "Please wait…" : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={(event) => void verifyCode(event)}>
              <div className="mb-5 flex items-center justify-between">
                <button
                  type="button"
                  className="text-heading hover:bg-sunken flex size-9 items-center justify-center rounded-full"
                  aria-label="Back"
                  onClick={() => setStep("phone")}
                >
                  <ChevronLeft size={22} />
                </button>
                <a href={helpUrl} className="text-accent text-sm font-medium" target="_blank" rel="noreferrer">
                  Help
                </a>
              </div>
              <h2 id="login-title" className="text-heading text-[26px] leading-8 font-bold">
                Welcome to Aspirant Adda
              </h2>
              <p className="text-muted mt-2 text-[15px] leading-6">
                We&apos;ve sent a code to your number. Verify to join the community and start growing together.
              </p>
              <div className="mt-6 mb-2 flex items-center justify-between">
                <span className="text-heading text-sm font-medium">OTP</span>
                {error ? <span className="text-danger text-xs">{error}</span> : null}
              </div>
              <button type="button" className="relative block w-full" onClick={() => otpRef.current?.focus()}>
                <span className="flex justify-between gap-2">
                  {Array.from({ length: 6 }).map((_, index) => {
                    const active = focused && index === activeIndex && !error;
                    const filled = Boolean(otp[index]);
                    return (
                      <span
                        key={index}
                        className={`flex size-12 items-center justify-center rounded-2xl border text-lg font-bold ${
                          error
                            ? "border-danger text-danger"
                            : active
                              ? "border-accent ring-accent/15 ring-4"
                              : filled
                                ? "border-accent bg-accent-soft text-heading"
                                : "border-line bg-sunken text-heading"
                        }`}
                      >
                        {otp[index] ? otp[index] : active ? <span className="bg-accent h-5 w-px" /> : null}
                      </span>
                    );
                  })}
                </span>
                <input
                  ref={otpRef}
                  value={otp}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-label="OTP"
                  onChange={(event) => {
                    setError("");
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="absolute inset-0 opacity-[0.02]"
                />
              </button>
              <p className="text-muted mt-3 text-sm">
                Didn&apos;t receive it?{" "}
                {seconds > 0 ? (
                  <span className="text-accent font-medium">00:{String(seconds).padStart(2, "0")}</span>
                ) : (
                  <button type="button" className="text-accent font-medium" onClick={() => void sendCode()}>
                    Resend
                  </button>
                )}
              </p>
              <button type="submit" disabled={otp.length !== 6 || busy} className={`mt-6 ${continueClass(otp.length === 6)}`}>
                {busy ? "Please wait…" : "Continue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
