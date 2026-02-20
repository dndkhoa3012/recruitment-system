import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import JobForm from '@/components/JobForm';
import { getJobDetail, updateJob } from '@/services/api';
import { Colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditJobScreen() {
    const { id } = useLocalSearchParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { t } = useTranslation();
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
            Alert.alert(t('job_form.edit_error_title'), t('job_form.load_error_message'));
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values: any) => {
        try {
            await updateJob(id as string, values);
            Alert.alert(t('job_form.edit_success_title'), t('job_form.edit_success_message'), [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Update Job Error:', error);
            if (error.response) {
                Alert.alert(t('job_form.edit_error_title'), `${t('job_form.edit_error_message')}\n${JSON.stringify(error.response.data)}`);
            } else {
                Alert.alert(t('job_form.edit_error_title'), `${t('job_form.edit_error_message')}\n${error.message}`);
            }
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
        <View className="flex-1 bg-white">
            <Stack.Screen options={{
                headerShown: true,
                header: () => (
                    <View style={{ backgroundColor: 'white', paddingTop: insets.top }}>
                        <ScreenHeader title={t('job_form.edit_title')} showBack={true} centerTitle={true} />
                    </View>
                ),
            }} />
            {job && (
                <JobForm
                    initialValues={job}
                    onSubmit={handleUpdate}
                    submitLabel={t('job_form.submit_save')}
                    onCancel={() => router.back()}
                />
            )}
        </View>
    );
}
