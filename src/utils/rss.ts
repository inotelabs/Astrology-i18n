import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';
import { t } from './translations';

function toItem(entry: CollectionEntry<'post'>) {
  const lang = entry.data.locales as Lang;
  const idWithoutExt = entry.id.replace(/\.(md|mdx|markdown)$/i, '');
  const slugWithoutLang = idWithoutExt.replace(new RegExp(`^${lang}/`), '');
  const link = `/${lang}/posts/${slugWithoutLang}/`;

  return {
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.updatedDate ?? entry.data.pubDate,
    link,
    categories: [entry.data.category, ...entry.data.tags],
  };
}

export async function generateRssForLang(lang: Lang, site: URL) {
  const posts = await getCollection('post', (e) => !e.data.draft && e.data.locales === lang);
  const items = posts
    .sort((a, b) => (b.data.pubDate as Date).getTime() - (a.data.pubDate as Date).getTime())
    .slice(0, 5)
    .map(toItem);

  const title = `Astrology · ${lang.toUpperCase()}`;
  const description = t(lang, 'site.description');

  return rss({
    title,
    description,
    site,
    items,
    customData: `<language>${lang}</language>`,
  });
}
