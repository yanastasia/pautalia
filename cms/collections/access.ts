import type { Access } from "payload/config";

export const adminsOnly: Access = ({ req }) => Boolean(req.user);

