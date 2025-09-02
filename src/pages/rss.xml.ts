import { DEFAULT_LANG } from '@/utils/i18n';
import { generateRssForLang } from '@/utils/rss';

export async function GET(context: { site: URL }) {
  return generateRssForLang(DEFAULT_LANG, context.site);
}
