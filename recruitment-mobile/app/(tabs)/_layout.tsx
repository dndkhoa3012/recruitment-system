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
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#2c2c2e' : '#e5e5ea',
        },
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
          headerTitle: t('overview.title'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: t('menu.jobs'),
          headerTitle: t('jobs.title'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="briefcase.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="candidates"
        options={{
          title: t('menu.candidates'),
          headerTitle: t('candidates.title'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('menu.settings'),
          headerTitle: t('settings.settings'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
