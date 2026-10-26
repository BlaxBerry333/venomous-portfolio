import * as I18n from "@/i18n";
import { describe, expect, test } from "vitest";

const WORK_IDS = I18n.Data.WORKS.map((work) => work.id);

const LEGACY_CASES: readonly [string, string][] = [
  ["/venomous-portfolio/", "/venomous-portfolio/ja/"],
  ["/venomous-portfolio", "/venomous-portfolio/ja/"],
  ["/venomous-portfolio/ja/nebula", "/venomous-portfolio/ja/"],
  ["/venomous-portfolio/zh/sanguine/works", "/venomous-portfolio/zh/"],
  ["/venomous-portfolio/en/nebula/works/geniee-cdp", "/venomous-portfolio/en/work/geniee-cdp/"],
  ["/venomous-portfolio/en/nebula/works/geniee-cdp/", "/venomous-portfolio/en/work/geniee-cdp/"],
  ["/venomous-portfolio/ja/nebula/works/youzan-full-scope", "/venomous-portfolio/ja/"],
  ["/venomous-portfolio/ja/nebula/about", "/venomous-portfolio/ja/"],
  ["/venomous-portfolio/zh/sanguine/design-system", "/venomous-portfolio/zh/"],
  ["/venomous-portfolio/ja/work/missing", "/venomous-portfolio/ja/"],
  ["/venomous-portfolio/fr/nebula/works/geniee-cdp", "/venomous-portfolio/ja/"],
  ["/venomous-portfolio/whatever/path", "/venomous-portfolio/ja/"],
  ["/favicon.ico", "/venomous-portfolio/ja/"],
];

describe("legacyTarget", () => {
  test.each(LEGACY_CASES)("%s → %s", (pathname, target) => {
    expect(I18n.legacyTarget(pathname, WORK_IDS)).toBe(target);
  });
});
