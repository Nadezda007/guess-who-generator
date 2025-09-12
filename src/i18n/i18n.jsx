import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";
import zhTranslation from "./locales/zh.json";
import { availableLanguages } from './availableLanguages';

// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation(); // connect i18next
// {t('guess_who_card_generator')}

const resources = {
  en: { translation: enTranslation },
  ru: { translation: ruTranslation },
  zh: { translation: zhTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // Connecting react-i18next
  .init({
    resources,
    // debug: true,
    fallbackLng: "en", // If the language is not found, we use English
    supportedLngs: availableLanguages.map(lang => lang.code),
  });

export default i18n;
