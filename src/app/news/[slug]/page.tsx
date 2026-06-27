import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostVideo } from "@/components/news/post-video";
import { isAppError } from "@/lib/errors";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";
import { getPostCategoryLabel, getPublicPost } from "@/lib/posts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;

  try {
    const post = await getPublicPost(locale, slug);
    return buildPageMetadata({
      locale,
      pathname: `/news/${slug}`,
      title: post.translation.seoTitle ?? post.translation.title,
      description: post.translation.seoDescription ?? post.translation.excerpt,
      imagePath: post.coverImage ?? "/assets/buildings/residence/exterior/exterior-front.jpg",
      imageAlt: post.coverImageAlt,
    });
  } catch {
    return {};
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale();
  const { slug } = await params;

  try {
    const post = await getPublicPost(locale, slug);

    return (
      <article>
        <section className="page-cover">
          <div className="page-cover-media">
            <Image src={post.coverImage ?? "/assets/buildings/residence/exterior/exterior-front.jpg"} alt={post.coverImageAlt} fill className="object-cover" sizes="100vw" />
          </div>
          <div className="page-cover-inner">
            <div className="page-cover-copy">
              <span className="eyebrow-chip">{getPostCategoryLabel(locale, post.category)}</span>
              <h1 className="mt-6 max-w-[13ch] font-serif text-[2.4rem] leading-[0.95] text-white sm:text-[4rem] lg:text-[5.5rem]">
                {post.translation.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
                {post.translation.excerpt}
              </p>
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
            <div className="space-y-6 text-lg leading-9 text-[color:var(--muted)]">
              {post.translation.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <PostVideo uploadedVideo={post.videoMedia} url={post.videoUrl} title={post.translation.title} />
            </div>
            <aside className="space-y-4">
              {post.gallery.map((image) => (
                <div key={image.src} className="page-image-block min-h-[14rem]">
                  <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="320px" />
                </div>
              ))}
            </aside>
          </div>
        </section>
      </article>
    );
  } catch (error) {
    if (isAppError(error)) notFound();
    throw error;
  }
}
