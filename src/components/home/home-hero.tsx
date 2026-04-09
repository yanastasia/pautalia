import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export function HomeHero({
  title,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  locationLabel,
  imageAlt,
}: {
  title: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  locationLabel: string;
  imageAlt: string;
}) {
  return (
    <section className="home-hero-shell relative min-h-[100svh] -mt-[9.4rem] overflow-hidden pt-[9.4rem] md:-mt-[7.1rem] md:pt-[7.1rem]">
      <div className="home-hero-media">
        <Image
          src="/assets/exterior/exterior-front.jpg"
          alt={imageAlt}
          fill
          priority
          className="home-hero-media-image object-cover object-top"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-9.4rem)] max-w-[1200px] flex-col justify-end px-4 pb-10 pt-24 sm:min-h-[calc(100svh-9.4rem)] sm:px-6 sm:pb-16 sm:pt-36 md:min-h-[calc(100svh-7.1rem)] lg:px-8 lg:pb-24 lg:pt-52">
        <div className="max-w-[75rem]">
          <h1 className="motion-fade-up motion-delay-1 max-w-[75rem] font-serif text-[2rem] leading-[0.96] text-white sm:text-[2.45rem] lg:text-[3.35rem] xl:text-[3.7rem]">
            {title}
          </h1>
          <p className="motion-fade-up motion-delay-2 mt-5 max-w-xl text-[0.98rem] leading-6 text-white/74 sm:text-base sm:leading-7">{copy}</p>

          <div className="motion-fade-up motion-delay-3 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href={primaryHref} className="premium-button w-full text-sm font-semibold sm:w-auto">
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="premium-button-secondary w-full border-white/14 bg-white/10 text-sm font-semibold text-white hover:bg-white/14 sm:w-auto"
            >
              {secondaryLabel}
            </Link>
          </div>

          <div className="motion-fade-up motion-delay-4 mt-6 inline-flex max-w-full items-center gap-2 self-start rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur md:absolute md:bottom-10 md:right-8 md:mt-0 md:tracking-[0.24em]">
            <MapPin className="size-3.5 shrink-0 text-white/72" />
            <span className="min-w-0 truncate">{locationLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
