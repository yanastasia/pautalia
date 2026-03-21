import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <section className="section-space">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">{messages.notFound.eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl text-[color:var(--ink)]">{messages.notFound.title}</h1>
        <p className="mt-4 text-lg text-[color:var(--muted)]">
          {messages.notFound.copy}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white">
            {messages.notFound.backHome}
          </Link>
          <Link
            href="/apartments"
            className="rounded-full border border-[color:var(--line)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)]"
          >
            {messages.notFound.browseApartments}
          </Link>
        </div>
      </div>
    </section>
  );
}
