/**
 * Which company each customer logo belongs to. The old site carried most
 * logos with no name at all (alt="logo"), so these were read off the images.
 */
export const logoNames: Record<string, string> = {
  'media/2018/06/logo-02.png': 'Consto',
  'media/2018/06/logo-04.png': 'PEAB',
  'media/2018/06/logo-05.png': 'Sans Bygg',
  'media/2018/06/logo-07.png': 'Urbanium',
  'media/2019/11/Backe-logo.png': 'Backe',
  'media/2019/11/NP-BYGG-Logo.jpg': 'NP Bygg',
  'media/2019/11/Takst-logo-small-copy.jpg': 'Takst & Befaringssenteret',
  'media/2019/11/hent-logo.png': 'Hent',
  'media/2019/11/m2-logo.jpg': 'M2 Entreprenør',
  'media/2019/11/seltor-logo.png': 'Seltor',
  'media/2020/03/JI-Bygg-logo-small.png': 'J. I. Bygg',
  'media/2020/03/Norefjell-ski-og-spa-small-1.png': 'Norefjell Ski & Spa',
  'media/2020/03/kuben_logo-small-1.png': 'Kuben Yrkesarena',
  'media/2020/09/AF_Gruppen-small.png': 'AF Gruppen',
  'media/2021/09/Betonmast-logo-small.png': 'Betonmast',
  'media/2021/09/Selvaag_bolig_logo_samlet-03-small.png': 'Selvaag Bolig',
  'media/2021/09/Stø-logo-140x210.png': 'STØ Entreprenør',
  'media/2022/04/M3-small.jpg': 'M3 Boliger',
};

export function logoName(key: string): string {
  const name = logoNames[key];
  if (!name) throw new Error(`No company name recorded for ${key} in src/data/logos.ts`);
  return name;
}
