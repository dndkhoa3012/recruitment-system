import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <View className="items-center mb-10">
        <Image
          source={require('@/assets/images/react-logo.png')} // Fallback image, replace with user logo if available
          className="w-32 h-32 mb-4"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-center text-gray-900">{t('home.title')}</Text>
        <Text className="text-center text-gray-500 mt-2 px-4">
          {t('home.subtitle')}
        </Text>
      </View>

      <TouchableOpacity
        className="bg-blue-600 w-full py-4 rounded-xl shadow-lg active:bg-blue-700"
        onPress={() => router.push('/jobs')}
      >
        <Text className="text-white text-center font-bold text-lg">{t('home.explore_button')}</Text>
      </TouchableOpacity>

      <View className="absolute bottom-10">
        <Text className="text-xs text-gray-400">© 2026 John's Tours PQ</Text>
      </View>
    </View>
  );
}
