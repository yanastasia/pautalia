import { describe, expect, it } from "vitest";
import { getOrientationLabel } from "@/lib/i18n/property";
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
});
