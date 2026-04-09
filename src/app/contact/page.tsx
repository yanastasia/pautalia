import { Clock3, Mail, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { getSiteCopy } from "@/content/site-content";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    pathname: "/contact",
    title: locale === "bg" ? "Контакт с търговския екип" : "Contact the sales team",
    description:
      locale === "bg"
        ? "Свържете се с нас за наличности, цени и оглед."
        : "Contact us about availability, pricing, and viewings.",
    imagePath: "/assets/gallery/living-entry.jpg",
    imageAlt: locale === "bg" ? "Свържете се с екипа на Pautalia" : "Contact the Pautalia sales team",
  });
}

export default async function ContactPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const siteCopy = getSiteCopy(locale);

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image src="/assets/gallery/living-entry.jpg" alt={messages.contact.heroTitle} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <span className="eyebrow-chip">{messages.contact.heroEyebrow}</span>
            <h1 className="mt-6 max-w-[12ch] font-serif text-[2.6rem] leading-[0.92] text-white sm:text-[4.2rem] lg:text-[6rem]">{messages.contact.heroTitle}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">{messages.contact.heroCopy}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,#272320_0%,#201d1b_100%)] md:hidden">
        <div className="mx-auto max-w-[1200px] px-4 py-5">
          <div className="grid gap-3">
            <a
              href={`tel:${siteCopy.contactPhone}`}
              className="inline-flex min-h-12 items-center justify-between rounded-full border border-white/10 bg-white/8 px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white"
            >
              <span className="inline-flex items-center gap-3">
                <PhoneCall className="size-4 text-white/60" />
                {messages.contact.phone}
              </span>
              <span className="text-white/76">{siteCopy.contactPhone}</span>
            </a>
            <a
              href={`mailto:${siteCopy.contactEmail}`}
              className="inline-flex min-h-12 items-center justify-between rounded-full border border-white/10 bg-white/8 px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white"
            >
              <span className="inline-flex items-center gap-3">
                <Mail className="size-4 text-white/60" />
                {messages.contact.email}
              </span>
              <span className="text-white/76">{siteCopy.contactEmail}</span>
            </a>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/64">
            <Clock3 className="size-4 text-white/48" />
            <span>{messages.contact.responseValue}</span>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark hidden md:block">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <Mail className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-4xl leading-none">{siteCopy.contactEmail}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.contact.email}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <PhoneCall className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-4xl leading-none">{siteCopy.contactPhone}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.contact.phone}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <MapPin className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-4xl leading-none">{siteCopy.locationLabel}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.contact.location}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <Clock3 className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-4xl leading-none">{messages.contact.responseValue}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.contact.response}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
          <div className="order-2 lg:order-1">
            <div className="hidden md:block">
              <SectionHeading
                eyebrow={messages.contact.deskEyebrow}
                title={messages.contact.deskTitle}
                copy={messages.contact.deskCopy}
              />
            </div>

            <div className="page-line-list mt-10 hidden md:block">
              <div className="page-line-item">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{messages.contact.howItWorks}</p>
                <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">{messages.contact.howItWorksCopy}</p>
              </div>
              <div className="page-line-item">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{messages.contact.directContact}</p>
                <p className="mt-4 font-serif text-3xl text-[color:var(--ink)]">{siteCopy.contactPhone}</p>
                <p className="mt-2 text-[color:var(--muted)]">{siteCopy.contactEmail}</p>
              </div>
              <div className="page-line-item">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{messages.contact.salesLocation}</p>
                <p className="mt-4 font-serif text-3xl text-[color:var(--ink)]">{siteCopy.locationLabel}</p>
                <p className="mt-2 text-[color:var(--muted)]">{messages.contact.salesLocationCopy}</p>
              </div>
            </div>

            <div className="page-line-list mt-8 md:hidden">
              <div className="page-line-item">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.contact.howItWorks}</p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{messages.contact.howItWorksCopy}</p>
              </div>
              <div className="page-line-item">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.contact.salesLocation}</p>
                <p className="mt-3 font-serif text-[1.9rem] leading-[1.02] text-[color:var(--ink)]">{siteCopy.locationLabel}</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{messages.contact.salesLocationCopy}</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <LeadForm source="contact-page" heading={messages.contact.formHeading} />
          </div>
        </div>
      </section>
    </>
  );
}
