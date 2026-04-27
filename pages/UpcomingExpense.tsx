import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import GeneralLayout from '../layouts/GeneralLayout';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useLoadingAnimation } from '../components/LoadingAnimation';
import ShareButtonComponent from '../components/ShareButtonComponent';
import ExportButtonComponent from '../components/ExportButtonComponent';
import SortByDropdown from '../components/SortByDropdown';

interface ExpenseItemProps {
  id: number;
  name: string;
  amount: string;
  formattedAmount: string;
  category: string;
  onPress: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ name, formattedAmount, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row justify-between p-4 rounded-2xl bg-white border border-[#DDE2E5] mb-3"
  >
    <View>
      <Text className="text-base">{name}</Text>
    </View>
    <Text className="text-base">{formattedAmount}</Text>
  </TouchableOpacity>
);

export default function UpcomingExpense() {
  const navigation = useAppNavigation();
  const { showAnimation, hideAnimation } = useLoadingAnimation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['upcoming-expenses'],
    queryFn: () => api.expense.getUpcomingExpenses(),
    onSettled: () => {
      hideAnimation();
    },
  });

  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  React.useEffect(() => {
    if (data?.activities) {
      setFilteredActivities(data.activities);
    }
  }, [data?.activities]);

  const handleCategorySelect = (category: string) => {
    if (category) {
      const sortedActivities = [...(data?.activities || [])].sort((a, b) => {
        if (a.category === category && b.category !== category) return -1;
        if (a.category !== category && b.category === category) return 1;
        return 0;
      });
      
      setFilteredActivities(sortedActivities);
      setSelectedCategory(category);
    } else {
      setFilteredActivities(data?.activities || []);
      setSelectedCategory('');
    }
  };

  return (
    <GeneralLayout title="Upcoming Expense">
      <View className="flex-1">
        <View className="bg-[#F8F9FA] p-4 rounded-xl self-start mb-8">
          <Text className="text-sm text-gray-600 mb-1">Total</Text>
          <Text className="text-3xl">{data?.formatted_total}</Text>
        </View>

        <Text className="text-xl font-semibold mb-4">Activities</Text>

        <View className="flex-row mb-6">
          <SortByDropdown
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <TouchableOpacity 
            className="bg-white border border-[#DDE2E5] px-4 py-2 rounded-xl"
            onPress={() => handleCategorySelect('')}
          >
            <Text className="text-black dark:text-white">All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredActivities.map((activity) => (
            <ExpenseItem
              key={activity.id}
              id={activity.id}
              name={activity.name}
              amount={activity.cost}
              formattedAmount={activity.formatted_cost}
              category={activity.category}
              onPress={() => navigation.navigate(PAGES.activity, { activity: activity.id })}
            />
          ))}
        </ScrollView>

        <View className="flex-row mt-4">
          <ExportButtonComponent variant='button' exportAPI={api.expense.exportExpenses} disabled={data?.total_expense == 0} />
          <ShareButtonComponent variant='button' title='Share Expenses' message='Check out these expenses!' url={`/upcoming-expenses`} disabled={data?.total_expense == 0} />
        </View>
      </View>
    </GeneralLayout>
  );
} 
