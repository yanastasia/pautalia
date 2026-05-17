import { cookies } from "next/headers";
import { forbiddenError, unauthorizedError } from "@/lib/errors";
import { hasAdminSession } from "@/lib/admin-auth";

export async function requireAdminSession() {
  if (!hasAdminSession(await cookies())) {
    throw unauthorizedError("Admin session required");
  }

  return { role: "super_admin" as const };
}

export async function requireSuperAdminSession() {
  const session = await requireAdminSession();
  if (session.role !== "super_admin") {
    throw forbiddenError("Super admin access required");
  }

  return session;
}

