import type { Access } from "payload/config";

export const adminsOnly: Access = ({ req }) => Boolean(req.user);

function firstHeaderValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const adminsOrInternalSecret: Access = ({ req }) => {
  if (req.user) return true;

  const expectedSecret = process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET;
  if (!expectedSecret) return false;

  return firstHeaderValue(req.headers["x-pautalia-internal-secret"]) === expectedSecret;
};
