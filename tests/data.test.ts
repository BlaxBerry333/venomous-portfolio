import * as I18n from "@/i18n";
import { describe, expect, test } from "vitest";

const WORK_IDS = I18n.Data.WORKS.map((work) => work.id);

describe.each(I18n.LOCALES)("%s", (locale) => {
  const works = I18n.Data.localizedWorks(locale);

  test("every work has a subtitle and a period", () => {
    for (const work of works) {
      expect(work.subtitle.trim(), work.id).not.toBe("");
      expect(work.period.trim(), work.id).not.toBe("");
    }
  });

  test("related works exist and never point to themselves", () => {
    for (const work of works) {
      for (const id of work.related ?? []) {
        expect(WORK_IDS, `${work.id} → ${id}`).toContain(id);
        expect(id, work.id).not.toBe(work.id);
      }
    }
  });

  test("every screenshot has alt text", () => {
    for (const work of works) {
      for (const image of work.images ?? []) {
        expect(image.alt.trim(), work.id).not.toBe("");
      }
    }
  });

  test("screenshot captions match the screenshots", () => {
    for (const source of I18n.Data.WORKS) {
      const images = "images" in source ? Object.keys(source.images ?? {}) : [];
      const captions = Object.keys(I18n.MESSAGES[locale].WORKS[source.id].images ?? {});
      expect(captions.sort(), source.id).toEqual(images.sort());
    }
  });

  test("career roles and contacts have text", () => {
    for (const entry of I18n.Data.localizedJourney(locale)) {
      expect(entry.company.trim()).not.toBe("");
      for (const role of entry.roles) expect(role.text.trim(), entry.company).not.toBe("");
    }
    for (const contact of I18n.Data.localizedContacts(locale)) {
      expect(contact.text.trim()).not.toBe("");
    }
  });
});

describe("works", () => {
  test("ids are unique", () => {
    expect(new Set(WORK_IDS).size).toBe(WORK_IDS.length);
  });
});
