type Level = "info" | "warn" | "error";

function write(level: Level, event: string, payload?: Record<string, unknown>) {
  const record = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  const line = JSON.stringify(record);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
}

export const logger = {
  info: (event: string, payload?: Record<string, unknown>) => write("info", event, payload),
  warn: (event: string, payload?: Record<string, unknown>) => write("warn", event, payload),
  error: (event: string, payload?: Record<string, unknown>) => write("error", event, payload),
};
