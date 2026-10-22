/**
 * Writes a redirect stub at every old WordPress address that no longer has a
 * page of its own, so links and search results keep working.
 *
 * GitHub Pages cannot send a real 301, so each stub is an HTML page at the old
 * path with a canonical link (which search engines treat much like a permanent
 * redirect), an immediate meta refresh, and a script fallback that keeps any
 * #fragment. They go into public/ and are published with everything else.
 *
 * English and Norwegian pages kept their addresses and need nothing here. What
 * is listed is everything else the old site answered: German (not carried
 * over), the customer pages that never had content, and redirects WordPress
 * itself was already making.
 *
 * Run with `npm run redirects` after changing the map; the build checks that
 * every target exists.
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://viscenario.com';

/** German pages, each to the English page that says the same thing. */
const german = {
  '/de/': '/',
  '/de/bookdemo/': '/book-demo/',
  '/de/branchen/': '/industry/',
  '/de/create-an-account/': '/create-an-account/',
  '/de/ip-policy/': '/ip-policy/',
  '/de/kontakt/': '/contact-us/',
  '/de/kunden/': '/customers/',
  '/de/customers/': '/customers/',
  '/de/privacy-policy/': '/privacy-policy/',
  '/de/produkte/': '/products/',
  '/de/terms-and-conditions/': '/terms-and-conditions/',
  '/de/unternehmen/': '/company/',

  '/de/industry/bauunternehmen/': '/industry/construction-companies/',
  '/de/industry/projektentwickler/': '/industry/property-developer/',
  '/de/industry/wohnungseigentuemer/': '/industry/building-owners/',
  '/de/industry/wartungsfirmen-facility-mangement/': '/industry/maintenance-companies/',

  // Six of these were linked to their English page in WPML; the rest are matched by subject.
  '/de/products/abweichungsmanagement/': '/products/defect-management/',
  '/de/products/betriebs-und-wartungsdokumentation/': '/products/maintenance-operational-documentation/',
  '/de/products/bilddokumentation/': '/products/photo-documentation/',
  '/de/products/checklisten/': '/products/checklist-on-mobile/',
  '/de/products/document-management/': '/products/document-management/',
  '/de/products/gewaehrleistungszeitraum/': '/products/warranty-period/',
  '/de/products/hse-berichte/': '/products/weekly-hse-reporting/',
  '/de/products/hse-sigeko/': '/products/hse/',
  '/de/products/inspektion/': '/products/inspection/',
  '/de/products/integration/': '/products/integration/',
  '/de/products/jahresinspektion/': '/products/one-year-inspections/',
  '/de/products/offene-aufgabenmanagement/': '/products/open-task-management/',
  '/de/products/qualitaetssicherung/': '/products/quality-assurance/',
  '/de/products/schadensmeldungen/': '/products/issue-management/',
  '/de/products/schadensmeldugen/': '/products/issue-management/',
  '/de/products/service-agreements/': '/products/service-agreements/',
  '/de/products/serviceterminen/': '/products/service-agreements/',
  '/de/products/uebergabe/': '/products/hand-over/',
  '/de/products/vorbegehung-mit-kunden/': '/products/pre-inspection-with-clients/',
  '/de/products/woechentliche-hse-berichtestattung/': '/products/weekly-hse-reporting/',
  '/de/products/woechentliche-hse-berichte/': '/products/weekly-hse-reporting/',
  '/de/products/wohnungskonfigurator/': '/products/options/',
  '/de/products/zugriff-auf-dokumentation-von-subunternehmern/': '/products/collect-maintenance-documentation/',
};

/**
 * Every customer had a page of its own on the old site, and every one of them
 * was empty: a heading and nothing else. They go to the customers page, which
 * is where the logos and stories actually were.
 */
