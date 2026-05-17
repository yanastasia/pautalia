import { NextResponse, type NextRequest } from "next/server";
import { createAdminSessionCookie, ensureAdminUser, getAdminUser, isAdminLoginConfigured, verifyAdminCredentials, verifyTotp } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const totp = formData.get("totp");

  if (!isAdminLoginConfigured()) {
    return NextResponse.json({ ok: false, error: "Admin login is not configured." }, { status: 503 });
  }

  if (typeof username !== "string" || typeof password !== "string" || !verifyAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: "Invalid admin credentials." }, { status: 401 });
  }

  const adminUser = await getAdminUser(username);
  if (adminUser?.totpEnabled) {
    if (typeof totp !== "string" || !adminUser.totpSecret || !verifyTotp(adminUser.totpSecret, totp)) {
      return NextResponse.json({ ok: false, requiresTotp: true, error: "Two-factor code required." }, { status: 401 });
    }
  }

  const sessionCookie = createAdminSessionCookie();
  await ensureAdminUser(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);

  return response;
}
