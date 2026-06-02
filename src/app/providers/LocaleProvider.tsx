'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NextIntlClientProvider } from 'next-intl';
import {
  defaultLocale,
  LOCALE_COOKIE,
  locales,
  type Locale,
} from '@/i18n/config';

interface ILocaleContext {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<ILocaleContext | null>(null);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
    ?.split('=')[1] as Locale | undefined;

  if (cookie && locales.includes(cookie)) return cookie;

  const stored = localStorage.getItem(LOCALE_COOKIE) as Locale | null;
  if (stored && locales.includes(stored)) return stored;

  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, unknown> | null>(
    null,
  );

  useEffect(() => {
    setLocaleState(getInitialLocale());
  }, []);

  useEffect(() => {
    import(`../../../messages/${locale}.json`).then((mod) => {
      setMessages(mod.default);
    });
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_COOKIE, newLocale);
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  if (!messages) return null;

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
