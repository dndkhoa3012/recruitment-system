import React from 'react';
import { View, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import JobForm from '@/components/JobForm';
import { createJob } from '@/services/api';
import { Colors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateJobScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const handleCreate = async (values: any) => {
        try {
            await createJob(values);
            Alert.alert(t('job_form.create_success_title'), t('job_form.create_success_message'), [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert(t('job_form.create_error_title'), t('job_form.create_error_message'));
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen options={{
                headerShown: true,
                header: () => (
                    <View style={{ backgroundColor: 'white', paddingTop: insets.top }}>
                        <ScreenHeader title={t('job_form.create_title')} showBack={true} centerTitle={true} />
                    </View>
                ),
            }} />
            <JobForm onSubmit={handleCreate} submitLabel={t('job_form.submit_create')} onCancel={() => router.back()} />
        </View>
    );
}
