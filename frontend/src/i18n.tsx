"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from '../messages/en.json';
import ur from '../messages/ur.json';

type Locale = 'en' | 'ur';
type Messages = typeof en;

interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

const messagesMap = { en, ur };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (keyPath: string) => {
    const keys = keyPath.split('.');
    let current: any = messagesMap[locale];
    for (const key of keys) {
      if (current[key] === undefined) return keyPath;
      current = current[key];
    }
    return current;
  };

  const isRTL = locale === 'ur';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
