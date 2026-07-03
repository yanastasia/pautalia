import { adminPostCategories, adminPostStatuses, formatAdminPostCategory, formatAdminPostStatus, type AdminPost } from "@/lib/admin-posts";
import type { Locale } from "@/lib/i18n/config";

type AdminPostFormProps = {
  action: (formData: FormData) => Promise<void>;
  locale: Locale;
  post?: AdminPost | null;
  postId?: string;
  submitLabel: string;
};

function dateInputValue(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function fieldClass(extra = "") {
  return `min-h-12 rounded-2xl border border-[color:var(--line)] bg-white px-4 text-[color:var(--ink)] ${extra}`;
}

function textAreaClass(extra = "") {
  return `rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] ${extra}`;
}

export function AdminPostForm({ action, locale, post, postId, submitLabel }: AdminPostFormProps) {
  return (
    <form action={action} className="mt-8 grid gap-6">
      {postId ? <input type="hidden" name="id" value={postId} /> : null}
      <section className="rounded-[var(--radius-xl)] card-surface p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">Slug</span>
            <input name="slug" required defaultValue={post?.slug ?? ""} placeholder="new-building-update" className={fieldClass()} />
          </label>
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Дата" : "Date"}</span>
            <input name="publishedAt" type="date" defaultValue={dateInputValue(post?.publishedAt)} className={fieldClass()} />
          </label>
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Статус" : "Status"}</span>
            <select name="status" defaultValue={post?.status ?? "draft"} className={fieldClass()}>
              {adminPostStatuses.map((status) => (
                <option key={status} value={status}>{formatAdminPostStatus(status, locale)}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Категория" : "Category"}</span>
            <select name="category" defaultValue={post?.category ?? "news"} className={fieldClass()}>
              {adminPostCategories.map((category) => (
                <option key={category} value={category}>{formatAdminPostCategory(category, locale)}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Видео URL" : "Video URL"}</span>
            <input name="videoUrl" type="url" defaultValue={post?.videoUrl ?? ""} placeholder="https://..." className={fieldClass()} />
          </label>
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] card-surface p-6">
        <p className="premium-label text-[color:var(--accent)]">BG</p>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">Заглавие</span>
            <input name="bgTitle" required defaultValue={post?.translations?.bg?.title ?? ""} className={fieldClass()} />
          </label>
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">Кратко описание</span>
            <textarea name="bgExcerpt" required rows={3} defaultValue={post?.translations?.bg?.excerpt ?? ""} className={textAreaClass()} />
          </label>
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">Текст</span>
            <textarea name="bgBody" required rows={10} defaultValue={post?.translations?.bg?.body ?? ""} className={textAreaClass()} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <input name="bgSeoTitle" defaultValue={post?.translations?.bg?.seoTitle ?? ""} placeholder="SEO заглавие" className={fieldClass()} />
            <input name="bgSeoDescription" defaultValue={post?.translations?.bg?.seoDescription ?? ""} placeholder="SEO описание" className={fieldClass()} />
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] card-surface p-6">
        <p className="premium-label text-[color:var(--accent)]">EN</p>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">Title</span>
            <input name="enTitle" required defaultValue={post?.translations?.en?.title ?? ""} className={fieldClass()} />
          </label>
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">Excerpt</span>
            <textarea name="enExcerpt" required rows={3} defaultValue={post?.translations?.en?.excerpt ?? ""} className={textAreaClass()} />
          </label>
          <label className="grid gap-2">
            <span className="premium-label text-[color:var(--muted)]">Body</span>
            <textarea name="enBody" required rows={10} defaultValue={post?.translations?.en?.body ?? ""} className={textAreaClass()} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <input name="enSeoTitle" defaultValue={post?.translations?.en?.seoTitle ?? ""} placeholder="SEO title" className={fieldClass()} />
            <input name="enSeoDescription" defaultValue={post?.translations?.en?.seoDescription ?? ""} placeholder="SEO description" className={fieldClass()} />
          </div>
        </div>
      </section>

      <button type="submit" className="min-h-12 justify-self-start rounded-full bg-[color:var(--ink)] px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white">
        {submitLabel}
      </button>
    </form>
  );
}
