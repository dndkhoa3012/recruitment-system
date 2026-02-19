import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { getJobs, deleteJob, getCandidates } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

import { SwipeableItem } from '@/components/ui/SwipeableItem';

export default function JobsScreen() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
    const router = useRouter();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const fetchJobs = async () => {
        try {
            const jobsData = await getJobs();
            // Fetch candidate counts for each job
            // Note: In a real app, this should be included in the getJobs API response to avoid N+1 queries
            const jobsWithCounts = await Promise.all(jobsData.map(async (job: any) => {
                try {
                    const candidates = await getCandidates({ jobId: job.id });
                    return { ...job, candidateCount: candidates.length };
                } catch (e) {
                    console.warn(`Failed to fetch candidates for job ${job.id}`, e);
                    return { ...job, candidateCount: 0 };
                }
            }));
            setJobs(jobsWithCounts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchJobs();
        }, [])
    );

    const filteredJobs = React.useMemo(() => {
        if (filterStatus === 'all') return jobs;
        if (filterStatus === 'active') return jobs.filter(j => j.status === 'active');
        return jobs.filter(j => j.status !== 'active');
    }, [jobs, filterStatus]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa việc làm này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteJob(id);
                            // Optimistic update or refresh
                            setJobs(prev => prev.filter(job => job.id !== id));
                            Alert.alert("Đã xóa", "Việc làm đã được xóa thành công.");
                        } catch (e) {
                            Alert.alert("Lỗi", "Không thể xóa việc làm.");
                            console.error(e);
                        }
                    }
                }
            ]
        );
    };

    // Track refs for swipeable rows
    const rowRefs = React.useRef<Map<string, any>>(new Map());
    const prevOpenedRow = React.useRef<any>(null);

    const closeAnyOpenRow = () => {
        if (prevOpenedRow.current) {
            prevOpenedRow.current.close();
            prevOpenedRow.current = null;
        }
    };

    const onRowOpened = (key: string) => {
        if (prevOpenedRow.current && prevOpenedRow.current !== rowRefs.current.get(key)) {
            prevOpenedRow.current.close();
        }
        prevOpenedRow.current = rowRefs.current.get(key);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="mx-4 mb-4">
            <SwipeableItem
                ref={(ref) => {
                    if (ref) {
                        rowRefs.current.set(item.id.toString(), ref);
                    } else {
                        rowRefs.current.delete(item.id.toString());
                    }
                }}
                onEdit={() => router.push(`/job/edit/${item.id}`)}
                onDelete={() => handleDelete(item.id)}
                onSwipeableOpen={() => onRowOpened(item.id.toString())}
            >
                <TouchableOpacity
                    className="bg-white p-4 rounded-xl border border-gray-100 relative"
                    onPress={() => {
                        closeAnyOpenRow();
                        router.push(`/job/${item.id}`);
                    }}
                    activeOpacity={0.7}
                    delayPressIn={100}
                >
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1 mr-2">
                            <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.title}</Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${item.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Text className={`text-xs font-bold ${item.status === 'active' ? 'text-green-700' : 'text-gray-700'}`}>
                                {item.status === 'active' ? 'Đang tuyển' : 'Đã đóng'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row">
                        <View className="flex-1 flex-row flex-wrap">
                            <View className="w-full flex-row items-center mb-2 pr-2">
                                <MaterialIcons name="corporate-fare" size={16} color="#64748b" />
                                <Text className="text-sm text-gray-500 ml-2" numberOfLines={1}>{item.category?.name || 'Nhân sự'}</Text>
                            </View>
                            <View className="w-full flex-row items-center mb-2 pr-2">
                                <MaterialIcons name="location-on" size={16} color="#64748b" />
                                <Text className="text-sm text-gray-500 ml-2" numberOfLines={1}>{item.location}</Text>
                            </View>
                            <View className="w-full flex-row items-center mb-2 pr-2">
                                <MaterialIcons name="schedule" size={16} color="#64748b" />
                                <Text className="text-sm text-gray-500 ml-2" numberOfLines={1}>{t(`job_type.${item.type}`, { defaultValue: item.type })}</Text>
                            </View>
                            <View className="w-full flex-row items-center mb-2 pr-2">
                                <MaterialIcons name="payments" size={16} color="#64748b" />
                                <Text className="text-sm text-gray-500 ml-2" numberOfLines={1}>{item.salary || 'Thỏa thuận'}</Text>
                            </View>
                        </View>

                        {/* Candidate Count Badge (Right Side) */}
                        <View className="justify-end items-end pb-2 pl-2">
                            <View className="bg-blue-50 px-3 py-2 rounded-lg items-center justify-center border border-blue-100">
                                <MaterialIcons name="description" size={24} color="#3b82f6" />
                                <Text className="text-blue-700 font-bold text-sm mt-1">{item.candidateCount || 0}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </SwipeableItem>
        </View>
    );

    const renderHeader = () => (
        <View className="px-4 pb-4 bg-gray-50 pt-2" onStartShouldSetResponder={() => true} onResponderRelease={closeAnyOpenRow}>
            {/* Create Button */}
            <TouchableOpacity
                className="w-full bg-orange-600 py-4 px-6 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-orange-200 mb-6"
                onPress={() => {
                    closeAnyOpenRow();
                    router.push('/job/create');
                }}
            >
                <MaterialIcons name="add-circle" size={24} color="white" />
                <Text className="text-white font-bold text-lg">Tạo việc làm mới</Text>
            </TouchableOpacity>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 overflow-visible" onScrollBeginDrag={closeAnyOpenRow}>
                <TouchableOpacity
                    onPress={() => { closeAnyOpenRow(); setFilterStatus('all'); }}
                    className={`px-4 py-1.5 rounded-full mr-2 ${filterStatus === 'all' ? 'bg-orange-600' : 'bg-gray-200'}`}
                >
                    <Text className={`text-sm font-medium ${filterStatus === 'all' ? 'text-white' : 'text-gray-700'}`}>
                        Tất cả ({jobs.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { closeAnyOpenRow(); setFilterStatus('active'); }}
                    className={`px-4 py-1.5 rounded-full mr-2 ${filterStatus === 'active' ? 'bg-orange-600' : 'bg-gray-200'}`}
                >
                    <Text className={`text-sm font-medium ${filterStatus === 'active' ? 'text-white' : 'text-gray-700'}`}>
                        Đang tuyển ({jobs.filter(j => j.status === 'active').length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { closeAnyOpenRow(); setFilterStatus('closed'); }}
                    className={`px-4 py-1.5 rounded-full mr-2 ${filterStatus === 'closed' ? 'bg-orange-600' : 'bg-gray-200'}`}
                >
                    <Text className={`text-sm font-medium ${filterStatus === 'closed' ? 'text-white' : 'text-gray-700'}`}>
                        Đã đóng ({jobs.filter(j => j.status !== 'active').length})
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* <Stack.Screen options={{ headerShown: false }} /> removed to use native header */}

            {/* Custom header removed to match Overview page style */}

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={Colors.light.tint} />
                </View>
            ) : (
                <FlatList
                    data={filteredJobs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.tint} />}
                    ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">{t('jobs.no_jobs')}</Text>}
                    onScrollBeginDrag={closeAnyOpenRow}
                />
            )}
        </View>
    );
}
