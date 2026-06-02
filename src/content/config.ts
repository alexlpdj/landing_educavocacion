import { z, defineCollection } from 'astro:content';

const cursosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    hours: z.number(),
    ects: z.number(),
    modality: z.string().default('100% Virtual'),
    category: z.array(z.string()),
    icon: z.string(),
    packEligible: z.boolean().default(false),
    profesorName: z.string(),
    profesorRole: z.string(),
    profesorPhoto: z.string().optional(),
    profesorBio: z.string(),
    modules: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    profiles: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })),
    benefits: z.array(z.string()),
    evaluation: z.string(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
    image: z.string().optional(),
    stripeLink: z.string().optional(),
    stripePackLink: z.string().optional(),
  }),
});

export const collections = {
  cursos: cursosCollection,
};
