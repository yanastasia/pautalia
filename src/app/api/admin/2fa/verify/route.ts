import { NextResponse } from "next/server";
import { createTotpUri, ensureAdminUser, getAdminUsername, verifyTotp } from "@/lib/admin-auth";
import { requireSuperAdminSession } from "@/lib/admin-api";
import { jsonError, parseJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    await requireSuperAdminSession();
    const body = await parseJson<{ secret?: string; token?: string }>(request);
    const username = getAdminUsername();

    if (!username || !body.secret || !body.token || !verifyTotp(body.secret, body.token)) {
      return NextResponse.json({ ok: false, error: "Invalid 2FA setup code." }, { status: 400 });
    }

    await ensureAdminUser(username);
    await prisma.adminUser.update({
      where: { username },
      data: {
        totpSecret: body.secret,
        totpEnabled: true,
      },
    });

    return NextResponse.json({ ok: true, otpauthUrl: createTotpUri(username, body.secret) });
  } catch (error) {
    return jsonError(error, request);
  }
}
