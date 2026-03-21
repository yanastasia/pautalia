import { Clock3, Mail, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { getSiteCopy } from "@/content/site-content";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === "bg" ? "Контакт" : "Contact",
    description:
      locale === "bg"
        ? "Свържете се с нас за наличности, цени и оглед."
        : "Contact us about availability, pricing, and viewings.",
  };
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
            <h1 className="mt-8 font-serif text-[3.4rem] leading-[0.9] text-white sm:text-[4.6rem] lg:text-[6rem]">{messages.contact.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{messages.contact.heroCopy}</p>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark">
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
          <div>
            <SectionHeading
              eyebrow={messages.contact.deskEyebrow}
              title={messages.contact.deskTitle}
              copy={messages.contact.deskCopy}
            />

            <div className="page-line-list mt-10">
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
          </div>

          <LeadForm source="contact-page" heading={messages.contact.formHeading} />
        </div>
      </section>
    </>
  );
}
