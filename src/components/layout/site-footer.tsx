"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";

export function SiteFooter({
  locationLabel,
  contactEmail,
  contactPhone,
}: {
  locationLabel: string;
  contactEmail: string;
  contactPhone: string;
}) {
  const locale = useLocale();
  const messages = getMessages(locale);

  return (
    <footer className="mt-20 bg-[color:var(--surface-dark)] text-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-2 xl:grid-cols-4">
          <div className="max-w-sm space-y-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-white/42">{messages.footer.badge}</p>
            <h2 className="font-serif text-4xl leading-tight text-white sm:text-[2.8rem]">{messages.footer.title}</h2>
            <p className="text-base leading-7 text-white/64">{messages.footer.copy}</p>
          </div>

          <div className="space-y-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-white/42">{messages.footer.explore}</p>
            <div className="space-y-3 text-sm text-white/68">
              <Link href="/project" className="flex items-center justify-between border-b border-white/8 pb-3 hover:text-white">
                <span>{messages.footer.projectOverview}</span>
                <ArrowUpRight className="size-4 text-white/46" />
              </Link>
              <Link href="/apartments" className="flex items-center justify-between border-b border-white/8 pb-3 hover:text-white">
                <span>{messages.footer.apartmentFinder}</span>
                <ArrowUpRight className="size-4 text-white/46" />
              </Link>
              <Link href="/gallery" className="flex items-center justify-between border-b border-white/8 pb-3 hover:text-white">
                <span>{messages.footer.gallery}</span>
                <ArrowUpRight className="size-4 text-white/46" />
              </Link>
              <Link href="/contact" className="flex items-center justify-between hover:text-white">
                <span>{messages.footer.contact}</span>
                <ArrowUpRight className="size-4 text-white/46" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-white/42">{messages.footer.contact}</p>
            <div className="space-y-4 text-sm text-white/68">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-white/46" />
                <span>{locationLabel}</span>
              </div>
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 hover:text-white">
                <Mail className="size-4 text-white/46" />
                {contactEmail}
              </a>
              <a href={`tel:${contactPhone}`} className="flex items-center gap-3 hover:text-white">
                <Phone className="size-4 text-white/46" />
                {contactPhone}
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-white/42">{messages.footer.updates}</p>
            <h3 className="font-serif text-3xl leading-tight text-white">{messages.footer.updatesTitle}</h3>
            <p className="text-sm leading-7 text-white/62">{messages.footer.updatesCopy}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white hover:bg-white/8"
            >
              {messages.footer.updatesCta}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/8 py-5 text-sm text-white/44 md:flex-row md:items-center md:justify-between">
          <p>{messages.footer.bottomLine}</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
