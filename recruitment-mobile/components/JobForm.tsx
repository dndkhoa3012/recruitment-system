import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCategories } from '@/services/api';
import { useTranslation } from 'react-i18next';

interface JobFormProps {
    initialValues?: any;
    onSubmit: (values: any) => Promise<void>;
    submitLabel: string;
    onCancel?: () => void;
}

const JOB_TYPES = [
    { value: 'full-time', label: 'Toàn thời gian' },
    { value: 'part-time', label: 'Bán thời gian' },
    { value: 'internship', label: 'Thực tập' },
];

const JOB_STATUS = {
    ACTIVE: 'active',
    CLOSED: 'closed',
};

// Dynamic Input List Component using NestableDraggableFlatList
interface DynamicInputListProps {
    label: string;
    data: string[];
    onChange: (newData: string[]) => void;
    placeholder: string;
    addLabel: string;
}

const DynamicInputList: React.FC<DynamicInputListProps> = ({ label, data, onChange, placeholder, addLabel }) => {
    const handleAdd = () => onChange([...data, '']);

    const handleRemove = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const handleChangeText = (text: string, index: number) => {
        const newData = [...data];
        newData[index] = text;
        onChange(newData);
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newData = [...data];
        [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
        onChange(newData);
    };

    const moveDown = (index: number) => {
        if (index === data.length - 1) return;
        const newData = [...data];
        [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
        onChange(newData);
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', marginBottom: 8, color: '#374151', marginLeft: 4 }}>{label}</Text>
            {data.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    {/* Up/Down buttons */}
                    <View style={{ marginRight: 6, gap: 2 }}>
                        <TouchableOpacity
                            onPress={() => moveUp(index)}
                            disabled={index === 0}
                            style={{ padding: 4, opacity: index === 0 ? 0.25 : 1 }}
                        >
                            <MaterialIcons name="keyboard-arrow-up" size={20} color="#6b7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => moveDown(index)}
                            disabled={index === data.length - 1}
                            style={{ padding: 4, opacity: index === data.length - 1 ? 0.25 : 1 }}
                        >
                            <MaterialIcons name="keyboard-arrow-down" size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                    {/* Text input */}
                    <TextInput
                        style={{ flex: 1, minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', fontSize: 15 }}
                        value={item}
                        onChangeText={(text) => handleChangeText(text, index)}
                        placeholder={placeholder}
                        multiline={true}
                        textAlignVertical="top"
                    />
                    {/* Delete button */}
                    <TouchableOpacity onPress={() => handleRemove(index)} style={{ marginLeft: 8, padding: 8 }}>
                        <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity
                onPress={handleAdd}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#d1d5db', borderRadius: 12, marginTop: 4, backgroundColor: '#f9fafb' }}
            >
                <MaterialIcons name="add" size={20} color="#4b5563" />
                <Text style={{ marginLeft: 4, color: '#4b5563', fontWeight: '500' }}>{addLabel}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function JobForm({ initialValues, onSubmit, submitLabel, onCancel }: JobFormProps) {
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);

    // Dynamic Lists State
    const [descriptionList, setDescriptionList] = useState<string[]>(['']);
    const [requirementsList, setRequirementsList] = useState<string[]>(['']);
    const [benefitsList, setBenefitsList] = useState<string[]>(['']);

    // Initialize with default values (excluding dynamic fields)
    const [formData, setFormData] = useState({
        title: '',
        category: '', // Store name for display
        categoryId: '', // Default ID, would ideally come from a category list
        quantity: '1',
        location: '',
        type: 'full-time',
        salary: '',
        deadline: new Date(), // Store as Date object
        status: 'active',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);

            // Auto-select if only one category and creating new job (no initial ID or default 1)
            if (data.length === 1 && (!initialValues || !initialValues.categoryId)) {
                setFormData(prev => ({
                    ...prev,
                    categoryId: data[0].id,
                    category: data[0].name
                }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Initialize/Update form data when initialValues changes
    useEffect(() => {
        if (initialValues) {
            // Helper to safe stringify
            const safeString = (val: any) => val ? String(val) : '';
            // Format date
            let formattedDeadline = new Date();
            if (initialValues.deadline) {
                try {
                    formattedDeadline = new Date(initialValues.deadline);
                } catch (e) { }
            }

            // Auto-close if deadline has passed
            const effectiveStatus = (initialValues.status === 'active' && formattedDeadline < new Date())
                ? 'closed'
                : (initialValues.status || 'active');

            setFormData({
                title: safeString(initialValues.title),
                category: initialValues.category?.name || '', // Extract name if object
                categoryId: initialValues.categoryId || '', // Use empty string if no ID, don't default to 1
                quantity: safeString(initialValues.quantity || '1'),
                location: safeString(initialValues.location),
                type: initialValues.type || 'full-time',
                salary: safeString(initialValues.salary),
                deadline: formattedDeadline,
                status: effectiveStatus,
            });

            // Parse Description
            try {
                if (initialValues.description) {
                    const descData = JSON.parse(initialValues.description);
                    if (descData && typeof descData === 'object' && Array.isArray(descData.points)) {
                        setDescriptionList(descData.points.length > 0 ? descData.points : ['']);
                    } else if (Array.isArray(descData)) {
                        setDescriptionList(descData.length > 0 ? descData : ['']);
                    } else {
                        // Check if string contains newlines as fallback
                        const str = String(descData);
                        setDescriptionList(str ? [str] : ['']);
                    }
                } else {
                    setDescriptionList(['']);
                }
            } catch (e) {
                const str = initialValues.description ? String(initialValues.description) : '';
                setDescriptionList(str ? [str] : ['']);
            }

            // Parse Requirements
            try {
                if (initialValues.requirements) {
                    const reqData = JSON.parse(initialValues.requirements);
                    if (Array.isArray(reqData)) {
                        setRequirementsList(reqData.length > 0 ? reqData : ['']);
                    } else {
                        const str = String(reqData);
                        setRequirementsList(str ? [str] : ['']);
                    }
                } else {
                    setRequirementsList(['']);
                }
            } catch (e) {
                const str = initialValues.requirements ? String(initialValues.requirements) : '';
                setRequirementsList(str ? [str] : ['']);
            }

            // Parse Benefits
            try {
                if (initialValues.benefits) {
                    const benData = JSON.parse(initialValues.benefits);
                    if (Array.isArray(benData)) {
                        const texts = benData.map((b: any) => typeof b === 'string' ? b : (b.text || ''));
                        setBenefitsList(texts.length > 0 ? texts : ['']);
                    } else {
                        const str = String(benData);
                        setBenefitsList(str ? [str] : ['']);
                    }
                } else {
                    setBenefitsList(['']);
                }
            } catch (e) {
                const str = initialValues.benefits ? String(initialValues.benefits) : '';
                setBenefitsList(str ? [str] : ['']);
            }
        }
    }, [initialValues]);

    // Update category name if we have ID but no name (e.g. from edit)
    useEffect(() => {
        if (categories.length > 0 && formData.categoryId && !formData.category) {
            const cat = categories.find(c => c.id == formData.categoryId);
            if (cat) {
                setFormData(prev => ({ ...prev, category: cat.name }));
            }
        }
    }, [categories, formData.categoryId, formData.category]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCategorySelect = (category: any) => {
        setFormData(prev => ({
            ...prev,
            categoryId: category.id,
            category: category.name
        }));
        setShowCategoryModal(false);
    };


    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            Alert.alert(t('common.error'), t('job_form.title_required'));
            return false;
        }
        if (!formData.category) {
            Alert.alert(t('common.error'), t('job_form.category_required'));
            return false;
        }
        if (!formData.location.trim()) {
            Alert.alert(t('common.error'), t('job_form.location_required'));
            return false;
        }

        setSubmitting(true);
        try {
            // Prepare dynamic fields
            // Filter out empty strings
            const cleanDescription = descriptionList.filter(item => item.trim() !== '');
            const cleanRequirements = requirementsList.filter(item => item.trim() !== '');
            const cleanBenefits = benefitsList.filter(item => item.trim() !== '');

            // JSON Stringify logic matching backend expectations
            // Description -> { points: [...] }
            const descriptionJSON = JSON.stringify({ points: cleanDescription });
            // Requirements -> [...]
            const requirementsJSON = JSON.stringify(cleanRequirements);
            // Benefits -> [{ text: ..., icon: '' }]  (let view handle icon mapping)
            const benefitsJSON = JSON.stringify(cleanBenefits.map(text => ({ text, icon: '' })));

            // Sanitize payload for Prisma
            const { category: _categoryName, categoryId, ...otherFields } = formData;

            const payload = {
                ...otherFields,
                categoryId: categoryId ? Number(categoryId) : null,
                quantity: parseInt(formData.quantity) || 1,
                deadline: formData.deadline.toISOString(),
                description: descriptionJSON,
                requirements: requirementsJSON,
                benefits: benefitsJSON,
            };

            await onSubmit(payload);
        } catch (error) {
            Alert.alert(t('common.error'), t('common.error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Basic Info */}
                <View className="space-y-4 mb-6">
                    <View>
                        <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.title_label')} <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-base"
                            placeholder={t('job_form.title_placeholder')}
                            value={formData.title}
                            onChangeText={(text) => handleChange('title', text)}
                        />
                    </View>

                    <View className="flex-row gap-4 mt-2">
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.category_label')} <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity
                                onPress={() => setShowCategoryModal(true)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white justify-center"
                            >
                                <Text className={`text-base ${formData.category ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {formData.category || t('job_form.select_category')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.quantity_label')}</Text>
                            <TextInput
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-base"
                                value={formData.quantity}
                                onChangeText={(text) => handleChange('quantity', text)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View className="mt-2">
                        <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.location_label')} <Text className="text-red-500">*</Text></Text>
                        <View className="relative">
                            <TextInput
                                className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-base"
                                value={formData.location}
                                onChangeText={(text) => handleChange('location', text)}
                                placeholder={t('job_form.location_placeholder')}
                            />
                            <MaterialIcons name="location-on" size={20} color={Colors.light.tint} style={{ position: 'absolute', right: 12, top: 14 }} />
                        </View>
                    </View>
                </View>

                {/* Job Details */}
                <View className="space-y-4 pt-4 border-t border-gray-200 mb-6">
                    <View className="flex-row gap-4 mt-2">
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.type_label')}</Text>
                            <TouchableOpacity
                                onPress={() => setShowTypeModal(true)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white justify-center"
                            >
                                <Text className="text-base text-gray-900">
                                    {JOB_TYPES.find(jt => jt.value === formData.type)?.label || t('job_form.select_type')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.salary_label')}</Text>
                            <TextInput
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-base"
                                value={formData.salary}
                                onChangeText={(text) => handleChange('salary', text)}
                                placeholder={t('job_form.salary_placeholder')}
                            />
                        </View>
                    </View>

                    <View className="flex-row gap-4 mt-2">
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.deadline_label')}</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white justify-center"
                            >
                                <Text className="text-base text-gray-900">
                                    {formatDate(formData.deadline)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-2 text-gray-700 ml-1">{t('job_form.status_label')}</Text>
                            <TouchableOpacity
                                className={`w-full h-12 px-4 rounded-xl border flex-row items-center justify-between ${formData.status === JOB_STATUS.ACTIVE ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}
                                onPress={() => handleChange('status', formData.status === JOB_STATUS.ACTIVE ? JOB_STATUS.CLOSED : JOB_STATUS.ACTIVE)}
                            >
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons
                                        name={formData.status === JOB_STATUS.ACTIVE ? "check-circle" : "pause-circle-filled"}
                                        size={18}
                                        color={formData.status === JOB_STATUS.ACTIVE ? "#15803d" : "#ca8a04"}
                                    />
                                    <Text className={`font-medium text-sm ${formData.status === JOB_STATUS.ACTIVE ? 'text-green-700' : 'text-yellow-700'}`}>
                                        {formData.status === JOB_STATUS.ACTIVE ? t('job_form.status_active') : t('job_form.status_closed')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Job Type Selection Modal */}
                <Modal
                    visible={showTypeModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowTypeModal(false)}
                >
                    <TouchableOpacity
                        className="flex-1 bg-black/50 justify-center items-center p-4"
                        activeOpacity={1}
                        onPress={() => setShowTypeModal(false)}
                    >
                        <View className="bg-white w-full max-w-[300px] rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                                <Text className="font-bold text-lg text-gray-900">{t('job_form.select_type')}</Text>
                                <TouchableOpacity onPress={() => setShowTypeModal(false)}>
                                    <MaterialIcons name="close" size={24} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                {JOB_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type.value}
                                        className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${formData.type === type.value ? 'bg-orange-50' : ''}`}
                                        onPress={() => {
                                            handleChange('type', type.value);
                                            setShowTypeModal(false);
                                        }}
                                    >
                                        <Text className={`text-base ${formData.type === type.value ? 'font-bold text-orange-600' : 'text-gray-900'}`}>
                                            {type.label}
                                        </Text>
                                        {formData.type === type.value && (
                                            <MaterialIcons name="check" size={20} color={Colors.light.tint} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Description, Requirements, Benefits - Dynamic Lists */}
                <View className="space-y-6 pt-4 border-t border-gray-200 mb-20">
                    <DynamicInputList
                        label={t('job_form.description_label')}
                        data={descriptionList}
                        onChange={setDescriptionList}
                        placeholder={t('job_form.description_placeholder')}
                        addLabel={t('job_form.add_row')}
                    />

                    <DynamicInputList
                        label={t('job_form.requirements_label')}
                        data={requirementsList}
                        onChange={setRequirementsList}
                        placeholder={t('job_form.requirements_placeholder')}
                        addLabel={t('job_form.add_row')}
                    />

                    <DynamicInputList
                        label={t('job_form.benefits_label')}
                        data={benefitsList}
                        onChange={setBenefitsList}
                        placeholder={t('job_form.benefits_placeholder')}
                        addLabel={t('job_form.add_row')}
                    />
                </View>

                {/* Category Selection Modal */}
                <Modal
                    visible={showCategoryModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCategoryModal(false)}
                >
                    <TouchableOpacity
                        className="flex-1 bg-black/50 justify-center items-center p-4"
                        activeOpacity={1}
                        onPress={() => setShowCategoryModal(false)}
                    >
                        <View className="bg-white w-full max-h-[80%] rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                                <Text className="font-bold text-lg text-gray-900">{t('job_form.select_category')}</Text>
                                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                    <MaterialIcons name="close" size={24} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {categories.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${formData.categoryId === cat.id ? 'bg-orange-50' : ''}`}
                                        onPress={() => handleCategorySelect(cat)}
                                    >
                                        <Text className={`text-base ${formData.categoryId === cat.id ? 'font-bold text-orange-600' : 'text-gray-900'}`}>
                                            {cat.name}
                                        </Text>
                                        {formData.categoryId === cat.id && (
                                            <MaterialIcons name="check" size={20} color={Colors.light.tint} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                                {categories.length === 0 && (
                                    <View className="p-8 items-center">
                                        <Text className="text-gray-500">{t('common.loading')}</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Date Picker Modal - Native iOS inline calendar */}
                {Platform.OS === 'ios' && (
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={showDatePicker}
                        onRequestClose={() => setShowDatePicker(false)}
                        statusBarTranslucent
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', paddingHorizontal: 16 }}>
                            <TouchableOpacity
                                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                                onPress={() => setShowDatePicker(false)}
                            />
                            <View style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', padding: 12 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 4 }}>
                                    <Text style={{ fontWeight: '700', fontSize: 17, color: '#111827' }}>{t('job_form.select_date')}</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(false)}
                                        style={{ backgroundColor: '#fff7ed', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}
                                    >
                                        <Text style={{ color: Colors.light.tint, fontWeight: '700', fontSize: 15 }}>{t('job_form.done')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={formData.deadline}
                                    minimumDate={new Date()}
                                    mode="date"
                                    display="inline"
                                    onChange={(_: any, selectedDate?: Date) => {
                                        if (selectedDate) {
                                            setFormData(prev => ({ ...prev, deadline: selectedDate }));
                                        }
                                    }}
                                    locale="vi-VN"
                                    themeVariant="light"
                                    accentColor={Colors.light.tint}
                                    style={{ width: '100%' }}
                                />
                            </View>
                        </View>
                    </Modal>
                )}

                {/* Android Date Picker */}
                {Platform.OS === 'android' && showDatePicker && (
                    <DateTimePicker
                        value={formData.deadline}
                        minimumDate={new Date()}
                        mode="date"
                        display="default"
                        onChange={(_: any, selectedDate?: Date) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setFormData(prev => ({ ...prev, deadline: selectedDate }));
                            }
                        }}
                    />
                )}



            </ScrollView>

            {/* Footer Buttons */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex-row justify-center gap-10">
                <TouchableOpacity
                    className="w-36 h-12 bg-gray-50 rounded-xl border border-gray-200 items-center justify-center"
                    onPress={onCancel}
                    disabled={submitting}
                >
                    <Text className="text-gray-500 font-semibold">{t('job_form.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`w-36 h-12 bg-orange-600 rounded-xl shadow-lg flex-row items-center justify-center gap-2 ${submitting ? 'opacity-70' : ''}`}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialIcons name="save" size={20} color="white" />
                            <Text className="text-white font-bold text-base">{submitLabel}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
