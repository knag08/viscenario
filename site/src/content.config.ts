import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Each collection holds one folder per language (en/, nb/). The English and
// Norwegian sites were written separately, so an entry has no translation pair.
const products = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/products' }),
  schema: z.object({ title: z.string(), description: z.string() }),
});

const industries = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/industries' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    order: z.number(),
  }),
});

/** Plain pages. `path` is the page's address within its language (not `slug`, which the glob loader would take as the entry id). */
const pages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), path: z.string(), description: z.string() }),
});

export const collections = { products, industries, pages };
