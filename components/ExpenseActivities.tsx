import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {formatCurrency} from '../utils/currency.util';
import moment from 'moment';

interface ActivityItemProps {
  title: string;
  price: string;
  date: string;
  category?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({title, price, date, category}) => (
  <TouchableOpacity className="flex-row justify-between bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-4 rounded-xl mb-3">
    <View>
      <Text className="text-black dark:text-white">{title}</Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400">
        {moment(date).format('MMM D, YYYY')}
        {category ? ` • ${category}` : ''}
      </Text>
    </View>
    <Text className="text-black dark:text-white">{formatCurrency(price)}</Text>
  </TouchableOpacity>
);

interface ExpenseActivitiesProps {
  activities: Array<{
    id: number;
    name: string;
    cost: string;
    scheduled_at: string;
    category?: {
      name: string;
    };
  }>;
  fundRequests: Array<{
    id: number;
    amount: string;
    status: string;
    user: {
      name: string;
    };
  }>;
}

const ExpenseActivities: React.FC<ExpenseActivitiesProps> = ({activities, fundRequests}) => {
  const [filter] = useState<'all' | 'activities' | 'funds'>('all');

  const items = filter === 'activities' ? activities 
    : filter === 'funds' ? fundRequests 
    : [...activities, ...fundRequests];

  return (
    <View>
      <Text className="text-xl font-semibold mt-6 mb-6 text-black dark:text-white">Activities</Text>
      <View className="flex-row mb-6">
          <TouchableOpacity className="bg-[#F8F9FA] px-4 py-2 rounded-xl mr-3">
            <Text>Sort by</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-[#DDE2E5] px-4 py-2 rounded-xl">
            <Text>All</Text>
          </TouchableOpacity>
        </View>

      {items.map((item) => (
        <ActivityItem
          key={item.id}
          title={'name' in item ? item.name : `Fund Request (${item.user.name})`}
          price={'cost' in item ? item.cost : item.amount}
          date={'scheduled_at' in item ? item.scheduled_at : new Date().toISOString()}
          category={'category' in item ? item.category?.name : undefined}
        />
      ))}
    </View>
  );
};

export default ExpenseActivities;
