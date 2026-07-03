import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPostForm } from "@/components/admin/admin-post-form";
import { requireAdminSession } from "@/lib/admin-api";
import { requireAdminPageSession } from "@/lib/admin-page";
import { createAdminPost, isPayloadAdminConfigured, parseAdminPostForm } from "@/lib/admin-posts";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

async function createPostAction(formData: FormData) {
  "use server";

  await requireAdminSession();
  const post = await createAdminPost(parseAdminPostForm(formData));
  redirect(`/admin/news/${post.id}`);
}

export default async function AdminNewPostPage() {
  await requireAdminPageSession();

  const locale = await getLocale();
  const isConfigured = isPayloadAdminConfigured();

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin/news" className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">
          {locale === "bg" ? "Назад към новини" : "Back to news"}
        </Link>
        <div className="mt-8">
          <p className="premium-label text-[color:var(--accent)]">{locale === "bg" ? "Нова публикация" : "New post"}</p>
          <h1 className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{locale === "bg" ? "Създай новина" : "Create news post"}</h1>
        </div>
        {isConfigured ? (
          <AdminPostForm action={createPostAction} locale={locale} submitLabel={locale === "bg" ? "Създай" : "Create"} />
        ) : (
          <div className="mt-8 rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{locale === "bg" ? "Payload CMS не е свързан" : "Payload CMS is not connected"}</h2>
            <p className="mt-3 text-[color:var(--muted)]">
              {locale === "bg"
                ? "Добавете PAYLOAD_INTERNAL_URL и REVALIDATE_SECRET или PAYLOAD_SECRET, за да създавате новини от този админ панел."
                : "Add PAYLOAD_INTERNAL_URL and REVALIDATE_SECRET or PAYLOAD_SECRET to create news from this admin panel."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
