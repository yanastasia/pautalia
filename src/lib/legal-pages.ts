import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/config";

const fallbackLegalPages = {
  privacy: {
    en: {
      title: "Privacy Policy",
      body: "Pautalia stores enquiry data so the sales team can respond to buyer requests. Personal data may include name, email, phone, message, source page, consent timestamp, and hashed technical metadata. Contact the sales team to request access, correction, or deletion.",
    },
    bg: {
      title: "Политика за поверителност",
      body: "Pautalia съхранява данни от запитвания, за да може търговският екип да отговаря на купувачи. Данните могат да включват име, имейл, телефон, съобщение, източник на запитването, момент на съгласие и хеширани технически данни. Свържете се с екипа за достъп, корекция или изтриване.",
    },
  },
  cookies: {
    en: {
      title: "Cookie Policy",
      body: "Necessary cookies keep the website working and remember language and consent choices. Anonymous aggregate analytics events may be counted without persistent visitor IDs. If you accept analytics, Pautalia uses anonymous first-party visitor and session IDs plus approximate country/city from request metadata to understand returning visits, apartment interest, and funnel performance. Marketing cookies are not used.",
    },
    bg: {
      title: "Политика за бисквитки",
      body: "Необходимите бисквитки поддържат сайта работещ и запазват избора за език и съгласие. Анонимни обобщени аналитични събития могат да се броят без постоянни идентификатори на посетителя. Ако приемете аналитика, Pautalia използва анонимни първични идентификатори за посетител и сесия, както и приблизителна държава/град от техническите данни на заявката, за да разбира повторни посещения, интерес към апартаменти и ефективност на фунията. Маркетингови бисквитки не се използват.",
    },
  },
  terms: {
    en: {
      title: "Terms of Use",
      body: "The website presents project information for enquiry purposes. Availability, pricing, specifications, and visuals may change and should be confirmed directly with the sales team before any purchase decision.",
    },
    bg: {
      title: "Условия за ползване",
      body: "Сайтът представя информация за проекта с цел запитвания. Наличности, цени, спецификации и визуализации могат да се променят и трябва да бъдат потвърдени с търговския екип преди решение за покупка.",
    },
  },
} as const;

export type LegalSlug = keyof typeof fallbackLegalPages;

export async function getLegalPage(slug: LegalSlug, locale: Locale) {
  try {
    const page = await prisma.legalPage.findUnique({
      where: {
        slug_locale: {
          slug,
          locale,
        },
      },
    });

    if (page?.isPublished) {
      return {
        title: page.title,
        body: page.body,
      };
    }
  } catch {
    // Static fallback keeps legal routes available before the CMS database exists.
  }

  return fallbackLegalPages[slug][locale];
}
