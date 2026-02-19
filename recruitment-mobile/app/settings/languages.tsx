import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
    { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt' },
    { code: 'en', name: 'English', nativeName: 'English' },
];

export default function LanguagesScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();

    const handleLanguageChange = async (langCode: string) => {
        await AsyncStorage.setItem('language', langCode);
        i18n.changeLanguage(langCode);
        router.back();
    };

    const renderItem = ({ item }: { item: typeof LANGUAGES[0] }) => {
        const isSelected = i18n.language === item.code;
        return (
            <TouchableOpacity
                className={`flex-row items-center justify-between p-4 bg-white border-b border-gray-100 ${isSelected ? 'bg-orange-50' : ''}`}
                onPress={() => handleLanguageChange(item.code)}
            >
                <View className="flex-row items-center gap-3">
                    <Text className={`text-base ${isSelected ? 'font-bold text-orange-600' : 'text-gray-900'}`}>
                        {item.nativeName}
                    </Text>
                    {item.name !== item.nativeName && (
                        <Text className="text-sm text-gray-500">({item.name})</Text>
                    )}
                </View>
                {isSelected && (
                    <MaterialIcons name="check" size={24} color={Colors.light.tint} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />
            <View style={{ backgroundColor: 'white', paddingTop: insets.top }}>
                <ScreenHeader
                    title={t('settings.language') || "Ngôn ngữ"}
                    showBack={true}
                    centerTitle={true}
                />
            </View>
            <View className="mt-4 bg-white border-y border-gray-200">
                <FlatList
                    data={LANGUAGES}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.code}
                />
            </View>
        </View>
    );
}
