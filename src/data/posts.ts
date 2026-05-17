import type { PublicPost } from "@/types/posts";

export type PostSeed = Omit<PublicPost, "status" | "translation"> & {
  status: "draft" | "published" | "archived";
};

export const postSeeds: PostSeed[] = [
  {
    id: "construction-update-residence-may-2026",
    slug: "construction-update-residence-may-2026",
    status: "published",
    category: "construction_update",
    buildingId: "a",
    building: { id: "a", slug: "residence", name: "Residence" },
    publishedAt: "2026-05-01T09:00:00.000Z",
    coverImage: "/assets/buildings/residence/exterior/exterior-front.jpg",
    coverImageAlt: "Pautalia Residence exterior progress",
    gallery: [
      { src: "/assets/buildings/residence/gallery/exterior-front.jpg", alt: "Facade view" },
      { src: "/assets/buildings/residence/gallery/living-entry.jpg", alt: "Interior preview" },
    ],
    translations: {
      bg: {
        title: "Напредък по Резиденс",
        excerpt: "Кратка актуализация за текущия етап и следващите стъпки по Резиденс.",
        body: [
          "Резиденс е отбелязана като 5% завършена, докато официалната информация за срокове остава непубликувана.",
          "Екипът поддържа инвентара, наличностите и запитванията през админ системата, за да може публичният сайт да показва актуално състояние.",
        ],
        seoTitle: "Напредък по Резиденс | Pautalia Residence",
        seoDescription: "Актуализация за Резиденс, наличности и текуща информация за Pautalia Residence.",
      },
      en: {
        title: "Residence Progress Update",
        excerpt: "A concise update on the current stage and next steps for Residence.",
        body: [
          "Residence is marked as 5% complete while official delivery timing remains unpublished.",
          "The team keeps inventory, availability, and enquiries managed through the admin system so the public site reflects current status.",
        ],
        seoTitle: "Residence Progress Update | Pautalia Residence",
        seoDescription: "Update for Residence, availability, and current Pautalia Residence information.",
      },
    },
  },
  {
    id: "draft-park-launch-note",
    slug: "draft-park-launch-note",
    status: "draft",
    category: "announcement",
    buildingId: "b",
    building: { id: "b", slug: "park", name: "Park" },
    publishedAt: "2026-05-02T09:00:00.000Z",
    coverImage: "/assets/buildings/residence/exterior/exterior-front.jpg",
    coverImageAlt: "Park staged preview",
    gallery: [],
    translations: {
      bg: {
        title: "Подготовка за Парк",
        excerpt: "Чернова, скрита до потвърждение на официалните данни.",
        body: ["Тази публикация остава скрита, докато не бъдат подадени официалните стойности."],
      },
      en: {
        title: "Park Preparation",
        excerpt: "Draft, hidden until official data is confirmed.",
        body: ["This post remains hidden until the official values are supplied."],
      },
    },
  },
];
