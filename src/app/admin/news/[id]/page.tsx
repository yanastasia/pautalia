import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPostForm } from "@/components/admin/admin-post-form";
import { requireAdminSession } from "@/lib/admin-api";
import { requireAdminPageSession } from "@/lib/admin-page";
import { getAdminPost, parseAdminPostFormWithUploads, updateAdminPost } from "@/lib/admin-posts";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

async function updatePostAction(formData: FormData) {
  "use server";

  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const post = await getAdminPost(id);
  await updateAdminPost(id, await parseAdminPostFormWithUploads(formData, post));
}

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageSession();

  const locale = await getLocale();
  const { id } = await params;
  const post = await getAdminPost(id);
  if (!post) notFound();

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin/news" className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">
            {locale === "bg" ? "Назад към новини" : "Back to news"}
          </Link>
          {post.status === "published" ? (
            <Link href={`/news/${post.slug}`} className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">
              {locale === "bg" ? "Виж публично" : "View public"}
            </Link>
          ) : null}
        </div>
        <div className="mt-8">
          <p className="premium-label text-[color:var(--accent)]">{locale === "bg" ? "Редакция" : "Edit"}</p>
          <h1 className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{post.translations?.[locale]?.title ?? post.slug}</h1>
        </div>
        <AdminPostForm action={updatePostAction} locale={locale} post={post} postId={post.id} submitLabel={locale === "bg" ? "Запази" : "Save"} />
      </div>
    </section>
  );
}
