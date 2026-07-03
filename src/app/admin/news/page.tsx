import Link from "next/link";
import type { Metadata } from "next";
import { formatAdminDate } from "@/lib/admin-format";
import { requireAdminPageSession } from "@/lib/admin-page";
import { formatAdminPostCategory, formatAdminPostStatus, isPayloadAdminConfigured, listAdminPosts } from "@/lib/admin-posts";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News admin",
  robots: { index: false, follow: false },
};

export default async function AdminNewsPage() {
  await requireAdminPageSession();

  const locale = await getLocale();
  const isConfigured = isPayloadAdminConfigured();
  let posts: Awaited<ReturnType<typeof listAdminPosts>> = [];
  let loadError = false;

  if (isConfigured) {
    try {
      posts = await listAdminPosts();
    } catch {
      loadError = true;
    }
  }

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">
          {locale === "bg" ? "Назад към админ" : "Back to dashboard"}
        </Link>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="premium-label text-[color:var(--accent)]">{locale === "bg" ? "Съдържание" : "Content"}</p>
            <h1 className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{locale === "bg" ? "Новини" : "News"}</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
              {locale === "bg"
                ? "Създавайте и публикувайте двуезични новини за публичната секция."
                : "Create and publish bilingual posts for the public news section."}
            </p>
          </div>
          {isConfigured ? (
            <Link href="/admin/news/new" className="rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--surface-dark)] shadow-sm hover:border-[color:var(--accent-deep)] hover:bg-[color:var(--accent-deep)] hover:text-white">
              {locale === "bg" ? "Нова новина" : "New post"}
            </Link>
          ) : null}
        </div>

        {!isConfigured ? (
          <div className="mt-8 rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{locale === "bg" ? "Payload CMS не е свързан" : "Payload CMS is not connected"}</h2>
            <p className="mt-3 text-[color:var(--muted)]">
              {locale === "bg"
                ? "Добавете PAYLOAD_INTERNAL_URL и REVALIDATE_SECRET или PAYLOAD_SECRET, за да редактирате новини от този админ панел."
                : "Add PAYLOAD_INTERNAL_URL and REVALIDATE_SECRET or PAYLOAD_SECRET to edit news from this admin panel."}
            </p>
          </div>
        ) : loadError ? (
          <div className="mt-8 rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{locale === "bg" ? "Не успяхме да заредим новините" : "Could not load news"}</h2>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
              {locale === "bg"
                ? "Админ панелът е свързан, но Payload CMS не отговори успешно. Проверете PAYLOAD_INTERNAL_URL и вътрешната тайна в Render, след което опитайте отново."
                : "The admin panel is configured, but Payload CMS did not respond successfully. Check PAYLOAD_INTERNAL_URL and the internal secret in Render, then try again."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/admin/news" className="rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--surface-dark)] shadow-sm hover:border-[color:var(--accent-deep)] hover:bg-[color:var(--accent-deep)] hover:text-white">
                {locale === "bg" ? "Опитай отново" : "Retry"}
              </Link>
              <Link href="/admin" className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink)]">
                {locale === "bg" ? "Към админ панела" : "Back to dashboard"}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] card-surface p-6">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                <tr>
                  <th className="py-3 pr-4">{locale === "bg" ? "Заглавие" : "Title"}</th>
                  <th className="py-3 pr-4">{locale === "bg" ? "Статус" : "Status"}</th>
                  <th className="py-3 pr-4">{locale === "bg" ? "Категория" : "Category"}</th>
                  <th className="py-3 pr-4">{locale === "bg" ? "Дата" : "Date"}</th>
                  <th className="py-3">{locale === "bg" ? "Линк" : "Link"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(16,18,20,0.08)]">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="py-4 pr-4">
                      <Link href={`/admin/news/${post.id}`} className="font-semibold text-[color:var(--ink)] underline-offset-4 hover:underline">
                        {post.translations?.[locale]?.title ?? post.slug}
                      </Link>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">{post.slug}</p>
                    </td>
                    <td className="py-4 pr-4 text-[color:var(--muted)]">{formatAdminPostStatus(post.status, locale)}</td>
                    <td className="py-4 pr-4 text-[color:var(--muted)]">{formatAdminPostCategory(post.category, locale)}</td>
                    <td className="py-4 pr-4 text-[color:var(--muted)]">{post.publishedAt ? formatAdminDate(new Date(post.publishedAt), locale) : "-"}</td>
                    <td className="py-4">
                      {post.status === "published" ? (
                        <Link href={`/news/${post.slug}`} className="text-[color:var(--muted)] underline-offset-4 hover:underline">
                          /news/{post.slug}
                        </Link>
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 ? <p className="py-8 text-[color:var(--muted)]">{locale === "bg" ? "Няма новини." : "No posts yet."}</p> : null}
          </div>
        )}
      </div>
    </section>
  );
}
