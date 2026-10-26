import * as Theme from "@/ui/themes";
import { afterEach, describe, expect, test, vi } from "vitest";

const SELECTION_FALLBACK = {
  group: "warhammer",
  variants: { warhammer: "tzeentch", dmc: "vergil" },
};

function selectionStored(raw: string | null) {
  vi.stubGlobal("window", { localStorage: { getItem: () => raw } });
  return Theme.selectionRead();
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("selectionRead", () => {
  test("falls back to Tzeentch when nothing is stored", () => {
    expect(selectionStored(null)).toEqual(SELECTION_FALLBACK);
  });

  test("falls back when the stored value is broken", () => {
    expect(selectionStored("{")).toEqual(SELECTION_FALLBACK);
    expect(selectionStored('"dmc"')).toEqual(SELECTION_FALLBACK);
  });

  test("keeps valid variants when the group is unknown", () => {
    expect(
      selectionStored(JSON.stringify({ group: "nebula", variants: { warhammer: "slaanesh" } })),
    ).toEqual({ group: "warhammer", variants: { warhammer: "slaanesh", dmc: "vergil" } });
  });

  test("resets an unknown variant to the group default", () => {
    expect(selectionStored(JSON.stringify({ group: "dmc", variants: { dmc: "nero" } }))).toEqual({
      group: "dmc",
      variants: { warhammer: "tzeentch", dmc: "vergil" },
    });
  });

  test("restores a valid selection", () => {
    expect(
      selectionStored(
        JSON.stringify({ group: "dmc", variants: { warhammer: "slaanesh", dmc: "dante" } }),
      ),
    ).toEqual({ group: "dmc", variants: { warhammer: "slaanesh", dmc: "dante" } });
  });

  test("falls back when storage access throws", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("SecurityError");
        },
      },
    });
    expect(Theme.selectionRead()).toEqual(SELECTION_FALLBACK);
  });
});
