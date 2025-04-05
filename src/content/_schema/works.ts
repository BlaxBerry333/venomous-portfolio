import { defineCollection, getCollection, z, type CollectionEntry } from 'astro:content';

const workSchema = z.object({
  title: z.string(),
  date: z.string(),
  imageUrl: z.string().url(),
  skills: z.array(z.array(z.string())),
  links: z.object({
    github: z.string().optional(),
    demo: z.string().optional(),
  }),
});

const WORKS_DOCS_ENTRY = 'works' as const; // /src/content/works/*.md

export type WorkCollectionType = z.infer<typeof workSchema>;
export type WorkCollectionEntryType = CollectionEntry<typeof WORKS_DOCS_ENTRY>;

export const worksCollection = defineCollection({
  type: 'content',
  schema: workSchema,
});

function getWorksCollection(): Promise<WorkCollectionEntryType[]> {
  return getCollection(WORKS_DOCS_ENTRY);
}

export async function getAllWorks(): Promise<WorkCollectionEntryType[]> {
  const works = await getWorksCollection();
  // return works.sort((a, b) => {
  // const aDate = new Date(a.data.date);
  // const bDate = new Date(b.data.date);
  // return bDate.getTime() - aDate.getTime();
  // });
  return works.sort((a, b) => {
    const aTitle = a.data.title.replace(/^venomous[-\s]*/i, '');
    const bTitle = b.data.title.replace(/^venomous[-\s]*/i, '');
    return aTitle.localeCompare(bTitle);
  });
}

export async function getWorkById(id: string) {
  const works = await getWorksCollection();
  return works.find((work) => work.id === id);
}
