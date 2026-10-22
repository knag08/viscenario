import type { ImageMetadata } from 'astro';

/**
 * Images migrated from WordPress uploads, keyed the way the data files name
 * them (`media/2019/11/pr-01.png`). Looking one up that does not exist throws,
 * so a typo in a data file fails the build instead of shipping a broken image.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/media/**/*.{png,jpg,jpeg,gif,webp}', {
  eager: true,
});

export function media(key: string): ImageMetadata {
  const found = files[`../assets/${key}`];
  if (!found) throw new Error(`No image at src/assets/${key}`);
  return found.default;
}
