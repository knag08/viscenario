/**
 * Everything about Viscenario that more than one page shows, and the words of
 * the site's own chrome in each language. Page content lives in src/content.
 */

export type Lang = 'en' | 'nb';
export const langs: Lang[] = ['en', 'nb'];

export const site = {
  name: 'Viscenario',
  url: 'https://viscenario.com',
  tagline: 'Mobile platform for collaboration in projects, hand over and maintenance',
  phone: { display: '(+47) 22 53 50 06', href: 'tel:+4722535006' },
  email: 'contact@viscenario.com',
  legalEmail: 'legal@viscenario.com',
  login: 'https://product.viscenario.com/users/login',
  apps: {
    ios: 'https://apps.apple.com/us/app/viscenario/id610277938',
    android: 'https://play.google.com/store/apps/developer?id=Viscenario+AS',
  },
  social: {
    facebook: 'https://www.facebook.com/Viscenariocom',
    linkedin: 'https://www.linkedin.com/company/viscenario-as',
  },
  offices: [
    { name: { en: 'Oslo, Norway', nb: 'Oslo' }, lines: ['Madserud allé 34', 'PROP-TECH Hub', 'Skøyen, Oslo, Norway'] },
    { name: { en: 'Kristiansand, Norway', nb: 'Kristiansand' }, lines: ['Universitetsveien 19', '4630 Kristiansand, Norway'] },
    { name: { en: 'Germany', nb: 'Tyskland' }, lines: ['Am Pannschoppen 1A', '40883 Ratingen, Germany'] },
  ],
  /**
   * Web3Forms access key for the contact form. It is a public key by design —
   * it only says which inbox receives the message — so it lives in the source.
   * Empty means the form is shown with sending switched off, and says so.
   */
  web3formsKey: '',
};

/** Where each page lives in each language. Pairs drive the language switcher and hreflang. */
export const paths = {
  home: { en: '/', nb: '/nb/' },
  products: { en: '/products/', nb: '/nb/produkter/' },
  industry: { en: '/industry/', nb: '/nb/bransjer/' },
  customers: { en: '/customers/', nb: '/nb/kunder/' },
  company: { en: '/company/', nb: '/nb/firma/' },
  contact: { en: '/contact-us/', nb: '/nb/kontakt-oss/' },
  demo: { en: '/book-demo/', nb: '/nb/bookdemo/' },
  account: { en: '/create-an-account/', nb: '/nb/opprett-konto/' },
  terms: { en: '/terms-and-conditions/', nb: '/nb/vilkar-for-bruk/' },
  privacy: { en: '/privacy-policy/', nb: '/nb/personvern/' },
  ip: { en: '/ip-policy/', nb: '/nb/ip-politikk/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof paths;

/** Product and industry detail pages keep their WordPress addresses. */
export const detailBase = {
  products: { en: '/products/', nb: '/nb/products/' },
  industries: { en: '/industry/', nb: '/nb/industry/' },
} as const;

export const words = {
  en: {
    languageName: 'English',
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close menu',
    nav: { products: 'Products', industry: 'Industry', company: 'Company', customers: 'Customers' },
    login: 'Log in',
    bookDemo: 'Book demo',
    readMore: 'Read more',
    contactUs: 'Contact us',
    support: 'Customer support',
    offices: 'Offices',
    legal: { terms: 'Terms & Conditions', privacy: 'Privacy Policy', ip: 'IP policy' },
    getTheApp: 'Get the app',
    rights: 'All rights reserved.',
    otherLanguage: 'Norsk',
    form: {
      heading: 'Get in touch',
      intro: 'Tell us a little about your projects and we will be in touch.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending…',
      sent: 'Thank you — your message has been sent. We will get back to you shortly.',
      failed: 'Sorry, the message could not be sent. Please email us at',
      offline: 'The contact form is not switched on yet. Please email us at',
      subject: 'Message from viscenario.com',
    },
    notFound: {
      title: 'Page not found',
      body: 'This page does not exist, or it has moved.',
      home: 'Go to the home page',
    },
  },
  nb: {
    languageName: 'Norsk',
    skip: 'Gå til innholdet',
    menu: 'Meny',
    close: 'Lukk menyen',
    nav: { products: 'Produkter', industry: 'Bransjer', company: 'Firma', customers: 'Kunder' },
    login: 'Logg inn',
    bookDemo: 'Book demo',
    readMore: 'Les mer',
    contactUs: 'Kontakt oss',
    support: 'Kundestøtte',
    offices: 'Kontorer',
    legal: { terms: 'Vilkår for bruk', privacy: 'Personvern', ip: 'IP-politikk' },
    getTheApp: 'Last ned appen',
    rights: 'Alle rettigheter forbeholdt.',
    otherLanguage: 'English',
    form: {
      heading: 'Ta kontakt',
      intro: 'Fortell oss litt om prosjektene deres, så tar vi kontakt.',
      name: 'Navn',
      email: 'E-post',
      phone: 'Telefon',
      message: 'Melding',
      send: 'Send melding',
      sending: 'Sender…',
      sent: 'Takk! Meldingen er sendt, og vi tar kontakt så snart vi kan.',
      failed: 'Beklager, meldingen kunne ikke sendes. Send oss en e-post på',
      offline: 'Kontaktskjemaet er ikke slått på ennå. Send oss en e-post på',
      subject: 'Melding fra viscenario.com',
    },
    notFound: {
      title: 'Fant ikke siden',
      body: 'Denne siden finnes ikke, eller den er flyttet.',
      home: 'Gå til forsiden',
    },
  },
} as const;
