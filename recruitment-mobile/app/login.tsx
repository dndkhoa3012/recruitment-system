import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert(t('common.error', 'Lỗi'), t('common.invalid_credentials', 'Vui lòng nhập đầy đủ thông tin'));
            return;
        }

        setIsSubmitting(true);
        try {
            await login(username, password);
            // Router listener in _layout.tsx will handle the redirect to /(tabs)
        } catch (error: any) {
            console.error('Login failed', error);
            const errorMsg = error.response?.data?.error || t('common.login_failed', 'Đăng nhập thất bại. Tên đăng nhập hoặc mật khẩu không đúng.');
            Alert.alert(t('common.error', 'Lỗi'), errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-8"
            >
                {/* Logo Area */}
                <View className="items-center mb-12">
                    <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-6">
                        <MaterialIcons name="work" size={48} color={Colors.light.tint} />
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">John's Tours</Text>
                    <Text className="text-base text-gray-500 font-medium">Hệ thống Quản lý Tuyển dụng</Text>
                </View>

                {/* Form Area */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Tên đăng nhập</Text>
                        <TextInput
                            className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-base"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Mật khẩu</Text>
                        <TextInput
                            className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-base"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity
                        className={`w-full h-14 bg-orange-600 rounded-xl items-center justify-center mt-6 ${isSubmitting ? 'opacity-70' : ''}`}
                        onPress={handleLogin}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Đăng nhập</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
