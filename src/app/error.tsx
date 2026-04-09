"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: ErrorPageProps) {
  const locale = useLocale();
  const messages = getMessages(locale);

  return (
    <section className="section-space">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="page-simple-card">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{messages.error.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl text-[color:var(--ink)]">{messages.error.title}</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted)]">{messages.error.copy}</p>
          <button type="button" onClick={() => reset()} className="premium-button mt-8">
            {messages.error.retry}
          </button>
        </div>
      </div>
    </section>
  );
}
