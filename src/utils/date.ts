import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { Lang } from '@/utils/i18n';
import { DEFAULT_LANG } from '@/utils/i18n';
import { t } from './translations';

import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/fr';
import 'dayjs/locale/es';
import 'dayjs/locale/ru';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/pt';
import 'dayjs/locale/de';
import 'dayjs/locale/id';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export function resolveDayjsLocale(lang: Lang): string {
  switch (lang) {
    case 'zh':
      return 'zh-cn';
    case 'en':
    case 'fr':
    case 'es':
    case 'ru':
    case 'ja':
    case 'ko':
    case 'pt':
    case 'de':
    case 'id':
      return lang;
    default:
      return 'en';
  }
}

export function formatDate(
  input?: string | number | Date,
  lang: Lang = DEFAULT_LANG,
  pattern?: string,
): string {
  if (!input) return '';
  const d = dayjs(input);
  const locale = resolveDayjsLocale(lang);
  const fmt = pattern || t(lang, 'dateFormat') || 'LL';
  return d.locale(locale).format(fmt);
}

export function formatDateTime(
  input?: string | number | Date,
  lang: Lang = DEFAULT_LANG,
  pattern?: string,
): string {
  return formatDate(input, lang, pattern || 'LLL');
}

export function formatRelative(input?: string | number | Date, lang: Lang = DEFAULT_LANG): string {
  if (!input) return '';
  const d = dayjs(input);
  const locale = resolveDayjsLocale(lang);
  return d.locale(locale).fromNow();
}

export function toISO(input?: string | number | Date): string | undefined {
  if (!input) return undefined;
  return dayjs(input).toISOString();
}
