import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, Alert, TouchableOpacity, Pressable } from 'react-native';
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
            return () => {
                if (prevOpenedRow.current) {
                    prevOpenedRow.current.close();
                    prevOpenedRow.current = null;
                }
            };
        }, [])
    );

    // Compute effective status considering deadline
    const getEffectiveStatus = (job: any) => {
        if (job.status === 'active' && job.deadline && new Date(job.deadline) < new Date()) {
            return 'closed';
        }
        return job.status;
    };

    const filteredJobs = React.useMemo(() => {
        if (filterStatus === 'all') return jobs;
        if (filterStatus === 'active') return jobs.filter(j => getEffectiveStatus(j) === 'active');
        return jobs.filter(j => getEffectiveStatus(j) !== 'active');
    }, [jobs, filterStatus]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            t('jobs.delete_confirm_title'),
            t('jobs.delete_confirm_message'),
            [
                { text: t('jobs.cancel'), style: 'cancel' },
                {
                    text: t('jobs.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteJob(id);
                            setJobs(prev => prev.filter(job => job.id !== id));
                            Alert.alert(t('jobs.delete_success'), t('jobs.delete_success_message'));
                        } catch (e) {
                            Alert.alert(t('jobs.delete_error'), t('jobs.delete_error_message'));
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
                <Pressable
                    style={{
                        backgroundColor: '#ffffff',
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#f3f4f6',
                    }}
                    onPress={() => {
                        closeAnyOpenRow();
                        router.push(`/job/${item.id}`);
                    }}
                >
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1 mr-2">
                            <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.title}</Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${getEffectiveStatus(item) === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Text className={`text-xs font-bold ${getEffectiveStatus(item) === 'active' ? 'text-green-700' : 'text-gray-700'}`}>
                                {getEffectiveStatus(item) === 'active' ? t('jobs.status_active') : t('jobs.status_closed')}
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
                </Pressable>
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
                <Text className="text-white font-bold text-lg">{t('jobs.create_new')}</Text>
            </TouchableOpacity>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 overflow-visible" onScrollBeginDrag={closeAnyOpenRow}>
                <TouchableOpacity
                    onPress={() => { closeAnyOpenRow(); setFilterStatus('all'); }}
                    className={`px-4 py-1.5 rounded-full mr-2 ${filterStatus === 'all' ? 'bg-orange-600' : 'bg-gray-200'}`}
                >
                    <Text className={`text-sm font-medium ${filterStatus === 'all' ? 'text-white' : 'text-gray-700'}`}>
                        {t('jobs.filter_all')} ({jobs.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { closeAnyOpenRow(); setFilterStatus('active'); }}
                    className={`px-4 py-1.5 rounded-full mr-2 ${filterStatus === 'active' ? 'bg-orange-600' : 'bg-gray-200'}`}
                >
                    <Text className={`text-sm font-medium ${filterStatus === 'active' ? 'text-white' : 'text-gray-700'}`}>
                        {t('jobs.filter_active')} ({jobs.filter(j => getEffectiveStatus(j) === 'active').length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { closeAnyOpenRow(); setFilterStatus('closed'); }}
                    className={`px-4 py-1.5 rounded-full mr-2 ${filterStatus === 'closed' ? 'bg-orange-600' : 'bg-gray-200'}`}
                >
                    <Text className={`text-sm font-medium ${filterStatus === 'closed' ? 'text-white' : 'text-gray-700'}`}>
                        {t('jobs.filter_closed')} ({jobs.filter(j => getEffectiveStatus(j) !== 'active').length})
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
                />
            )}
        </View>
    );
}
