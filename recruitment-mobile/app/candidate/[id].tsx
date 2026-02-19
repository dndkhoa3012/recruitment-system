import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getCandidateDetail, updateCandidate } from '@/services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { API_URL } from '@/constants/Config';

export default function CandidateDetailScreen() {
    const { id } = useLocalSearchParams();
    const [candidate, setCandidate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                if (id) {
                    const data = await getCandidateDetail(id as string);
                    setCandidate(data);
                }
            } catch (error) {
                console.error(error);
                Alert.alert("Lỗi", "Không thể tải thông tin ứng viên");
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        try {
            const updated = await updateCandidate(id as string, { status: newStatus });
            setCandidate(updated);
            Alert.alert("Thành công", "Đã cập nhật trạng thái ứng viên");
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
        } finally {
            setUpdating(false);
        }
    };

    const openLink = async (url: string) => {
        // Handle relative URLs by prepending the backend base URL
        let fullUrl = url;
        if (!url.startsWith('http')) {
            // API_URL is http://host:3000/api, we need http://host:3000
            const baseUrl = API_URL.replace('/api', '');
            // Ensure url starts with / if not present
            const path = url.startsWith('/') ? url : `/${url}`;
            fullUrl = `${baseUrl}${path}`;
        }

        if (await Linking.canOpenURL(fullUrl)) {
            await Linking.openURL(fullUrl);
        } else {
            Alert.alert("Lỗi", "Không thể mở liên kết này");
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                {/* 
                  IMPORTANT: headerShown: false is required here to prevent the default native header 
                  from flickering while data is loading. If removed, the layout will "jump" when content loads.
                */}
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#ea580c" />
            </View>
        );
    }

    if (!candidate) return <View className="flex-1 bg-white" />;

    return (
        /* 
          Using bg-white for the root container to match the header color, avoiding a visual "disconnect" 
          between the status bar area and the header during loading. The gray background is applied to the 
          ScrollView content instead.
        */
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenHeader title="Chi tiết Ứng viên" showBack={true} centerTitle={true} />

            <ScrollView className="flex-1 px-4 pt-4 bg-gray-50">
                {/* Header Info */}
                <View className="bg-white p-5 rounded-2xl border border-gray-100 mb-4">
                    <Text className="text-2xl font-bold text-gray-900 mb-1">{candidate.fullName}</Text>
                    <Text className="text-gray-500 mb-4">{candidate.job?.title}</Text>

                    <View className="flex-row gap-4 mb-4">
                        <TouchableOpacity
                            className="flex-1 bg-blue-50 py-3 rounded-xl flex-row justify-center items-center gap-2"
                            onPress={() => Linking.openURL(`tel:${candidate.phone}`)}
                        >
                            <MaterialIcons name="phone" size={20} color="#2563eb" />
                            <Text className="text-blue-600 font-medium">Gọi điện</Text>
                        </TouchableOpacity>

                    </View>

                    <View className="border-t border-gray-100 pt-4">
                        <View className="flex-row items-center mb-2">
                            <MaterialIcons name="phone" size={16} color="#6b7280" />
                            <Text className="text-gray-600 ml-2">{candidate.phone}</Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            <MaterialIcons name="email" size={16} color="#6b7280" />
                            <Text className="text-gray-600 ml-2">{candidate.email}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialIcons name="access-time" size={16} color="#6b7280" />
                            <Text className="text-gray-600 ml-2">
                                Ứng tuyển: {format(new Date(candidate.appliedAt), 'dd/MM/yyyy HH:mm')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Status Management */}
                <View className="bg-white p-5 rounded-2xl border border-gray-100 mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Trạng thái hồ sơ</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {[
                            { key: 'pending', label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                            { key: 'reviewing', label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                            { key: 'interviewed', label: 'Đã phỏng vấn', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                            { key: 'accepted', label: 'Đã nhận', color: 'bg-green-100 text-green-800 border-green-200' },
                            { key: 'rejected', label: 'Đã từ chối', color: 'bg-red-100 text-red-800 border-red-200' }
                        ].map((status) => (
                            <TouchableOpacity
                                key={status.key}
                                onPress={() => handleStatusUpdate(status.key)}
                                disabled={updating}
                                className={`px-4 py-2 rounded-full border ${candidate.status === status.key
                                    ? status.color.replace('text-', 'border-').split(' ')[2] + ' bg-opacity-100' // rudimentary active state logic
                                    : 'border-gray-200 bg-white'
                                    } ${updating ? 'opacity-50' : ''}`}
                                style={candidate.status === status.key ? { backgroundColor: getStatusColorHex(status.key) } : {}}
                            >
                                <Text className={`font-medium ${candidate.status === status.key ? 'text-white' : 'text-gray-600'
                                    }`}>
                                    {status.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Content */}
                <View className="bg-white p-5 rounded-2xl border border-gray-100 mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Hồ sơ & CV</Text>

                    {candidate.resume && (
                        <TouchableOpacity
                            className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 flex-row items-center"
                            onPress={() => openLink(candidate.resume)}
                        >
                            <View className="bg-red-100 p-2 rounded-lg mr-3">
                                <MaterialIcons name="description" size={24} color="#dc2626" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium text-gray-900">CV Ứng viên</Text>
                                <Text className="text-xs text-gray-500">Nhấn để xem</Text>
                            </View>
                            <MaterialIcons name="open-in-new" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    )}

                    {candidate.coverLetter && (
                        <View>
                            <Text className="font-semibold text-gray-700 mb-2">Thư xin việc:</Text>
                            <Text className="text-gray-600 leading-6">{candidate.coverLetter}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

function getStatusColorHex(status: string) {
    switch (status) {
        case 'pending': return '#eab308';
        case 'reviewing': return '#3b82f6';
        case 'interviewed': return '#a855f7';
        case 'accepted': return '#22c55e';
        case 'rejected': return '#ef4444';
        default: return '#6b7280';
    }
}
