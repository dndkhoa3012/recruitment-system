import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { getCategories, createCategory, updateCategory, deleteCategory, getJobs } from '@/services/api';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SwipeableItem } from '@/components/ui/SwipeableItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function CategoriesScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryName, setCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [jobCounts, setJobCounts] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesData, jobsData] = await Promise.all([
                getCategories(),
                getJobs()
            ]);
            setCategories(categoriesData);

            // Calculate job counts
            const counts: { [key: number]: number } = {};
            jobsData.forEach((job: any) => {
                // Handle both straight categoryId or nested category object
                const catId = job.categoryId || job.category?.id;
                if (catId) {
                    counts[catId] = (counts[catId] || 0) + 1;
                }
            });
            setJobCounts(counts);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (str: string) => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleSave = async () => {
        if (!categoryName.trim()) {
            Alert.alert(t('common.error'), t('categories.error_empty_name'));
            return;
        }

        setSubmitting(true);
        try {
            const slug = generateSlug(categoryName);
            if (editingCategory) {
                await updateCategory(editingCategory.id, { name: categoryName, slug });
                Alert.alert(t('job_form.edit_success_title'), t('categories.success_update'));
            } else {
                await createCategory({ name: categoryName, slug });
                Alert.alert(t('job_form.create_success_title'), t('categories.success_create'));
            }
            fetchData();
            setModalVisible(false);
            setCategoryName('');
            setEditingCategory(null);
        } catch (error: any) {
            console.error(error);
            Alert.alert(t('common.error'), error.response?.data?.error || t('common.error'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            t('categories.confirm_delete_title'),
            t('categories.confirm_delete_msg'),
            [
                { text: t('categories.cancel'), style: "cancel" },
                {
                    text: t('categories.delete'),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCategory(id);
                            fetchData();
                        } catch (e) {
                            Alert.alert(t('common.error'), t('categories.error_delete'));
                        }
                    }
                }
            ]
        );
    };

    const openModal = (category?: any) => {
        if (category) {
            setEditingCategory(category);
            setCategoryName(category.name);
        } else {
            setEditingCategory(null);
            setCategoryName('');
        }
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="mx-4 mb-4">
            <SwipeableItem
                onEdit={() => openModal(item)}
                onDelete={() => handleDelete(item.id)}
            >
                <View className="bg-white p-4 rounded-xl border border-gray-100 flex-row items-center gap-4">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                        <Text className="text-sm text-gray-500">{t('categories.job_count', { count: jobCounts[item.id] || 0 })}</Text>
                    </View>
                </View>
            </SwipeableItem>
        </View>
    );

    const renderHeader = () => (
        <View className="px-4 pb-4 bg-gray-50 pt-2">
            <TouchableOpacity
                className="w-full bg-orange-600 py-4 px-6 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-orange-200 mb-4"
                onPress={() => openModal()}
            >
                <MaterialIcons name="add-circle" size={24} color="white" />
                <Text className="text-white font-bold text-lg">{t('categories.add_category_btn')}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />

            <View style={{ backgroundColor: 'white', paddingTop: insets.top }}>
                <ScreenHeader
                    title={t('categories.title')}
                    showBack={true}
                    centerTitle={true}
                />
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={Colors.light.tint} />
                </View>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">{t('categories.empty_categories')}</Text>}
                />
            )}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 justify-end"
                >
                    <TouchableOpacity
                        className="absolute inset-0 bg-black/50"
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    />
                    <View className="bg-white rounded-t-2xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-900">
                                {editingCategory ? t('categories.edit_category_modal_title') : t('categories.add_category_modal_title')}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-semibold mb-2 text-gray-700">{t('categories.category_name_label')} <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-base"
                                placeholder={t('categories.category_name_placeholder')}
                                value={categoryName}
                                onChangeText={setCategoryName}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            className={`w-full h-12 bg-orange-600 rounded-xl items-center justify-center ${submitting ? 'opacity-70' : ''}`}
                            onPress={handleSave}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-base">
                                    {editingCategory ? t('categories.update_btn') : t('categories.create_btn')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
