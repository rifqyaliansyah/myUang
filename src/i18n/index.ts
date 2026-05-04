import { createI18n } from 'vue-i18n'
import en from './locales/en'
import id from './locales/id'

const savedLocale = localStorage.getItem('lang') || 'en'

export const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages: { en, id }
})