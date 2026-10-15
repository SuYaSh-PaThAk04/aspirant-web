import mixpanel from "mixpanel-browser";
import type { AnalyticsEventName } from "@/lib/analytics-events";

const SESSION_KEY = "aa_mix_session";
const SESSION_GAP = 30 * 60 * 1000;

let started = false;
let ready = false;

export type TrackProps = {
  postId?: string;
  path?: string;
};

function ensureMixpanel() {
  if (started) return;
  started = true;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;
  mixpanel.init(token, {
    track_pageview: false,
    autocapture: false,
    persistence: "localStorage",
  });
  ready = true;
}

function properties(props?: TrackProps) {
  const next: Record<string, string> = {};
  if (props?.postId) next.postId = props.postId;
  if (props?.path) next.path = props.path;
  return next;
}

function touchSession(event: AnalyticsEventName) {
  if (typeof sessionStorage === "undefined" || !ready) return;
  try {
    const at = Number(sessionStorage.getItem(SESSION_KEY) || 0);
    const fresh = event !== "session_ended" && event !== "session_started" && (!at || Date.now() - at > SESSION_GAP);
    sessionStorage.setItem(SESSION_KEY, String(Date.now()));
    if (fresh) mixpanel.track("session_started");
  } catch {
    // Private browsing can block sessionStorage. The event itself still sends.
  }
}

export function trackMixpanel(event: AnalyticsEventName, props?: TrackProps) {
  ensureMixpanel();
  touchSession(event);
  if (!ready) return;
  mixpanel.track(event, properties(props), event === "session_ended" ? { transport: "sendBeacon" } : undefined);
}

export function identifyMixpanel(id: string) {
  ensureMixpanel();
  if (!ready || !id) return;
  mixpanel.identify(id);
}

export function resetMixpanel() {
  ensureMixpanel();
  if (!ready) return;
  mixpanel.reset();
}

export function track(event: AnalyticsEventName, props?: TrackProps) {
  const body = JSON.stringify({
    eventId: crypto.randomUUID(),
    event,
    ...(props?.postId ? { postId: props.postId } : {}),
    path: props?.path || (typeof location !== "undefined" ? location.pathname : ""),
    referrer: typeof document !== "undefined" ? document.referrer : "",
  });
  const url = "/api/analytics";
  if (event === "session_ended" && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  } else {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  }
  trackMixpanel(event, props);
}
