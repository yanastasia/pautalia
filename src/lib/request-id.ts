const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;

export function normalizeRequestId(value?: string | null) {
  const candidate = (value ?? "").replace(CONTROL_CHARACTERS, "").trim();
  return REQUEST_ID_PATTERN.test(candidate) ? candidate : crypto.randomUUID();
}
