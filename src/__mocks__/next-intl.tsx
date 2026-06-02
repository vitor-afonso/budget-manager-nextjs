import React from 'react';
import enMessages from '../../messages/en.json';

type Messages = Record<string, any>;

function getNamespace(namespace: string): Messages {
  return namespace
    .split('.')
    .reduce((acc: Messages, key) => acc?.[key] ?? {}, enMessages as Messages);
}

function interpolate(value: string, params?: Record<string, string>): string {
  if (!params) return value;
  return Object.entries(params).reduce(
    (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), v),
    value,
  );
}

export function useTranslations(namespace: string) {
  const ns = getNamespace(namespace);

  const t = (key: string, params?: Record<string, string>): string => {
    const value = ns[key] ?? key;
    return typeof value === 'string' ? interpolate(value, params) : key;
  };

  t.has = (key: string): boolean => key in ns;

  return t;
}

export function NextIntlClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return children as React.ReactElement;
}

export function useLocale() {
  return 'en';
}

export function useMessages() {
  return enMessages;
}
