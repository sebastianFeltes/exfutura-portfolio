import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    bgImage: image(),
    technologies: z.array(z.object({
      name: z.string(),
      link: z.string().optional(),
    })),
    longDescription: z.string(),
    features: z.array(z.string()),
    targetAudience: z.array(z.string()),
    benefits: z.array(z.string()),
    process: z.array(z.string()),
    projects: z.array(z.object({
      name: z.string(),
      url: z.string(),
      description: z.string(),
    })).optional(),
    faqs: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    cta: z.string().optional(),
  }),
});

export const collections = {
  'services': servicesCollection,
};
