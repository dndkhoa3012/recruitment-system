import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import JobForm from '@/components/JobForm';
import { getJobDetail, updateJob } from '@/services/api';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditJobScreen() {
    const { id } = useLocalSearchParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (id) {
            fetchJob();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            const data = await getJobDetail(id as string);
            setJob(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tải thông tin việc làm.');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values: any) => {
        try {
            await updateJob(id as string, values);
            Alert.alert('Thành công', 'Cập nhật việc làm thành công!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể cập nhật việc làm.');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenHeader title="Chỉnh sửa việc làm" showBack={true} />
            {
                job && (
                    <JobForm
                        initialValues={job}
                        onSubmit={handleUpdate}
                        submitLabel="Lưu"
                        onCancel={() => router.back()}
                    />
                )
            }
        </View >
    );
}
