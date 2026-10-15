import { cookies } from "next/headers";
import type { Collection } from "mongodb";
import { ANALYTICS_EVENTS, type AnalyticsEventName } from "@/lib/analytics-events";
import { getAnalyticsDb } from "@/lib/mongo";

export const ANON_COOKIE = "aa_anon";
export const SESSION_COOKIE = "aa_sid";
export const UID_COOKIE = "aa_uid";

export type { AnalyticsEventName };

const POST_EVENTS = new Set<AnalyticsEventName>(["post_viewed", "post_liked", "post_commented", "post_shared"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OBJECT_ID = /^[a-f0-9]{24}$/i;
const CRAWLER =
  /crawler|spider|slurp|facebookexternalhit|embedly|pinterestbot|slackbot|discordbot|googlebot|bingbot|yandexbot|baiduspider|duckduckbot|applebot|petalbot|headlesschrome|lighthouse|wget\/|curl\/|telegrambot|twitterbot/i;

const YEAR = 60 * 60 * 24 * 365;
const MONTH = 60 * 60 * 24 * 30;
const HALF_HOUR = 60 * 30;

export type ClientEvent = {
  event: AnalyticsEventName;
  eventId: string;
  postId: string | null;
  path: string;
  referrer: string;
};

type AnalyticsDoc = {
  eventId: string;
  event: AnalyticsEventName;
  userId: string | null;
  anonymousId: string;
  sessionId: string;
  postId: string | null;
  platform: "web";
  receivedAt: Date;
  metadata: {
    path: string;
    referrer: string;
    device: "mobile" | "tablet" | "desktop";
  };
};

let indexesReady: Promise<void> | null = null;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === "string" && (ANALYTICS_EVENTS as readonly string[]).includes(value);
}

function deviceOf(ua: string): AnalyticsDoc["metadata"]["device"] {
  const agent = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(agent) || (/android/.test(agent) && !/mobile/.test(agent))) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(agent)) return "mobile";
  return "desktop";
}

function isDuplicate(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 11000;
}

function ensureIndexes(events: Collection<AnalyticsDoc>) {
  if (!indexesReady) {
    indexesReady = events
      .createIndexes([
        { key: { eventId: 1 }, unique: true, name: "eventId_unique" },
        { key: { receivedAt: 1, event: 1 }, name: "receivedAt_event" },
        { key: { event: 1, postId: 1, receivedAt: 1 }, name: "event_postId_receivedAt" },
        { key: { sessionId: 1, receivedAt: 1 }, name: "sessionId_receivedAt" },
        { key: { anonymousId: 1, receivedAt: 1 }, name: "anonymousId_receivedAt" },
      ])
      .then(() => undefined)
      .catch((error: unknown) => {
        indexesReady = null;
        throw error;
      });
  }
  return indexesReady;
}

async function insertEvent(events: Collection<AnalyticsDoc>, doc: AnalyticsDoc) {
  try {
    await events.insertOne(doc);
  } catch (error) {
    if (!isDuplicate(error)) throw error;
  }
}

export function readClientEvent(body: unknown): ClientEvent | null {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  if (!record || !isEventName(record.event)) return null;
  const eventId = typeof record.eventId === "string" ? record.eventId.trim() : "";
  if (!UUID.test(eventId)) return null;
  const postId = clip(record.postId, 24).toLowerCase();
  if (POST_EVENTS.has(record.event) && !OBJECT_ID.test(postId)) return null;
  const path = clip(record.path, 300);
  return {
    event: record.event,
    eventId,
    postId: OBJECT_ID.test(postId) ? postId : null,
    path: path.startsWith("/") ? path : "",
    referrer: clip(record.referrer, 500),
  };
}

export async function setUserId(id: string) {
  if (!OBJECT_ID.test(id)) return;
  const jar = await cookies();
  jar.set(UID_COOKIE, id.toLowerCase(), cookieOptions(MONTH));
}

export async function clearUserId() {
  const jar = await cookies();
  if (jar.get(UID_COOKIE)) jar.delete(UID_COOKIE);
}

export async function captureEvent(input: {
  request: Request;
  event: AnalyticsEventName;
  eventId?: string;
  postId?: string | null;
  path?: string;
  referrer?: string;
  userId?: string | null;
}) {
  try {
    const ua = input.request.headers.get("user-agent") ?? "";
    if (CRAWLER.test(ua)) return;

    const postId = (input.postId ?? "").toLowerCase();
    if (POST_EVENTS.has(input.event) && !OBJECT_ID.test(postId)) return;

    const jar = await cookies();
    let anonymousId = jar.get(ANON_COOKIE)?.value ?? "";
    if (!UUID.test(anonymousId)) {
      anonymousId = crypto.randomUUID();
      jar.set(ANON_COOKIE, anonymousId, cookieOptions(YEAR));
    }

    let sessionId = jar.get(SESSION_COOKIE)?.value ?? "";
    const sessionStarted = !UUID.test(sessionId);
    if (sessionStarted) sessionId = crypto.randomUUID();
    jar.set(SESSION_COOKIE, sessionId, cookieOptions(HALF_HOUR));

    const cookieUser = jar.get(UID_COOKIE)?.value ?? "";
    const explicitUser = (input.userId ?? "").toLowerCase();
    const userId = OBJECT_ID.test(explicitUser)
      ? explicitUser
      : OBJECT_ID.test(cookieUser)
        ? cookieUser.toLowerCase()
        : null;

    const path = input.path && input.path.startsWith("/") ? input.path.slice(0, 300) : "";
    const referrer = clip(input.referrer || input.request.headers.get("referer"), 500);
    const metadata = { path, referrer, device: deviceOf(ua) };
    const receivedAt = new Date();

    const db = await getAnalyticsDb();
    const events = db.collection<AnalyticsDoc>("events");
    try {
      await ensureIndexes(events);
    } catch (error) {
      console.error("analytics indexes failed", error);
    }

    if (sessionStarted && input.event !== "session_started") {
      await insertEvent(events, {
        eventId: crypto.randomUUID(),
        event: "session_started",
        userId,
        anonymousId,
        sessionId,
        postId: null,
        platform: "web",
        receivedAt,
        metadata,
      });
    }

    await insertEvent(events, {
      eventId: input.eventId && UUID.test(input.eventId) ? input.eventId : crypto.randomUUID(),
      event: input.event,
      userId,
      anonymousId,
      sessionId,
      postId: OBJECT_ID.test(postId) ? postId : null,
      platform: "web",
      receivedAt,
      metadata,
    });
  } catch (error) {
    console.error("analytics capture failed", error);
  }
}
