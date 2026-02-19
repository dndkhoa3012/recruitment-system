import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { format } from 'date-fns';

interface CandidateCardProps {
    candidate: any;
    onPress: () => void;
}

export const CandidateCard = ({ candidate, onPress }: CandidateCardProps) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewing': return 'bg-blue-100 text-blue-800';
            case 'interviewed': return 'bg-purple-100 text-purple-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ duyệt';
            case 'reviewing': return 'Đang xem xét';
            case 'interviewed': return 'Đã phỏng vấn';
            case 'accepted': return 'Đã nhận';
            case 'rejected': return 'Đã từ chối';
            default: return status;
        }
    };

    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl border border-gray-100"
            onPress={onPress}
            activeOpacity={0.7}
            delayPressIn={100}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{candidate.fullName}</Text>
                    <Text className="text-sm text-gray-500" numberOfLines={1}>{candidate.job?.title || 'Unknown Job'}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${getStatusColor(candidate.status).split(' ')[0]}`}>
                    <Text className={`text-xs font-bold ${getStatusColor(candidate.status).split(' ')[1]}`}>
                        {getStatusText(candidate.status)}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center">
                    <MaterialIcons name="access-time" size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-400 ml-1">
                        {format(new Date(candidate.appliedAt), 'dd/MM/yyyy HH:mm')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
