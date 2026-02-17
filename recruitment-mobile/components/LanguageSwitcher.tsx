import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const changeLanguage = async (lang: string) => {
        await AsyncStorage.setItem('language', lang);
        i18n.changeLanguage(lang);
    };

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }]}>
            <TouchableOpacity
                onPress={() => changeLanguage('vi')}
                style={[
                    styles.button,
                    i18n.language === 'vi' && { backgroundColor: theme.tint }
                ]}
            >
                <Text style={[
                    styles.text,
                    { color: i18n.language === 'vi' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#000') }
                ]}>VN</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => changeLanguage('en')}
                style={[
                    styles.button,
                    i18n.language === 'en' && { backgroundColor: theme.tint }
                ]}
            >
                <Text style={[
                    styles.text,
                    { color: i18n.language === 'en' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#000') }
                ]}>EN</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 4,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 12,
    },
});
