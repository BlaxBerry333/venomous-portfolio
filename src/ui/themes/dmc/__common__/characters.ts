export const CHARACTER_IDS = ["dante", "vergil"] as const;

export type CharacterId = (typeof CHARACTER_IDS)[number];

export interface Character {
  colors: {
    background: string;
    smoke: string;
    accent: string;
    hot: string;
    spark: string;
  };
}

export const CHARACTERS: Record<CharacterId, Character> = {
  dante: {
    colors: {
      background: "#070204",
      smoke: "#4a0a12",
      accent: "#b5121b",
      hot: "#ffffff",
      spark: "#d41f2f",
    },
  },
  vergil: {
    colors: {
      background: "#020409",
      smoke: "#071a3d",
      accent: "#3d8cff",
      hot: "#e9f6ff",
      spark: "#4fc3ff",
    },
  },
};
