import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './locales/en.json';
import translationVi from './locales/vi.json';

const resources = {
    en: { translation: translationEn },
    vi: { translation: translationVi },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem('language');

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode;
    }

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage || 'vi',
            fallbackLng: 'vi',
            interpolation: {
                escapeValue: false,
            },
        });
};

initI18n();

export default i18n;
