import { CHARACTER_IDS } from "./dmc/__common__/characters";

export const GROUPS = {
  warhammer: {
    label: "WARHAMMER 40K · 战锤 40K",
    variants: ["tzeentch", "slaanesh"],
  },
  dmc: {
    label: "DMC · 鬼泣",
    variants: CHARACTER_IDS,
  },
} as const;

export type GroupId = keyof typeof GROUPS;

export type VariantId<G extends GroupId = GroupId> = (typeof GROUPS)[G]["variants"][number];

export const GROUP_IDS = Object.keys(GROUPS) as GroupId[];

export const VARIANT_LABELS: Record<VariantId, string> = {
  tzeentch: "TZEENTCH · 奸奇",
  slaanesh: "SLAANESH · 色孽",
  dante: "DANTE · 但丁",
  vergil: "VERGIL · 维吉尔",
};

export function isGroupId(value: unknown): value is GroupId {
  return typeof value === "string" && (GROUP_IDS as string[]).includes(value);
}

export function isVariantOf<G extends GroupId>(group: G, value: unknown): value is VariantId<G> {
  return typeof value === "string" && (GROUPS[group].variants as readonly string[]).includes(value);
}
