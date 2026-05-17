import type { LegalSlug } from "@/lib/legal-pages";
import { getLegalPage } from "@/lib/legal-pages";
import { getLocale } from "@/lib/i18n/server";

export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const locale = await getLocale();
  const page = await getLegalPage(slug, locale);

  return (
    <section className="section-space">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="premium-label text-[color:var(--accent)]">Pautalia</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--ink)] sm:text-5xl">{page.title}</h1>
        <div className="mt-8 whitespace-pre-line text-base leading-8 text-[color:var(--muted)]">{page.body}</div>
      </div>
    </section>
  );
}

