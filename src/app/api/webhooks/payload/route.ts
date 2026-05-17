import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { env, isProduction } from "@/lib/env";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret") ?? new URL(request.url).searchParams.get("secret");

  if (isProduction && !env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Revalidation secret is not configured." }, { status: 503 });
  }

  if (env.REVALIDATE_SECRET && secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid revalidation secret." }, { status: 401 });
  }

  revalidateTag("pautalia:inventory");
  revalidateTag("pautalia:buildings");
  revalidateTag("pautalia:units");
  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath("/buildings");
  revalidatePath("/project");
  revalidatePath("/privacy");
  revalidatePath("/cookies");
  revalidatePath("/terms");

  return NextResponse.json({ ok: true });
}
