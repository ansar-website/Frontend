import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import arTranslation from "../locale/ar/translation.json";

const resources = {
  ar: {
    translation: arTranslation,
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    supportedLngs: ["ar"],
    fallbackLng: { default: ["ar"] },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });
export default i18next;
