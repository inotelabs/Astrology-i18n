import type { Lang } from '@/utils/i18n';
import { SUPPORTED_LANGS, DEFAULT_LANG } from '@/utils/i18n';

type Dict = Record<string, unknown>;

const modules = import.meta.glob('../i18n/*.json', { eager: true });

function extractLang(path: string): Lang | undefined {
  const m = path.match(/\/i18n\/(\w+)\.json$/);
  const code = (m?.[1] || '') as Lang;
  return (SUPPORTED_LANGS as readonly string[]).includes(code) ? code : undefined;
}

function asDict(mod: unknown): Dict {
  if (mod && typeof mod === 'object' && 'default' in (mod as any))
    return (mod as any).default as Dict;
  return (mod as Dict) || {};
}

const DICTS = SUPPORTED_LANGS.reduce<Record<Lang, Dict>>(
  (acc, lang) => {
    acc[lang] = {};
    return acc;
  },
  {} as Record<Lang, Dict>,
);

for (const [path, mod] of Object.entries(modules)) {
  const lang = extractLang(path);
  if (!lang) continue;
  DICTS[lang] = asDict(mod);
}

function get(obj: Dict, key: string): unknown {
  return key.split('.').reduce<unknown>((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in (acc as any)) return (acc as any)[part];
    return undefined;
  }, obj);
}

function format(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function getTranslations(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS[DEFAULT_LANG];
}

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const dict = getTranslations(lang);
  const v = get(dict, key);
  if (typeof v === 'string') return format(v, vars);
  const fallback = getTranslations(DEFAULT_LANG);
  const fv = get(fallback, key);
  return typeof fv === 'string' ? format(fv, vars) : key;
}

export type Translations = ReturnType<typeof getTranslations>;

export function categoryLabel(lang: Lang, section?: string): string | undefined {
  if (!section) return undefined;
  const direct = t(lang, `categories.${section}`);
  if (typeof direct === 'string' && !direct.startsWith('categories.')) return direct;
  const dict = getTranslations(lang) as any;
  const categories = (dict && (dict as any).categories) as Record<string, string> | undefined;
  if (categories) {
    const found = Object.entries(categories).find(
      ([, label]) => String(label).toLowerCase() === String(section).toLowerCase(),
    );
    if (found) return found[1];
  }
  return section;
}

export function categorySlug(lang: Lang, section?: string): string | undefined {
  if (!section) return undefined;
  const dict = getTranslations(lang) as any;
  const categories = (dict && (dict as any).categories) as Record<string, string> | undefined;
  const lower = String(section).toLowerCase();
  if (categories) {
    for (const [key, label] of Object.entries(categories)) {
      if (String(key).toLowerCase() === lower) return key;
      if (String(label).toLowerCase() === lower) return key;
    }
  }
  return lower;
}

export function tagLabel(lang: Lang, tag?: string): string | undefined {
  if (!tag) return undefined;
  const direct = t(lang, `tags.${tag}`);
  if (typeof direct === 'string' && !direct.startsWith('tags.')) return direct;
  const dict = getTranslations(lang) as any;
  const tags = (dict && (dict as any).tags) as Record<string, string> | undefined;
  if (tags) {
    const found = Object.entries(tags).find(
      ([, label]) => String(label).toLowerCase() === String(tag).toLowerCase(),
    );
    if (found) return found[1];
  }
  return tag;
}

export function tagSlug(lang: Lang, tag?: string): string | undefined {
  if (!tag) return undefined;
  const dict = getTranslations(lang) as any;
  const tags = (dict && (dict as any).tags) as Record<string, string> | undefined;
  const lower = String(tag).toLowerCase();
  if (tags) {
    for (const [key, label] of Object.entries(tags)) {
      if (String(key).toLowerCase() === lower) return key;
      if (String(label).toLowerCase() === lower) return key;
    }
  }
  return lower;
}
