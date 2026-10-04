import express from "express";
import payload from "payload";

const port = Number(process.env.PORT || 3001);
const secret = process.env.PAYLOAD_SECRET;
const originalNodeEnv = process.env.NODE_ENV;
const shouldPushSchema = process.env.PAYLOAD_SCHEMA_PUSH === "true";

if (!secret) {
  throw new Error("PAYLOAD_SECRET is required");
}

const app = express();

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

if (shouldPushSchema) {
  process.env.NODE_ENV = "development";
}

await payload.init({
  express: app,
  secret,
});

if (shouldPushSchema) {
  process.env.NODE_ENV = originalNodeEnv;
}

app.listen(port, "0.0.0.0");
