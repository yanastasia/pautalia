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
    <section className="home-hero-shell relative h-[100svh] -mt-[10.2rem] overflow-hidden pt-[10.2rem] md:-mt-[7.1rem] md:pt-[7.1rem]">
      <div className="home-hero-media">
        <Image
          src="/assets/exterior/exterior-front.jpg"
          alt={imageAlt}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
          style={{ transform: "translate3d(0, -10px, 0) scale(1.08)" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-end px-4 pb-14 pt-44 sm:px-6 sm:pb-18 sm:pt-48 lg:px-8 lg:pb-24 lg:pt-52">
        <div className="max-w-[75rem]">
          <h1 className="motion-fade-up motion-delay-1 max-w-[75rem] font-serif text-[2rem] leading-[0.98] text-white sm:text-[2.6rem] lg:text-[3.35rem] xl:text-[3.7rem]">
            {title}
          </h1>
          <p className="motion-fade-up motion-delay-2 mt-5 max-w-xl text-sm leading-7 text-white/74 sm:text-base sm:leading-7">{copy}</p>

          <div className="motion-fade-up motion-delay-3 mt-7 flex flex-wrap gap-4">
            <Link href={primaryHref} className="premium-button text-sm font-semibold">
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="premium-button-secondary border-white/14 bg-white/10 text-sm font-semibold text-white hover:bg-white/14"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="motion-fade-up motion-delay-4 absolute bottom-5 right-4 sm:bottom-7 sm:right-6 lg:bottom-10 lg:right-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/78 backdrop-blur">
            <MapPin className="size-3.5 text-white/72" />
            <span>{locationLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
