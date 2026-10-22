// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://viscenario.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Not the default `_astro`: should this ever be published from a branch,
    // Jekyll drops underscore-prefixed folders and every page deploys unstyled.
    assets: 'assets',
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', nb: 'nb' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },

  /**
   * A Content-Security-Policy on every page, as a <meta> tag because GitHub
   * Pages cannot send headers. Astro hashes its own scripts and styles into
   * it, so nothing inline runs unless the build put it there. The only other
   * origins are the YouTube player (no-cookie domain) and Web3Forms, which
   * receives the contact form.
   */
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://api.web3forms.com",
        'frame-src https://www.youtube-nocookie.com',
        "form-action 'self' https://api.web3forms.com",
        "base-uri 'self'",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ],
    },
  },

  /**
   * Old WordPress addresses that no longer have a page of their own (German,
   * the empty customer pages, retired Dutch URLs) are written as literal
   * meta-refresh files into public/ by scripts/make-redirects.mjs, rather than
   * through Astro's `redirects`, so each one carries a canonical link and lands
   * at exactly the path inbound links use.
   */
});
