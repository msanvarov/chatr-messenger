import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import * as germanTranslation from './gr/translation.json';
import * as italianTranslation from './it/translation.json';
import * as russianTranslation from './ru/translation.json';
import * as englishTranslation from './en/translation.json';

// translations
const resources = {
  gr: {
    translation: germanTranslation,
  },
  it: {
    translation: italianTranslation,
  },
  ru: {
    translation: russianTranslation,
  },
  eng: {
    translation: englishTranslation,
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
