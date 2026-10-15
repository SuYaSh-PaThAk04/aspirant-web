export const ANALYTICS_EVENTS = [
  "page_viewed",
  "post_viewed",
  "post_liked",
  "post_commented",
  "post_shared",
  "signup_started",
  "signup_completed",
  "session_started",
  "session_ended",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];
