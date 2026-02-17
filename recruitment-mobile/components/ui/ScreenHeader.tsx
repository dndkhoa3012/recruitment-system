import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

interface ScreenHeaderProps {
    title: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    showBack?: boolean;
    onSearch?: () => void;
    centerTitle?: boolean;
}

export function ScreenHeader({ title, icon, showBack = false, onSearch, centerTitle = false }: ScreenHeaderProps) {
    const router = useRouter();

    if (centerTitle) {
        return (
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-50 h-[60px]">
                <View className="flex-row items-center z-10">
                    {showBack && (
                        <TouchableOpacity onPress={() => router.back()} className="mr-1">
                            <MaterialIcons name="chevron-left" size={32} color={Colors.light.tint} />
                        </TouchableOpacity>
                    )}
                    {icon && (
                        <View className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center ml-2">
                            <MaterialIcons name={icon} size={24} color={Colors.light.tint} />
                        </View>
                    )}
                </View>

                <View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center pointer-events-none">
                    <Text className="text-xl font-bold tracking-tight text-gray-900">{title}</Text>
                </View>

                <View className="flex-row items-center z-10">
                    {onSearch && (
                        <TouchableOpacity
                            className="w-10 h-10 flex items-center justify-center rounded-full"
                            onPress={onSearch}
                        >
                            <MaterialIcons name="search" size={24} color="#64748b" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
            <View className="flex-row items-center gap-3">
                {showBack && (
                    <TouchableOpacity onPress={() => router.back()} className="mr-1">
                        <MaterialIcons name="chevron-left" size={32} color={Colors.light.tint} />
                    </TouchableOpacity>
                )}
                {icon && (
                    <View className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <MaterialIcons name={icon} size={24} color={Colors.light.tint} />
                    </View>
                )}
                <Text className="text-xl font-bold tracking-tight text-gray-900">{title}</Text>
            </View>
            {onSearch && (
                <TouchableOpacity
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                    onPress={onSearch}
                >
                    <MaterialIcons name="search" size={24} color="#64748b" />
                </TouchableOpacity>
            )}
        </View>
    );
}
