import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site, url }) => {
  const base = site ?? url;
  const sitemapURL = new URL('sitemap-index.xml', base);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
