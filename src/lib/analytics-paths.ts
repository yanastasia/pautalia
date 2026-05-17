function getPathname(sourcePageUrl: string) {
  return sourcePageUrl.split(/[?#]/, 1)[0] ?? "";
}

export function isInternalAnalyticsPath(sourcePageUrl: string) {
  const pathname = getPathname(sourcePageUrl);
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
