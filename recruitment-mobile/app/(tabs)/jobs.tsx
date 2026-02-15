import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { getJobs } from '@/services/api';

export default function JobsScreen() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100"
            onPress={() => router.push(`/job/${item.id}`)}
        >
            <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{item.location} • {item.type}</Text>
            <View className="flex-row justify-between items-center mt-3">
                <Text className="text-blue-600 font-medium">{item.salary || 'Thỏa thuận'}</Text>
                <Text className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50 pt-12 px-4">
            <Text className="text-2xl font-bold mb-4 text-gray-900">Các vị trí đang tuyển</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={jobs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">Hiện chưa có công việc nào.</Text>}
                />
            )}
        </View>
    );
}
