import { describe, expect, it } from "vitest";
import { getOrientationLabel } from "@/lib/i18n/property";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPublicBuilding, getPublicUnit } from "@/lib/pautalia-data";

describe("Bulgarian localization", () => {
  it("localizes orientation values", () => {
    expect(getOrientationLabel("bg", "south-west")).toBe("Югозапад");
    expect(getOrientationLabel("bg", "south-east")).toBe("Югоизток");
  });

  it("returns localized building presentation fields", async () => {
    const { item } = await getPublicBuilding("bg", "building-a");

    expect(item.tagline).toContain("По-просторни жилища");
    expect(item.shortDescription).toContain("Просторни жилища");
    expect(item.description).toContain("Сграда A предлага");
    expect(item.amenities).toContain("Контролиран достъп и видеонаблюдение");
  });

  it("returns localized unit marketing copy and features", async () => {
    const { item: unit } = await getPublicUnit("bg", "unit-a201");

    expect(unit.highlight).toContain("3-стаен апартамент");
    expect(unit.highlight).toContain("спални");
    expect(unit.description).toContain("на етаж 2");
    expect(unit.description).toContain("балкон");
    expect(unit.features).toEqual(["Две спални", "Една баня", "Отделна тоалетна", "Балкон"]);
  });

  it("defaults requests to Bulgarian regardless of Accept-Language", () => {
    const request = new Request("https://pautalia.bg/api/pautalia/units", {
      headers: {
        "accept-language": "en-US,en;q=0.9",
      },
    });

    expect(getRequestLocale(request)).toBe("bg");
  });

  it("honors an explicit locale cookie after the user switches language", () => {
    const request = new Request("https://pautalia.bg/api/pautalia/units", {
      headers: {
        "accept-language": "en-US,en;q=0.9",
        cookie: "pautalia_locale=en",
      },
    });

    expect(getRequestLocale(request)).toBe("en");
  });

  it("still allows an explicit locale query override for request handlers", () => {
    const request = new Request("https://pautalia.bg/api/pautalia/units?lang=en", {
      headers: {
        "accept-language": "bg-BG,bg;q=0.9",
      },
    });

    expect(getRequestLocale(request)).toBe("en");
  });
});
