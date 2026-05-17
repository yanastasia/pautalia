import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";

export async function requireAdminPageSession() {
  if (!hasAdminSession(await cookies())) {
    redirect("/admin");
  }
}
