/**
 * Generates the favicon set, and the link-preview image, from the orange figure
 * in the Viscenario logo (src/assets/brand/mark.svg, cut out of the logo itself).
 *
 * /favicon.ico matters even though the pages declare PNGs too: browsers request
 * it unprompted, and a 404 there leaves a blank tab.
 *
 * Run with `npm run favicons`.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const source = path.resolve(import.meta.dirname, '../src/assets/brand/mark.svg');
const logo = path.resolve(import.meta.dirname, '../src/assets/brand/logo-light.svg');
const out = path.resolve(import.meta.dirname, '../public');

/** The emblem sits edge to edge; a little air keeps it from feeling cramped. */
async function render(size, { background, padding = 0 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  let pipeline = sharp(source, { density: 600 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });

  // Sharpening the small sizes keeps the stripes of the figure distinct at 16
  // and 32 pixels, which is where a favicon actually lives.
  if (inner <= 48) pipeline = pipeline.sharpen({ sigma: 0.6 });

  const emblem = await pipeline.toBuffer();

  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  return canvas.composite([{ input: emblem, gravity: 'centre' }]).png().toBuffer();
}

/**
 * Packs PNGs into an .ico. The format is a small header plus one 16-byte
 * directory entry per image, and every browser in use accepts PNG payloads
 * inside it, so there is no need for a BMP encoder.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];

  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const white = { r: 255, g: 255, b: 255, alpha: 1 };

// Transparent for the tab, so the figure sits on whatever colour the browser
// chrome happens to be. The figure is tall and narrow, so it is fitted inside
// the square rather than stretched.
const ico = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, data: await render(size) })),
);
fs.writeFileSync(path.join(out, 'favicon.ico'), buildIco(ico));

fs.writeFileSync(path.join(out, 'favicon-16.png'), await render(16));
fs.writeFileSync(path.join(out, 'favicon-32.png'), await render(32));
fs.writeFileSync(path.join(out, 'icon-192.png'), await render(192));
fs.writeFileSync(path.join(out, 'icon-512.png'), await render(512));

// iOS composites a transparent touch icon onto black, so this one gets a solid
// ground and a margin, which is also what the platform's own icons look like.
fs.writeFileSync(
  path.join(out, 'apple-touch-icon.png'),
  await render(180, { background: white, padding: 0.1 }),
);

// Link previews: the full logo on the site's dark slate, 1200 x 630.
const wordmark = await sharp(logo, { density: 600 }).resize(760).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#242630' } })
  .composite([{ input: wordmark, gravity: 'centre' }])
  .png()
  .toFile(path.join(out, 'og-image.png'));

const written = [
  'favicon.ico', 'favicon-16.png', 'favicon-32.png',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'og-image.png',
];
for (const file of written) {
  console.log(`  ${file.padEnd(22)} ${fs.statSync(path.join(out, file)).size} bytes`);
}
