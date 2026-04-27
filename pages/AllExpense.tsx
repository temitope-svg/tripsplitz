import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import GeneralLayout from '../layouts/GeneralLayout';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import { useLoadingAnimation } from '../components/LoadingAnimation';
import { formatCurrency } from '../utils/currency.util';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import ExportButtonComponent from '../components/ExportButtonComponent';
import ShareButtonComponent from '../components/ShareButtonComponent';

interface ActivityItemProps {
  name: string;
  total: string;
  count: number;
  formatted_count: string;
  onPress: (name: string) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ name, total, count, onPress }) => {
  const formatCount = (count: number) => {
    if (count <= 10) return count.toString();
    return `${Math.floor(count / 10) * 10}+`;
  };

  return (
    <TouchableOpacity 
      onPress={() => onPress(name)}
      className="flex-row justify-between px-3 py-4 rounded-xl mt-3 border border-[#DDE2E5] bg-[#F8F9FA] dark:bg-[#54585C]">
      <View className='h-full flex-row items-center'>
        <Text className="font-semibold text-base text-black dark:text-white">{name}</Text>
      </View>
      <View>
        <Text className="font-semibold text-base mb-2 text-black dark:text-white">{formatCurrency(total)}</Text>
        <Text className="text-xs text-gray-600 dark:text-gray-300">{formatCount(count)} Times</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AllExpense() {
  const { showAnimation } = useLoadingAnimation();
  const navigation = useAppNavigation();

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => api.expense.getAllExpenses()
  });

  const { data: totalData, isLoading: totalLoading } = useQuery({
    queryKey: ['expenses-total'],
    queryFn: () => api.expense.getTotalExpenses()
  });

  const catgoryFilterMutation = useMutation({
    mutationFn: (category: string) => api.activity.getActivitiesByCategory(category)
  });

  React.useEffect(() => {
    if (categoriesLoading || totalLoading) {
      showAnimation();
    }
  }, [categoriesLoading, showAnimation, totalLoading]);

  const handleActivityPress = async(name: string) => {

    const {activities} = await catgoryFilterMutation.mutateAsync(name);

    navigation.navigate(PAGES.expenseActivities, { 
      activityName: name,
      categoryId: activities.length > 0 ? activities[0].category_id : 0,
      activities: activities || []
    });
  };

  return (
    <GeneralLayout title="All Expense">
      <View className="flex-1">
        <View className="bg-[#F8F9FA] dark:bg-[#54585C] p-4 rounded-xl self-start">
          <Text className="text-xs mb-1 text-black dark:text-white">Expense</Text>
          <Text className="text-2xl text-black dark:text-white">{totalData?.formatted_total}</Text>
        </View>

        <Text className="font-semibold text-base pt-6 mb-2 text-black dark:text-white">
          Activity Category
        </Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {categoriesData?.categories.map((activity: ActivityItemProps, index: number) => (
            <ActivityItem
              key={index}
              name={activity.name}
              total={activity.total}
              count={activity.count}
              formatted_count={activity.formatted_count}
              onPress={handleActivityPress}
            />
          ))}
        </ScrollView>

        <View className="flex-row mt-4">
          <ExportButtonComponent  variant='button' exportAPI={api.expense.exportExpenses} disabled={totalData?.total_expense == 0} />
          <ShareButtonComponent variant='button' title='Share Expenses' message='Check out these expenses!' url={`/expenses`} disabled={totalData?.total_expense == 0} />
        </View>
      </View>
    </GeneralLayout>
  );
}
