import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === "bg" ? "Админ" : "Admin",
    description:
      locale === "bg"
        ? "Вътрешна зона за управление на запитвания, наличности и съдържание."
        : "Internal area for managing enquiries, availability, and content.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.admin.eyebrow}
          title={messages.admin.title}
          copy={messages.admin.copy}
        />

        <div className="mt-10 rounded-[var(--radius-xl)] card-surface p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">{messages.admin.payloadEyebrow}</p>
              <h2 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">{messages.admin.collectionsDefined}</h2>
              <p className="mt-4 text-[color:var(--muted)]">
                {messages.admin.collectionsCopy}
              </p>
            </div>

            <ul className="space-y-3 text-[color:var(--muted)]">
              {messages.admin.features.map((feature) => (
                <li key={feature} className="rounded-2xl bg-white/75 px-4 py-3">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
