import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import YearSelector from '../components/YearSelector';
import { BudgetExpense } from '../components/BudgetExpense';
import { useAppSelector } from '../store/hooks';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import StatsCard from '../components/StatsCard';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';
import { usePageFocus } from '../hooks/usePageFocus';
import { formatCurrency } from '../utils/currency.util';

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { loggedInUser } = useAppSelector(state => state.user);
  const userData = loggedInUser?.user;
  const appNavigation = useAppNavigation();

  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard', selectedYear],
    queryFn: () => api.dashboard.getDashboardData(selectedYear),
    staleTime: 1000,
  });

  const handleYear = (year: number) => {
    setSelectedYear(year);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  usePageFocus(() => {
    refetch();
  });

  useEffect(() => {
    console.log("Dashboard Data", dashboardData);
  }, [dashboardData]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#292C33]">
      <View className="pt-10 pb-10 px-4 bg-primary dark:bg-[#292C33] rounded-br-3xl rounded-bl-3xl">
        <Text className="text-white text-2xl font-semibold">
          Hi, {userData?.display_name || userData?.name?.split(' ')[0] || 'User'}
        </Text>
        <Text className="text-white text-sm">{getGreeting()}</Text>

        <Text className="text-white pt-6 font-semibold mt-4">
          {selectedYear} Trips & Activities
        </Text>

        <View className="bg-white dark:bg-[#292C33] rounded-xl pb-5 mt-3 dark:border dark:border-primary">
          <View className="flex-row justify-between px-10 pt-4">
            <StatsCard
              title="Upcoming Trips"
              value={dashboardData?.stats?.upcomingTrips || 0}
              navigateTo="upcomingTrips"
            />
            <StatsCard
              title="Trips"
              value={dashboardData?.stats?.totalTrips || 0}
              navigateTo="allTrips"
            />
            <StatsCard
              title="Activities"
              value={dashboardData?.stats?.totalActivities || 0}
              navigateTo="activities"
            />
          </View>
          <YearSelector selectedYear={selectedYear} onYearSelect={handleYear} />
        </View>
      </View>

      <View className="px-4">
        <View>
          <Text className="text-lg pt-8 font-semibold text-black dark:text-white mb-1">Current Expense</Text>
          <View className=" shadow-sm rounded-2xl py-4 px-3 bg-gray-100 dark:bg-gray-800 dark:border dark:border-white/40 ">
            <Text className=" mb-2 text-black dark:text-white">Your Expense</Text>

            <View className="flex-row gap-x-10">
              <View className="flex-row items-center justify-between">
                <View className="w-12 h-7 items-center justify-center">
                  {Number(dashboardData?.expenses?.yourExpense || 0) > Number(dashboardData?.expenses?.budget || 0) ? (
                    <Feather
                      name="trending-down"
                      size={32}
                      color="#991B1B"  // Red color for over budget
                      className="dark:text-white"
                    />
                  ) : (
                    <Feather
                      name="trending-up"
                      size={32}
                      color="#059669"  // Green color for under budget
                      className="dark:text-white"
                    />
                  )}
                </View>
                <View>
                  <Text className="font-semibold text-xl text-black dark:text-white">
                    { dashboardData?.expenses?.yourExpense ? formatCurrency(dashboardData?.expenses.yourExpense) : formatCurrency(0)}
                  </Text>
                  <Text className="text-gray-400 dark:text-gray-500 text-base">
                    /{dashboardData?.expenses?.budget ? formatCurrency(dashboardData?.expenses.budget) : formatCurrency(0)}
                  </Text>
                </View>
              </View>
              <View className="flex-row bg-[#FFD4D4] dark:bg-[#878F96] px-2 gap-x-1 py-3 rounded-xl">
                <View>
                  <Text className="font-semibold text-[#991B1B] dark:text-[#292C33]">Trip exp.</Text>
                  <Text className="text-[#991B1B] dark:text-[#292C33] font-bold text-lg">
                    {dashboardData?.expenses?.yourExpense ? formatCurrency(dashboardData?.expenses.yourExpense) : formatCurrency(0)}
                  </Text>
                </View>
                <View className="flex-row bg-white dark:bg-gray-700 items-center px-2 rounded-2xl h-10">
                  <View className="rounded-full bg-[#991B1B] dark:bg-[#DDE2E5] px-2 mx-1">
                    <Text className="font-semibold text-white dark:text-[#54585C] text-2xl">$</Text>
                  </View>
                </View>
              </View>
            </View>
            <BudgetExpense percentage={dashboardData?.expenses?.percentage || 0} />
          </View>
        </View>

        <View className="flex-row justify-center gap-x-3 mt-6 ">
          <TouchableOpacity
            onPress={() => appNavigation.navigate(PAGES.toReceive)}
            className="flex-row flex-1 bg-[#A7F3D0] dark:bg-transparent dark:border dark:border-[#059669] px-4 gap-x-2 py-4 rounded-xl"
          >
            <View>
              <Text className="text-green-900 dark:text-[#DDE2E5] font-bold text-lg">
                {dashboardData?.debtSummary?.oweYou ? formatCurrency(dashboardData?.debtSummary.oweYou) : formatCurrency(0)}
              </Text>
              <Text className="font-bold text-green-900 dark:text-[#DDE2E5]">Owe you</Text>
            </View>
            <View className="flex-row bg-white dark:bg-gray-700 items-center px-3 rounded-2xl h-10">
              <View className="rounded-full bg-green-900 dark:bg-green-400 w-8 h-8 items-center justify-center mx-1">
                <Text className="font-semibold text-white dark:text-green-900 text-2xl">$</Text>
              </View>
              <Feather
                name={Number(dashboardData?.debtSummary?.oweYou || 0) > 0 ? "trending-up" : "trending-down"}
                size={16}
                color="#059669"
                className="dark:text-green-400"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => appNavigation.navigate(PAGES.toPay)}
            className="flex-row flex-1 bg-[#FFD4D4] dark:bg-transparent dark:border dark:border-[#991B1B] px-4 py-4 rounded-xl"
          >
            <View className="flex-row bg-white dark:bg-gray-700 items-center px-3 rounded-2xl h-10">
              <View className="rounded-full bg-[#991B1B] dark:bg-[#FF9999] w-8 h-8 items-center justify-center mx-1">
                <Text className="font-semibold text-[#FFD4D4] dark:text-[#991B1B] text-2xl">$</Text>
              </View>
              <Feather
                name={Number(dashboardData?.debtSummary?.youOwe || 0) > 0 ? "trending-up" : "trending-down"}
                size={16}
                color="#991B1B"
                className="dark:text-[#FF9999]"
              />
            </View>
            <View className="ml-2">
              <Text className="text-[#991B1B] dark:text-[#DDE2E5] font-bold text-lg">
                {dashboardData?.debtSummary?.youOwe ? formatCurrency(dashboardData?.debtSummary.youOwe) : '0'}
              </Text>
              <Text className="font-bold text-[#991B1B] dark:text-[#DDE2E5]">Owing</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
