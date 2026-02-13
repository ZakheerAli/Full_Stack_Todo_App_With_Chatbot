"use client";

import React from 'react';
import { useI18n } from '../../i18n';
import { Button } from '../ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ur' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span>{locale === 'en' ? 'اردو' : 'English'}</span>
    </Button>
  );
}