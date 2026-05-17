function getEmbeddableVideoUrl(url: string) {
  const parsed = URL.canParse(url) ? new URL(url) : null;

  if (!parsed) return null;

  if (parsed.hostname.includes("youtube.com")) {
    const id = parsed.searchParams.get("v");
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (parsed.hostname === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (parsed.hostname.includes("vimeo.com")) {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}

export function PostVideo({ url, title }: { url?: string; title: string }) {
  if (!url) return null;

  const embedUrl = getEmbeddableVideoUrl(url);

  if (!embedUrl) {
    return (
      <a href={url} className="text-sm font-semibold underline underline-offset-4" rel="noreferrer" target="_blank">
        {title}
      </a>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-[var(--radius-xl)] bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
