import { NextResponse } from "next/server";
import { createTotpSecret, createTotpUri, ensureAdminUser, getAdminUsername } from "@/lib/admin-auth";
import { requireSuperAdminSession } from "@/lib/admin-api";
import { jsonError } from "@/lib/http";

export async function POST(request: Request) {
  try {
    await requireSuperAdminSession();

    const username = getAdminUsername();
    if (!username) {
      return NextResponse.json({ ok: false, error: "Admin username is not configured." }, { status: 503 });
    }

    const secret = createTotpSecret();
    await ensureAdminUser(username);

    return NextResponse.json({
      ok: true,
      secret,
      otpauthUrl: createTotpUri(username, secret),
    });
  } catch (error) {
    return jsonError(error, request);
  }
}