const customerSlugs = {
  en: ['backe', 'consto', 'hent', 'm2-entreprenor', 'np-bygg', 'peab', 'sans-bygg-2', 'seltor', 'selvaag-bolig',
    'takst-befaringssenteret', 'urbanium-2'],
  nb: ['7619', 'af-gruppen', 'backe', 'betonmast', 'consto', 'hent', 'j-i-bygg', 'kuben-yrkesarena', 'norefjell-ski-spa',
    'np-bygg', 'peab', 'sans-bygg', 'seltor', 'selvaag-bolig', 'sto-entreprenor', 'takst-befaringssenteret', 'urbanium'],
  de: ['backe', 'consto', 'hent', 'm2-entreprenoer', 'np-bygg', 'peab', 'sans-bygg', 'seltor', 'takst-befaringssenteret', 'urbanium'],
};
const customers = Object.fromEntries([
  ...customerSlugs.en.map((s) => [`/customers/${s}/`, '/customers/']),
  ...customerSlugs.nb.map((s) => [`/nb/customers/${s}/`, '/nb/kunder/']),
  ...customerSlugs.de.map((s) => [`/de/customers/${s}/`, '/customers/']),
]);

/** Redirects WordPress was already answering, kept so their links still land. */
const wordpress = {
  '/home/': '/',
  '/nb/hjem/': '/nb/',
  '/de/home/': '/',
  '/nb/create-an-account/': '/nb/opprett-konto/',
  '/category/events/': '/',
  // The retired Dutch site's pages that WordPress was still forwarding.
  '/nl/huis/': '/',
  '/nl/klanten/': '/customers/',
  '/nl/customers/': '/customers/',
  '/nl/neem-contact-op/': '/contact-us/',
  '/nl/voorwaarden/': '/terms-and-conditions/',
  '/nl/ie-beleid/': '/ip-policy/',
  '/nl/privacypolicy/': '/privacy-policy/',
  '/nl/create-an-account/': '/create-an-account/',
  '/nl/beginnen/': '/contact-us/',
  '/nl/carriere/': '/company/',
  '/nl/geschiedenis/': '/company/',
  '/nl/legal-nl/': '/terms-and-conditions/',
  '/nl/customer-home/': '/',
  '/nl/logout/': '/',
  '/nl/viscenario-for-handover/': '/products/hand-over/',
  '/nl/viscenario-in-uw-gebouw/': '/industry/building-owners/',
  '/nl/viscenario-service-app/': '/industry/maintenance-companies/',
  '/nl/viscenario-tenant-huurbeheer/': '/industry/building-owners/',
};

export const redirects = { ...german, ...customers, ...wordpress };

const outDir = path.resolve(import.meta.dirname, '../public');

const page = (target) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to ${SITE}${target}</title>
    <link rel="canonical" href="${SITE}${target}" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <style>
      body { font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; color: #242630;
             display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 0 16px; }
      a { color: #b43915; }
    </style>
  </head>
  <body>
    <p>This page has moved. <a href="${target}">Continue to ${SITE}${target}</a></p>
    <script>location.replace(${JSON.stringify(target)} + location.hash);</script>
  </body>
</html>
`;

// Only write when run directly; check-old-urls.mjs imports the map.
if (import.meta.url === `file://${process.argv[1]}`) {
  // Clear out stubs written last time, so one removed from the map disappears.
  const listFile = path.join(import.meta.dirname, 'redirects-written.txt');
  if (fs.existsSync(listFile)) {
    for (const from of fs.readFileSync(listFile, 'utf8').split('\n').filter(Boolean)) {
      const file = path.join(outDir, from, 'index.html');
      if (fs.existsSync(file)) fs.rmSync(file);
      let dir = path.dirname(file);
      while (dir.startsWith(outDir) && dir !== outDir && fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
        dir = path.dirname(dir);
      }
    }
  }

  for (const [from, target] of Object.entries(redirects)) {
    const file = path.join(outDir, from, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, page(target));
  }
  fs.writeFileSync(listFile, Object.keys(redirects).sort().join('\n') + '\n');

  console.log(`Wrote ${Object.keys(redirects).length} redirect stubs to public/.`);
}
