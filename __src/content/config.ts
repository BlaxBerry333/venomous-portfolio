import { defineCollection, z } from "astro:content";

const themeEnum = z.enum(["void", "manga", "zenless"]);

const workDetails = defineCollection({
  type: "content",
  schema: z.object({
    workId: z.string(),
    theme: themeEnum,
  }),
});

export const collections = { workDetails };
