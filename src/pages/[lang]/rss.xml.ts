import { SUPPORTED_LANGS, DEFAULT_LANG, type Lang } from '@/utils/i18n';
import { generateRssForLang } from '@/utils/rss';

export const prerender = true;

export function getStaticPaths() {
  return SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));
}

export async function GET(context: { site: URL; params: { lang: string } }) {
  const langParam = (context.params.lang || '').toLowerCase();
  const lang = (SUPPORTED_LANGS as readonly string[]).includes(langParam)
    ? (langParam as Lang)
    : DEFAULT_LANG;
  return generateRssForLang(lang, context.site);
}
