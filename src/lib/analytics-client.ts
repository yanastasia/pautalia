import type { AnalyticsDevice, AnalyticsEventName } from "@/lib/analytics-events";
import { isInternalAnalyticsPath } from "@/lib/analytics-paths";

const consentCookieName = "pautalia_cookie_consent";
const visitorCookieName = "pautalia_visitor_id";
const sessionStorageKey = "pautalia_session_id";

type AnalyticsEventInput = {
  buildingId?: string;
  unitId?: string;
  payload?: Record<string, unknown>;
};

function readCookie(name: string) {
  const encodedName = `${name}=`;
  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(encodedName))
    ?.slice(encodedName.length);
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

function randomId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDeviceType(): AnalyticsDevice {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}

function getUtmValue(searchParams: URLSearchParams, name: string) {
  return searchParams.get(name) ?? undefined;
}

function getAnalyticsIds() {
  if (readCookie(consentCookieName) !== "analytics") return {};

  const visitorId = decodeURIComponent(readCookie(visitorCookieName) ?? "") || randomId();
  writeCookie(visitorCookieName, visitorId);

  const sessionId = window.sessionStorage.getItem(sessionStorageKey) ?? randomId();
  window.sessionStorage.setItem(sessionStorageKey, sessionId);

  return { visitorId, sessionId };
}

export function sendAnalyticsEvent(eventType: AnalyticsEventName, input: AnalyticsEventInput = {}) {
  if (typeof window === "undefined") return;
  const sourcePageUrl = `${window.location.pathname}${window.location.search}`;
  if (isInternalAnalyticsPath(sourcePageUrl)) return;

  const searchParams = new URLSearchParams(window.location.search);
  const ids = getAnalyticsIds();

  void fetch("/api/pautalia/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventType,
      sourcePageUrl,
      referrer: document.referrer || undefined,
      source: getUtmValue(searchParams, "utm_source"),
      medium: getUtmValue(searchParams, "utm_medium"),
      campaign: getUtmValue(searchParams, "utm_campaign"),
      term: getUtmValue(searchParams, "utm_term"),
      content: getUtmValue(searchParams, "utm_content"),
      deviceType: getDeviceType(),
      ...ids,
      ...input,
    }),
  }).catch(() => undefined);
}
