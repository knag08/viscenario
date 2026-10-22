/**
 * Horizontal-overflow sweep. Paste into the browser console on any page of the
 * built site served locally (for example `python3 -m http.server 4400` from the
 * site/dist folder, then open http://127.0.0.1:4400/404.html).
 *
 * It loads every page into an off-screen iframe at each width — an iframe has
 * its own viewport, so media queries see the real width — and reports any page
 * whose document is wider than the viewport, with the elements sticking out.
 * The page list comes from the sitemap, so it needs no upkeep.
 *
 * Results land in window.__sweep; `done` turns true when it finishes.
 */
window.__sweep = { done: false, progress: 0, results: [] };
(async () => {
  const sitemap = await (await fetch('/sitemap-0.xml')).text();
  const pages = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]).concat(['/404.html']);
  const widths = [320, 390, 768, 1024, 1280, 1440];
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;left:-20000px;top:0;height:900px;border:0';
  document.body.appendChild(frame);
  for (const w of widths) {
    frame.style.width = `${w}px`;
    for (const p of pages) {
      await new Promise((res) => {
        frame.onload = res;
        frame.src = p;
      });
      const d = frame.contentDocument;
      // Off-screen lazy images never load; the width and height Astro writes
      // on each one already reserve their space, so layout does not wait on them.
      d.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
      await d.fonts.ready;
      await new Promise((r) => setTimeout(r, 40));
      const sw = d.documentElement.scrollWidth;
      const vw = frame.contentWindow.innerWidth;
      if (sw > vw) {
        const culprits = [...d.body.querySelectorAll('*')]
          .filter((e) => e.getBoundingClientRect().right > vw + 1 && e.getBoundingClientRect().width > 0)
          .slice(0, 4)
          .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 3).join('.')}`);
        window.__sweep.results.push({ width: w, page: p, scrollWidth: sw, culprits });
      }
      window.__sweep.progress++;
    }
  }
  frame.remove();
  Object.assign(window.__sweep, { done: true, pages: pages.length, total: pages.length * widths.length });
  console.log(`Overflow sweep: ${window.__sweep.results.length} overflow(s) in ${window.__sweep.total} checks`, window.__sweep.results);
})();
