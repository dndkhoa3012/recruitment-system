import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJobs, getCandidates } from '@/services/api';

import { DashboardCard } from '@/components/DashboardCard';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    hiredCandidates: 0,
    candidatesThisMonth: 0,
    pendingCandidates: 0,
    interviewedCandidates: 0
  });

  const fetchData = async () => {
    try {
      const [jobsData, candidatesData] = await Promise.all([
        getJobs(),
        getCandidates()
      ]);

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const totalJobs = jobsData.length;
      const activeJobs = jobsData.filter((j: any) => j.status === 'active').length;

      const totalCandidates = candidatesData.length;
      const hiredCandidates = candidatesData.filter((c: any) => c.status === 'accepted').length;

      const candidatesThisMonth = candidatesData.filter((c: any) => {
        const date = new Date(c.appliedAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      const pendingCandidates = candidatesData.filter((c: any) => c.status === 'pending').length;
      const interviewedCandidates = candidatesData.filter((c: any) => c.status === 'interviewed').length;

      setStats({
        totalJobs,
        activeJobs,
        totalCandidates,
        hiredCandidates,
        candidatesThisMonth,
        pendingCandidates,
        interviewedCandidates
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Dashboard Stats */}
        <DashboardCard
          title="Tổng việc làm"
          count={stats.totalJobs}
          subtitle={`Vị trí đang tuyển: ${stats.activeJobs}`}
          subtitleColor="text-green-600"
          icon="work"
          iconColor="#3b82f6"
          iconBgColor="bg-blue-50"
        />

        <DashboardCard
          title="Đang tuyển"
          count={stats.activeJobs}
          subtitle={`${stats.pendingCandidates} hồ sơ đang chờ`}
          subtitleColor="text-gray-500"
          icon="person-add"
          iconColor="#3b82f6"
          iconBgColor="bg-blue-50"
        />

        <DashboardCard
          title="Tổng ứng viên"
          count={stats.totalCandidates}
          subtitle={`Mới trong tháng: ${stats.candidatesThisMonth}`}
          subtitleColor="text-blue-600"
          icon="people"
          iconColor="#2055e9ff"
          iconBgColor="bg-blue-50"
        />
        <DashboardCard
          title="Đã tuyển"
          count={stats.hiredCandidates}
          subtitle={`${stats.interviewedCandidates} đã phỏng vấn`}
          subtitleColor="text-green-600"
          icon="check-circle"
          iconColor="#50d469ff"
          iconBgColor="bg-blue-50"
        />
        {/* Quick Actions or Job Shortcuts can go here later */}

      </ScrollView>
    </View>
  );
}
