import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-api";
import { jsonError, parseJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  priceVisibilityMode: z.enum(["visible", "hidden", "per_unit"]),
});

export async function PATCH(request: Request) {
  try {
    await requireAdminSession();
    const body = schema.parse(await parseJson(request));
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: { id: "default", priceVisibilityMode: body.priceVisibilityMode },
      update: { priceVisibilityMode: body.priceVisibilityMode },
    });

    revalidateTag("pautalia:inventory");
    revalidateTag("pautalia:settings");
    revalidateTag("pautalia:units");
    revalidateTag("pautalia:buildings");

    return NextResponse.json({ ok: true, item: settings });
  } catch (error) {
    return jsonError(error, request);
  }
}
