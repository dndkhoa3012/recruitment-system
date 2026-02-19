import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardCardProps {
    title: string;
    count: string | number;
    subtitle?: string;
    subtitleColor?: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    iconColor?: string; // Hex color or tailwind class text color if passing classname (but here we use inline style or class for text)
    iconBgColor?: string; // Tailwind class for background
}

export function DashboardCard({
    title,
    count,
    subtitle,
    subtitleColor = 'text-gray-500',
    icon,
    iconColor = '#3b82f6', // blue-500 default
    iconBgColor = 'bg-blue-50'
}: DashboardCardProps) {
    return (
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4 border border-gray-100">
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="text-gray-500 font-medium mb-1">{title}</Text>
                    <Text className="text-3xl font-bold text-gray-900 mb-1">{count}</Text>
                    {subtitle && (
                        <Text className={`text-xs ${subtitleColor} font-medium`}>{subtitle}</Text>
                    )}
                </View>
                <View className={`p-3 rounded-xl ${iconBgColor}`}>
                    <MaterialIcons name={icon} size={24} color={iconColor} />
                </View>
            </View>
        </View>
    );
}
