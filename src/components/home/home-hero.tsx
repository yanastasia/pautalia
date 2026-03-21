"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export function HomeHero({
  eyebrow,
  title,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  caption,
  body,
  locationLabel,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  caption: string;
  body: string;
  locationLabel: string;
  imageAlt: string;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setOffset(Math.min(window.scrollY * 0.2, 72));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="home-hero-shell relative -mt-[8.9rem] overflow-hidden pt-[8.9rem] md:-mt-[6.4rem] md:pt-[6.4rem]">
      <div className="home-hero-media">
        <Image
          src="/assets/exterior/exterior-front.jpg"
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.08)` }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1200px] flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="max-w-4xl">
          <span className="eyebrow-chip motion-fade-up">{eyebrow}</span>
          <h1 className="motion-fade-up motion-delay-1 mt-8 max-w-5xl font-serif text-[3.4rem] leading-[0.9] text-white sm:text-[4.6rem] lg:text-[6.8rem]">
            {title}
          </h1>
          <p className="motion-fade-up motion-delay-2 mt-8 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">{copy}</p>

          <div className="motion-fade-up motion-delay-3 mt-8 flex flex-wrap gap-4">
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

        <div className="motion-fade-up motion-delay-4 mt-14 grid gap-6 border-t border-white/12 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/52">{caption}</p>
            <p className="mt-4 max-w-2xl text-2xl leading-tight text-white/92 sm:text-3xl">{body}</p>
          </div>
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-white/58">
            <MapPin className="size-4 text-white/72" />
            <span>{locationLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
