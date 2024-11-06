import { z, defineCollection } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    created: z.string(),
    image: z.string(),
    color: z.string().optional(),
    secondaryColor: z.string().optional(),
    tokens: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    font: z.string().optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    created: z.string(),
    updated: z.string(),
    image: z.string(),
    color: z.string().optional(),
    secondaryColor: z.string().optional(),
    tokens: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    font: z.string().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
};