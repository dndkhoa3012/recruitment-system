import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function CandidatesScreen() {
    const { t } = useTranslation();

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold">{t('menu.candidates')}</Text>
            <Text className="text-gray-500 mt-2">Chức năng đang được phát triển</Text>
        </View>
    );
}
