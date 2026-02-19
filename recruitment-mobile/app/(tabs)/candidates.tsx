import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { getCandidates, deleteCandidate } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

import { CandidateCard } from '@/components/CandidateCard';
import { SwipeableItem } from '@/components/ui/SwipeableItem';

export default function CandidatesScreen() {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const router = useRouter();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const fetchCandidates = async () => {
        try {
            const data = await getCandidates();
            setCandidates(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCandidates();
        }, [])
    );

    const filteredCandidates = React.useMemo(() => {
        if (filterStatus === 'all') return candidates;
        return candidates.filter(c => c.status === filterStatus);
    }, [candidates, filterStatus]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCandidates();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa ứng viên này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCandidate(id);
                            setCandidates(prev => prev.filter(c => c.id !== id));
                            Alert.alert("Đã xóa", "Ứng viên đã được xóa thành công.");
                        } catch (e) {
                            Alert.alert("Lỗi", "Không thể xóa ứng viên.");
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
                onDelete={() => handleDelete(item.id)}
                onSwipeableOpen={() => onRowOpened(item.id.toString())}
            >
                <CandidateCard
                    candidate={item}
                    onPress={() => {
                        closeAnyOpenRow();
                        router.push(`/candidate/${item.id}`);
                    }}
                />
            </SwipeableItem>
        </View>
    );

    const renderHeader = () => (
        <View className="px-4 pb-4 bg-gray-50 pt-2" onStartShouldSetResponder={() => true} onResponderRelease={closeAnyOpenRow}>
            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 overflow-visible" onScrollBeginDrag={closeAnyOpenRow}>
                {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'pending', label: 'Chờ duyệt' },
                    { key: 'reviewing', label: 'Đang xem xét' },
                    { key: 'interviewed', label: 'Đã phỏng vấn' },
                    { key: 'accepted', label: 'Đã nhận' },
                    { key: 'rejected', label: 'Đã từ chối' }
                ].map((status) => (
                    <TouchableOpacity
                        key={status.key}
                        onPress={() => { closeAnyOpenRow(); setFilterStatus(status.key); }}
                        className={`px-4 py-1.5 rounded-full mr-2 ${filterStatus === status.key ? 'bg-orange-600' : 'bg-gray-200'}`}
                    >
                        <Text className={`text-sm font-medium ${filterStatus === status.key ? 'text-white' : 'text-gray-700'}`}>
                            {status.label} ({status.key === 'all' ? candidates.length : candidates.filter(c => c.status === status.key).length})
                        </Text>
                    </TouchableOpacity>
                ))}
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
                    data={filteredCandidates}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.tint} />}
                    ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">Chưa có ứng viên nào</Text>}
                    onScrollBeginDrag={closeAnyOpenRow}
                />
            )}
        </View>
    );
}
