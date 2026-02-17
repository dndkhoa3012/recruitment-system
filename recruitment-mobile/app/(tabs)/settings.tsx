import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const MENU_ITEMS = [
        {
            id: 'management',
            title: 'Quản lý',
            items: [
                {
                    id: 'categories',
                    icon: 'category',
                    label: 'Danh mục công việc',
                    route: '/settings/categories',
                    color: '#f97316' // orange-500
                }
            ]
        },
        {
            id: 'app',
            title: 'Ứng dụng',
            items: [
                {
                    id: 'language',
                    icon: 'language',
                    label: 'Ngôn ngữ',
                    route: '/settings/languages', // Navigate to new screen
                    color: '#10b981' // emerald-500
                },
                {
                    id: 'notifications',
                    icon: 'notifications',
                    label: 'Thông báo',
                    action: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
                    color: '#8b5cf6' // violet-500
                }
            ]
        },
        {
            id: 'account',
            title: 'Tài khoản',
            items: [
                {
                    id: 'logout',
                    icon: 'logout',
                    label: 'Đăng xuất',
                    action: () => Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
                        { text: 'Hủy', style: 'cancel' },
                        { text: 'Đăng xuất', style: 'destructive' }
                    ]),
                    color: '#ef4444' // red-500
                }
            ]
        }
    ];

    const handlePress = (item: any) => {
        if (item.route) {
            router.push(item.route);
        } else if (item.action) {
            item.action();
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                {MENU_ITEMS.map((section) => (
                    <View key={section.id} className="mb-6 mt-6">
                        <Text className="px-4 mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            {section.title}
                        </Text>
                        <View className="bg-white border-y border-gray-200">
                            {section.items.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    className={`flex-row items-center px-4 py-4 active:bg-gray-50 ${index !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    onPress={() => handlePress(item)}
                                >
                                    <View className="w-8 h-8 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: `${item.color}20` }}>
                                        <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                                    </View>
                                    <Text className="flex-1 text-base font-medium text-gray-900">
                                        {item.label}
                                    </Text>
                                    <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <View className="items-center py-6">
                    <Text className="text-gray-400 text-xs">Version 1.0.0 (Build 20260216)</Text>
                </View>
            </ScrollView>
        </View>
    );
}
