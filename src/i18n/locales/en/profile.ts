import type * as I18n from "@/i18n";

export const PROFILE = {
  hints: {
    tzeentch: "Tap the screen to call down psychic lightning from the Warp",
    slaanesh: "Tap the screen to send ripples through the mists of the Warp",
    dante: "Tap repeatedly to unleash Dante’s Million Stab",
    vergil: "Tap repeatedly to unleash Vergil’s Judgement Cut",
  },
  about:
    "I’m a web engineer based in Tokyo. I love music with a strong beat, ornate gothic aesthetics, and dark, heavy space opera. The two themes of this site are inspired by two series I love: Warhammer 40K and Devil May Cry.",
  journey: {
    geniee: {
      company: "Geniee, Inc.",
      roles: {
        "2026":
          "GENIEE-X · UI/UX Design Team Lead\nGENIEE-X · Apps4 Team, Full-stack Developer (concurrent)\nGENIEE CHAT · Feature Development Team 2, Full-stack Developer (concurrent)",
        "2025":
          "CDP/DC · Feature Development Team, Frontend Tech Lead\nGENIEE CHAT · Full-stack Developer (concurrent)",
        "2023": "GENIEE CHAT · Full-stack Developer",
      },
    },
    skyfall: {
      company: "Skyfall Inc.",
      roles: {
        "2023": "Product Division · Frontend Developer\nSKYFLAG · Frontend Lead",
      },
    },
    fni: {
      company: "FAIR NEXT INNOVATION.INC",
      roles: {
        "2019": "IT Solutions Division · Full-stack Developer\nFrontend Lead (later)",
      },
    },
    freelance: {
      company: "Freelance",
      roles: {
        "2018":
          "Development for entertainment media and fashion event platforms\n(modelpress, TOKYO GIRLS COLLECTION, and others)",
      },
    },
  },
  closing: "Thanks for making it this far",
  contacts: {
    github: "GITHUB",
  },
} satisfies I18n.ProfileTexts;
