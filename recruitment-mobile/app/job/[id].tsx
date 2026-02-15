import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getJobDetail } from '../../services/api';

export default function JobDetailScreen() {
    const { id } = useLocalSearchParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            getJobDetail(id as string)
                .then(data => setJob(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    if (!job) {
        return <View className="flex-1 justify-center items-center"><Text>Job not found</Text></View>;
    }

    return (
        <>
            <Stack.Screen options={{ title: job.title, headerBackTitle: 'Jobs' }} />
            <View className="flex-1 bg-white relative">
                <ScrollView className="flex-1 px-4 py-4 mb-20">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">{job.title}</Text>
                    <View className="flex-row gap-2 mb-4">
                        <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs overflow-hidden">{job.type}</Text>
                        <Text className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs overflow-hidden">{job.location}</Text>
                    </View>

                    <Text className="text-gray-500 mb-6">Published on: {new Date(job.createdAt).toLocaleDateString()}</Text>

                    <Text className="text-lg font-bold mb-2">Mô tả công việc</Text>
                    <Text className="text-gray-700 leading-6 mb-6">{job.description}</Text>

                    <Text className="text-lg font-bold mb-2">Yêu cầu</Text>
                    <Text className="text-gray-700 leading-6 mb-6">{job.requirements}</Text>

                    <Text className="text-lg font-bold mb-2">Quyền lợi</Text>
                    <Text className="text-gray-700 leading-6 mb-6">{job.benefits}</Text>
                </ScrollView>

                <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                    <TouchableOpacity
                        className="bg-blue-600 py-3 rounded-lg flex items-center justify-center"
                        onPress={() => router.push(`/apply/${job.id}`)}
                    >
                        <Text className="text-white font-bold text-lg">Ứng tuyển ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}
