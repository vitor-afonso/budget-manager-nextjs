export const locales = ['en', 'pt-PT'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt-PT';
export const LOCALE_COOKIE = 'NEXT_LOCALE';
