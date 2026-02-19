import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import JobForm from '@/components/JobForm';
import { createJob } from '@/services/api';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateJobScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const handleCreate = async (values: any) => {
        try {
            await createJob(values);
            Alert.alert('Thành công', 'Đã tạo việc làm mới thành công!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tạo việc làm. Vui lòng thử lại.');
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{
                headerShown: true,
                header: () => (
                    <View style={{ backgroundColor: 'white', paddingTop: insets.top }}>
                        <ScreenHeader title="Tạo việc làm mới" showBack={true} centerTitle={true} />
                    </View>
                ),
            }} />

            {/* Native Header handles safe area and back button logic */}
            <JobForm onSubmit={handleCreate} submitLabel="Tạo mới" onCancel={() => router.back()} />
        </View >
    );
}
