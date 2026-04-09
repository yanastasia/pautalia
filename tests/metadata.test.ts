import { describe, expect, it } from "vitest";
import { buildPageMetadata, buildRootMetadata, toAbsoluteUrl } from "@/lib/metadata";

describe("metadata helpers", () => {
  it("resolves relative asset paths against the site URL", () => {
    expect(toAbsoluteUrl("/assets/gallery/exterior-front.jpg")).toBe(
      "http://localhost:3000/assets/gallery/exterior-front.jpg",
    );
  });

  it("preserves absolute URLs", () => {
    expect(toAbsoluteUrl("https://cdn.example.com/og.jpg")).toBe("https://cdn.example.com/og.jpg");
  });

  it("builds page metadata with canonical, open graph, and twitter tags", () => {
    const metadata = buildPageMetadata({
      locale: "en",
      pathname: "/contact",
      title: "Contact Pautalia",
      description: "Get in touch with the sales team.",
      imagePath: "/assets/gallery/living-entry.jpg",
      imageAlt: "Pautalia contact page hero image",
    });

    expect(metadata.alternates?.canonical).toBe("/contact");
    expect(metadata.openGraph).toMatchObject({
      title: "Contact Pautalia",
      description: "Get in touch with the sales team.",
      url: "http://localhost:3000/contact",
      type: "website",
      locale: "en_US",
      siteName: "Pautalia",
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "http://localhost:3000/assets/gallery/living-entry.jpg",
        width: 1600,
        height: 900,
        alt: "Pautalia contact page hero image",
      },
    ]);
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: "Contact Pautalia",
      description: "Get in touch with the sales team.",
      images: ["http://localhost:3000/assets/gallery/living-entry.jpg"],
    });
  });

  it("builds localized root metadata defaults", () => {
    const metadata = buildRootMetadata({ locale: "bg" });

    expect(metadata.applicationName).toBe("Pautalia");
    expect(metadata.authors).toEqual([{ name: "Eryze Agency" }]);
    expect(metadata.creator).toBe("Eryze Agency");
    expect(metadata.publisher).toBe("Eryze Agency");
    expect(metadata.description).toBe("Съвременни жилища в Кюстендил с ясни разпределения и спокойна среда.");
    expect(metadata.title).toEqual({
      default: "Pautalia",
      template: "%s | Pautalia",
    });
    expect(metadata.other).toMatchObject({
      developer: "Eryze Agency",
      "developer:contact": "anastasia@eryze.com",
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Pautalia",
      locale: "bg_BG",
      url: "http://localhost:3000/",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Pautalia",
    });
  });
});
