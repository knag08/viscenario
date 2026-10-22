/**
 * Post-build gate over dist/, run by `npm run build`. It fails the build on:
 *   - a broken internal link, or a missing image (src and every srcset entry)
 *   - a page without a <title>, a meta description or exactly one <h1>
 *   - an <img> without alt, a skipped heading level, or a duplicate id
 */
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(import.meta.dirname, '..');
const dist = path.join(siteDir, 'dist');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const problems = [];

/** Does a site-absolute URL exist in the published output? */
function resolves(url) {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return fs.existsSync(path.join(dist, 'index.html'));

  const rel = clean.replace(/^\//, '');
  if (fs.existsSync(path.join(dist, rel))) return true;
  return fs.existsSync(path.join(dist, rel, 'index.html'));
}

for (const file of htmlFiles) {
  const page = '/' + path.relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const isRedirect = html.includes('http-equiv="refresh"');

  if (!isRedirect) {
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${page} — missing <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${page} — missing description`);
    if (!/<h1[^>]*>/.test(html)) problems.push(`${page} — no <h1>`);

    // Every image needs an alt attribute. A bare or empty `alt` is fine — the HTML
    // serialiser writes alt="" as `alt`, and that correctly marks it decorative.
    for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\salt(=|[\s/>])/.test(tag)) problems.push(`${page} — <img> without alt: ${tag.slice(0, 90)}`);
    }

    // Exactly one h1, and no skipped heading level on the way down.
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    const h1Count = levels.filter((l) => l === 1).length;
    if (h1Count !== 1) problems.push(`${page} — expected exactly one <h1>, found ${h1Count}`);
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        problems.push(`${page} — heading level jumps from h${levels[i - 1]} to h${levels[i]}`);
        break;
      }
    }

    // Duplicate ids break in-page anchors and label/control association.
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    for (const id of new Set(duplicates)) problems.push(`${page} — duplicate id="${id}"`);
  }

  const urls = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    urls.push(...m[1].split(',').map((part) => part.trim().split(/\s+/)[0]).filter((u) => u.startsWith('/')));
  }
  for (const url of urls) {
    if (url.startsWith('//')) continue;
    if (!resolves(url.replace(/&amp;/g, '&'))) problems.push(`${page} — broken reference: ${url}`);
  }
}

console.log(`Checked ${htmlFiles.length} pages.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of [...new Set(problems)]) console.error(`  • ${problem}`);
  process.exit(1);
}
console.log('No broken links or images; every page has a title, description, one h1, image alts, ordered headings and unique ids.');
