'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import es from './es.json';
import en from './en.json';

type Language = 'es' | 'en';
type Dictionary = typeof es;

interface LanguageContextType {
  language: Language;
  dict: Dictionary;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es'); // Default to Spanish
  const [dict, setDict] = useState<Dictionary>(es);

  useEffect(() => {
    // Detection logic (Option 3)
    const browserLang = navigator.language.split('-')[0];
    const detectedLang: Language = browserLang === 'en' ? 'en' : 'es';
    
    setLanguage(detectedLang);
    setDict(detectedLang === 'en' ? en : es);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setDict(lang === 'en' ? en : es);
  };

  return (
    <LanguageContext.Provider value={{ language, dict, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
