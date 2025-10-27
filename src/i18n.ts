import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'
import am from './locales/am.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages: { en, ru, am }
})

export const setLanguage = (lang: string) => {
  i18n.global.locale.value = lang
  localStorage.setItem('lang', lang)
}
