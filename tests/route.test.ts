import * as I18n from "@/i18n";
import { describe, expect, test } from "vitest";

describe("route", () => {
  test("builds a locale home under the base path", () => {
    expect(I18n.route("ja")).toBe("/venomous-portfolio/ja/");
  });

  test("appends segments with a trailing slash", () => {
    expect(I18n.route("en", "work", "geniee-cdp")).toBe("/venomous-portfolio/en/work/geniee-cdp/");
  });
});
