import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import '../i18n';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useRouter, useSegments } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Component to handle redirection
function InitialLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      // Redirect to login if unauthenticated but trying to enter tabs
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // Redirect away from login if authenticated
      router.replace('/(tabs)');
    } else if (!isAuthenticated && segments.length === 0) {
      // Re-route root to login to be safe
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="job/[viewid]" options={{ headerShown: true, title: 'Chi tiết' }} />
      <Stack.Screen name="job/edit/[id]" options={{ headerShown: true, title: 'Chỉnh sửa' }} />
      <Stack.Screen name="job/create" options={{ headerShown: true, title: 'Tạo mới' }} />
      <Stack.Screen name="settings/categories" options={{ headerShown: true, title: 'Danh mục' }} />
      <Stack.Screen name="candidate/[id]" options={{ headerShown: true, title: 'Chi tiết ứng viên' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <InitialLayout />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
