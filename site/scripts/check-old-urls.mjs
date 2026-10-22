/**
 * Replays every address the WordPress site answered (scripts/old-urls.txt)
 * against the built site in dist/, and fails unless each one either is a page
 * or is a redirect stub whose target is a page.
 *
 * Run after `npm run build`: `npm run check:urls`.
 */
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(import.meta.dirname, '..');
const dist = path.join(siteDir, 'dist');
const list = path.join(import.meta.dirname, 'old-urls.txt');

const urls = fs.readFileSync(list, 'utf8').split('\n').filter((l) => l.startsWith('/'));

function fileFor(url) {
  const file = path.join(dist, url, url.endsWith('/') ? 'index.html' : '');
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

let pages = 0;
let redirects = 0;
const failures = [];

for (const url of urls) {
  const file = fileFor(url);
  if (!file) {
    failures.push(`${url} — 404`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const refresh = html.match(/http-equiv="refresh" content="0; url=([^"]+)"/);
  if (!refresh) {
    pages++;
    continue;
  }
  const target = refresh[1];
  const landing = fileFor(target);
  if (!landing) failures.push(`${url} — redirects to ${target}, which does not exist`);
  else if (fs.readFileSync(landing, 'utf8').includes('http-equiv="refresh"')) failures.push(`${url} — redirects to another redirect (${target})`);
  else redirects++;
}

console.log(`${urls.length} old addresses: ${pages} still pages, ${redirects} redirect to a page.`);
if (failures.length) {
  console.error(`\n${failures.length} old address(es) would break:`);
  for (const f of failures) console.error(`  • ${f}`);
  process.exit(1);
}
console.log('Every old address resolves.');
