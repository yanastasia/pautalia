import { NextResponse } from "next/server";
import { adminSessionCookieName } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(adminSessionCookieName, "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
  });

  return response;
}
