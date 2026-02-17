import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getJobDetail } from '../../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function JobDetailScreen() {
    const { viewid } = useLocalSearchParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    useEffect(() => {
        if (viewid) {
            getJobDetail(viewid as string)
                .then(data => setJob(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [viewid]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    if (!job) {
        return (
            <View className="flex-1 justify-center items-center bg-white" style={{ paddingTop: insets.top }}>
                <Stack.Screen options={{ headerShown: false }} />
                <ScreenHeader title="Chi tiết việc làm" showBack={true} />
                <Text className="mt-10 text-gray-500">Không tìm thấy việc làm</Text>
            </View>
        );
    }

    // Helper to render Description
    const renderDescription = (descString: string) => {
        try {
            const data = JSON.parse(descString);
            if (typeof data === 'string') return <Text className="text-gray-700 leading-6 mb-2">{data}</Text>;

            return (
                <View>
                    {data.intro && <Text className="text-gray-700 leading-6 mb-2">{data.intro}</Text>}
                    {data.points && Array.isArray(data.points) && data.points.map((point: string, index: number) => (
                        <View key={index} className="flex-row items-start mb-2">
                            <MaterialIcons name="check-circle" size={20} color="#0ea5e9" style={{ marginTop: 2, marginRight: 8 }} />
                            <Text className="text-gray-700 flex-1 leading-6">{point}</Text>
                        </View>
                    ))}
                </View>
            );
        } catch (e) {
            return <Text className="text-gray-700 leading-6">{descString}</Text>;
        }
    };

    // Helper to render Requirements
    const renderRequirements = (reqString: string) => {
        try {
            const data = JSON.parse(reqString);
            if (Array.isArray(data)) {
                return (
                    <View>
                        {data.map((req: string, index: number) => (
                            <View key={index} className="flex-row items-start mb-2">
                                <MaterialIcons name="star" size={20} color="#0ea5e9" style={{ marginTop: 2, marginRight: 8 }} />
                                <Text className="text-gray-700 flex-1 leading-6">{req}</Text>
                            </View>
                        ))}
                    </View>
                );
            }
            return <Text className="text-gray-700 leading-6">{reqString}</Text>;
        } catch (e) {
            return <Text className="text-gray-700 leading-6">{reqString}</Text>;
        }
    };

    // Helper to render Benefits
    const renderBenefits = (benString: string) => {
        try {
            const data = JSON.parse(benString);
            if (Array.isArray(data)) {
                // Map common web/admin icon names (English & Vietnamese) to Mobile MaterialIcons
                const benefitIconMap: { [key: string]: string } = {
                    // English keys
                    'money': 'attach-money',
                    'salary': 'attach-money',
                    'bonus': 'attach-money',
                    'allowance': 'attach-money',
                    'dollar': 'attach-money',
                    'health': 'local-hospital',
                    'insurance': 'local-hospital',
                    'medical': 'local-hospital',
                    'hospital': 'local-hospital',
                    'training': 'menu-book',
                    'education': 'school',
                    'school': 'school',
                    'book': 'menu-book',
                    'books': 'menu-book',
                    'study': 'menu-book',
                    'travel': 'flight',
                    'flight': 'flight',
                    'plane': 'flight',
                    'tourism': 'flight',
                    'vacation': 'flight',
                    'time': 'access-time',
                    'clock': 'access-time',
                    'flexible': 'access-time',
                    'flexible-time': 'access-time',
                    'parking': 'local-parking',
                    'car': 'local-parking',
                    'bike': 'local-parking',
                    'game': 'sports-esports',
                    'entertainment': 'sports-esports',
                    'fun': 'sports-esports',
                    'relax': 'sports-esports',
                    'other': 'favorite',
                    'heart': 'favorite',
                    'love': 'favorite',
                    'welfare': 'favorite',
                    'benefit': 'favorite',

                    // Vietnamese keys (in case backend sends labels)
                    'thuong/luong': 'attach-money',
                    'thưởng/lương': 'attach-money',
                    'luong': 'attach-money',
                    'thuong': 'attach-money',
                    'bao hiem': 'local-hospital',
                    'bảo hiểm': 'local-hospital',
                    'dao tao': 'menu-book',
                    'đào tạo': 'menu-book',
                    'du lich': 'flight',
                    'du lịch': 'flight',
                    'gio lam linh hoat': 'access-time',
                    'giờ làm linh hoạt': 'access-time',
                    'cho dau xe': 'local-parking',
                    'chỗ đậu xe': 'local-parking',
                    'giai tri': 'sports-esports',
                    'giải trí': 'sports-esports',
                    'phuc loi khac': 'favorite',
                    'phúc lợi khác': 'favorite',
                    'nha o': 'home',
                    'nhà ở': 'home'
                };

                return (
                    <View className="flex-row flex-wrap gap-2">
                        {data.map((ben: any, index: number) => {
                            // Normalize the icon key from backend
                            let iconKey = (ben.icon || '').toLowerCase().trim();
                            // Also try removing special chars for matching
                            let iconKeyClean = iconKey.replace(/[^a-zA-Z0-9\s]/g, '');

                            // Lookup in map: exact match -> clean match -> fallback to original
                            let iconName = benefitIconMap[iconKey] || benefitIconMap[iconKeyClean] || ben.icon;

                            // Visual fix for specific common mismatches if map didn't catch it
                            if (iconName === 'star') {
                                // Double check against text if icon is just generic 'star'
                                const text = (ben.text || '').toLowerCase();
                                if (text.includes('lương') || text.includes('thưởng')) iconName = 'attach-money';
                                else if (text.includes('bảo hiểm')) iconName = 'local-hospital';
                                else if (text.includes('đào tạo')) iconName = 'menu-book';
                                else if (text.includes('du lịch')) iconName = 'flight';
                                else if (text.includes('xe')) iconName = 'local-parking';
                                else iconName = 'check-circle';
                            }

                            // Default fallback if still invalid/empty
                            if (!iconName) iconName = 'check-circle';

                            return (
                                <View key={index} className="bg-orange-50 px-3 py-2 rounded-lg flex-row items-center border border-orange-100 self-start">
                                    <MaterialIcons name={iconName as any} size={18} color={Colors.light.tint} style={{ marginRight: 6 }} />
                                    <Text className="text-orange-900 font-medium">{ben.text}</Text>
                                </View>
                            );
                        })}
                    </View>
                );
            }
            return <Text className="text-gray-700 leading-6">{benString}</Text>;
        } catch (e) {
            return <Text className="text-gray-700 leading-6">{benString}</Text>;
        }
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenHeader title={job.title} showBack={true} />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <View className="mb-6">
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            <Text className="text-blue-700 text-xs font-semibold">{t(`job_type.${job.type}`, { defaultValue: job.type })}</Text>
                        </View>
                        <View className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <Text className="text-green-700 text-xs font-semibold">{job.location}</Text>
                        </View>
                        {job.category && (
                            <View className="bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                                <Text className="text-purple-700 text-xs font-semibold">{job.category?.name || job.category}</Text>
                            </View>
                        )}
                        {job.quantity && (
                            <View className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                <Text className="text-gray-600 text-xs font-semibold">Số lượng: {job.quantity}</Text>
                            </View>
                        )}
                    </View>

                    <View className="flex-row gap-6 mb-4">
                        <View className="flex-row items-center">
                            <MaterialIcons name="attach-money" size={20} color={Colors.light.tint} />
                            <Text className="text-gray-700 ml-1 font-medium">{job.salary || 'Thỏa thuận'}</Text>
                        </View>
                        {job.deadline && (
                            <View className="flex-row items-center">
                                <MaterialIcons name="event" size={20} color={Colors.light.tint} />
                                <Text className="text-gray-700 ml-1 font-medium">Hạn nộp: {new Date(job.deadline).toLocaleDateString()}</Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-gray-500 text-sm">
                        Đăng ngày: {new Date(job.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                <View className="space-y-6 pb-10">
                    <View>
                        <Text className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-orange-500 pl-3">
                            {t('job_detail.description')}
                        </Text>
                        {renderDescription(job.description)}
                    </View>

                    <View>
                        <Text className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-orange-500 pl-3">
                            {t('job_detail.requirements')}
                        </Text>
                        {renderRequirements(job.requirements)}
                    </View>

                    <View>
                        <Text className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-orange-500 pl-3">
                            {t('job_detail.benefits')}
                        </Text>
                        {renderBenefits(job.benefits)}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
