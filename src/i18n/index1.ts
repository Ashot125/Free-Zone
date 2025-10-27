// src/i18n/index.ts
import { createI18n } from 'vue-i18n';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import am from '../locales/am.json';

export const messages = {
  en,
  ru,
  am,
};

export const DEFAULT_LOCALE = 'en'; // by default

export const i18n = createI18n({
  legacy: false, //we use Composition API
  globalInjection: true, // allows you to use $t в Options API
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  messages,
});

// helper type (is used further in augmentation)
export type MessageSchema = typeof en;
// Add to the end of the filesrc/i18n/index.ts

export function setupI18n() {
  const saved = localStorage.getItem('locale');
  const navLang = navigator.language.split('-')[0];
  const startLocale = (saved || navLang || DEFAULT_LOCALE) as keyof typeof messages;

  if (!Object.keys(messages).includes(startLocale)) {
    i18n.global.locale.value = DEFAULT_LOCALE;
  } else {
    i18n.global.locale.value = startLocale;
  }
}

export function setLocale(lang: string) {
  if (!Object.keys(messages).includes(lang)) return;
  i18n.global.locale.value = lang as 'en' | 'ru' | 'am'

  localStorage.setItem('locale', lang);
}
