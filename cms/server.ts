import express from "express";
import payload from "payload";

const port = Number(process.env.PORT || 3001);
const secret = process.env.PAYLOAD_SECRET;

if (!secret) {
  throw new Error("PAYLOAD_SECRET is required");
}

const app = express();

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

await payload.init({
  express: app,
  secret,
});

await payload.db.migrate();

app.listen(port, "0.0.0.0");
