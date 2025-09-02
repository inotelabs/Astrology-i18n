import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';
import { remarkModifiedTime } from './src/utils/remark-modified-time.mjs';

export default defineConfig({
  site: 'https://astrology-i18n.vercel.app',
  trailingSlash: 'always',

  prefetch: {
    defaultStrategy: 'viewport',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'fr', 'es', 'ru', 'ja', 'ko', 'pt', 'de', 'id'],
    fallback: {
      en: 'zh',
      fr: 'zh',
      es: 'zh',
      ru: 'zh',
      ja: 'zh',
      ko: 'zh',
      pt: 'zh',
      de: 'zh',
      id: 'zh',
    },
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
      fallbackType: 'rewrite',
    },
  },

  image: {
    responsiveStyles: true,
    layout: 'constrained',
    remotePatterns: [
      { protocol: 'https', hostname: '*.unsplash.com' },],
  },

  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en-US',
          fr: 'fr-FR',
          es: 'es-ES',
          ru: 'ru-RU',
          ja: 'ja-JP',
          ko: 'ko-KR',
          pt: 'pt-PT',
          de: 'de-DE',
          id: 'id-ID',
        },
      },
    }),
    mdx(),
    pagefind(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    icon({
      include: {
        tabler: ['*'],
        mdi: ['*'],
      },
    }),
  ],
});
