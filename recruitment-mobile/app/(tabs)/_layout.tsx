import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        header: ({ options }) => {
          const title = typeof options.headerTitle === 'string'
            ? options.headerTitle
            : options.title;

          return (
            <View style={{ backgroundColor: 'white', paddingTop: insets.top }}>
              <ScreenHeader title={title || ''} centerTitle={true} />
            </View>
          );
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('menu.overview'),
          headerTitle: 'Tổng quan',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: t('menu.jobs'),
          headerTitle: 'Quản lý Việc làm',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="briefcase.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="candidates"
        options={{
          title: t('menu.candidates'),
          headerTitle: 'Quản lý Ứng viên',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('menu.settings'),
          headerTitle: 'Cài đặt',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
