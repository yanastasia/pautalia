import Image from "next/image";
import type { Metadata } from "next";
import { NewsCard } from "@/components/news/news-card";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";
import { listPublicPosts } from "@/lib/posts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    pathname: "/news",
    title: locale === "bg" ? "Новини и актуализации" : "News and updates",
    description:
      locale === "bg"
        ? "Новини, строителни актуализации и съобщения от Pautalia Residence."
        : "News, construction updates, and announcements from Pautalia Residence.",
    imagePath: "/assets/buildings/residence/exterior/exterior-front.jpg",
    imageAlt: "Pautalia Residence",
  });
}

export default async function NewsPage() {
  const locale = await getLocale();
  const posts = (await listPublicPosts(locale, {})).items;

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image src="/assets/buildings/residence/exterior/exterior-front.jpg" alt="Pautalia Residence" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <span className="eyebrow-chip">{locale === "bg" ? "Новини" : "News"}</span>
            <h1 className="mt-6 max-w-[12ch] font-serif text-[2.6rem] leading-[0.92] text-white sm:text-[4.2rem] lg:text-[6rem]">
              {locale === "bg" ? "Актуализации от проекта." : "Project updates."}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
              {locale === "bg" ? "Новини, строителни бележки и важни съобщения." : "News, construction notes, and important announcements."}
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2">
            {posts.map((post) => <NewsCard key={post.id} post={post} locale={locale} />)}
          </div>
        </div>
      </section>
    </>
  );
}
