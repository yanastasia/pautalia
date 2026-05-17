import Image from "next/image";
import Link from "next/link";
import { getPostCategoryLabel } from "@/lib/posts";
import type { Locale } from "@/lib/i18n/config";
import type { PublicPost } from "@/types/posts";

export function NewsCard({ post, locale }: { post: PublicPost; locale: Locale }) {
  return (
    <article className="group">
      <Link href={`/news/${post.slug}`} className="block">
        <div className="page-image-block min-h-[18rem] sm:min-h-[22rem]">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
        </div>
        <div className="page-simple-card pt-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
            {getPostCategoryLabel(locale, post.category)}
          </p>
          <h2 className="mt-3 font-serif text-[2rem] leading-[1] text-[color:var(--ink)] sm:text-4xl">
            {post.translation.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            {post.translation.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
