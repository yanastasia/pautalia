import { env, isProduction } from "@/lib/env";
import { getClientIp } from "@/lib/security";

const localDevelopmentIps = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

function normalizeIp(value: string) {
  return value.trim().toLowerCase();
}

function getConfiguredExcludedIps() {
  return env.ANALYTICS_EXCLUDED_IPS.split(",")
    .map(normalizeIp)
    .filter(Boolean);
}

export function isAnalyticsExcludedIp(ip: string) {
  const normalizedIp = normalizeIp(ip);

  if (!normalizedIp) return !isProduction;
  if (!isProduction && localDevelopmentIps.has(normalizedIp)) return true;

  return getConfiguredExcludedIps().includes(normalizedIp);
}

export function isAnalyticsExcludedRequest(request: Request) {
  return isAnalyticsExcludedIp(getClientIp(request));
}
