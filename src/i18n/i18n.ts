import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import * as german from './de/translation.json';
import * as english from './en/translation.json';
import * as italian from './it/translation.json';
import * as russian from './ru/translation.json';

// translations
const resources = {
  en: {
    translation: english,
  },
  de: {
    translation: german,
  },
  it: {
    translation: italian,
  },
  ru: {
    translation: russian,
  },
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
