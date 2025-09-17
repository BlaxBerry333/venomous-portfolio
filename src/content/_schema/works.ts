import { defineCollection, getCollection, z, type CollectionEntry } from "astro:content";

export enum WorkType {
  Personal = "Personal",
  Company = "Company",
}

const workSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  type: z.nativeEnum(WorkType),
  date: z.string(),
  imageUrl: z.string().url(),
  skills: z.array(z.array(z.string())),
});

const WORKS_DOCS_ENTRY = "works" as const; // /src/content/works/*.md

export type WorkCollectionType = z.infer<typeof workSchema>;
export type WorkCollectionEntryType = CollectionEntry<typeof WORKS_DOCS_ENTRY>;

export const worksCollection = defineCollection({
  type: "content",
  schema: workSchema,
});

function getWorksCollection(): Promise<WorkCollectionEntryType[]> {
  return getCollection(WORKS_DOCS_ENTRY);
}

export async function getAllWorks(): Promise<WorkCollectionEntryType[]> {
  const works = await getWorksCollection();
  return works.sort((a, b) => {
    // 先按 type 排序：Company 在前
    if (a.data.type !== b.data.type) {
      return a.data.type === "Company" ? -1 : 1;
    }
    // type 相同，按 date 降序
    const aDate = new Date(a.data.date.split(" - ")[0]);
    const bDate = new Date(b.data.date.split(" - ")[0]);
    return bDate.getTime() - aDate.getTime();
  });
}

export async function getWorkById(id: string) {
  const works = await getWorksCollection();
  return works.find((work) => work.id === id);
}
