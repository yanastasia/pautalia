import { NextResponse } from "next/server";
import { ensureAdminUser, getAdminUsername } from "@/lib/admin-auth";
import { requireSuperAdminSession } from "@/lib/admin-api";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    await requireSuperAdminSession();
    const username = getAdminUsername();

    if (!username) {
      return NextResponse.json({ ok: false, error: "Admin username is not configured." }, { status: 503 });
    }

    await ensureAdminUser(username);
    await prisma.adminUser.update({
      where: { username },
      data: {
        totpSecret: null,
        totpEnabled: false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error, request);
  }
}
