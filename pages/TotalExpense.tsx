import {View, Text} from 'react-native';
import React from 'react';
import {RootStackParamsList} from '../utils/types';
import {useRoute, RouteProp} from '@react-navigation/native';
import ExpenseActivities from '../components/ExpenseActivities';
import {useQuery} from '@tanstack/react-query';
import api from '../api';
import {formatCurrency} from '../utils/currency.util';
import GeneralLayout from '../layouts/GeneralLayout';
import {useLoadingAnimation} from '../components/LoadingAnimation';
import ButtonComponent from '../components/ButtonComponent';

type TotalExpenseRouteProp = RouteProp<RootStackParamsList, 'totalExpense'>;

export default function TotalExpense() {
  const route = useRoute<TotalExpenseRouteProp>();
  const {tripId} = route.params;
  const {showAnimation, hideAnimation} = useLoadingAnimation();

  const {data: expenseData, isLoading} = useQuery({
    queryKey: ['trip-expenses', tripId],
    queryFn: () => api.trip.getTripExpenses(tripId),
    onSettled: () => hideAnimation(),
  });

  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  const totalExpense = expenseData?.data.total_expenses.total || 0;

  return (
    <GeneralLayout title="Total Expense">
      <View className="flex-1">
        <View>
          <View className="bg-gray-100 dark:bg-gray-800 px-3 py-3 rounded-xl mt-7 self-start">
            <Text className="text-black dark:text-gray-400 text-xs">Expense</Text>
            <Text className="text-xl text-black dark:text-white">
              {formatCurrency(totalExpense)}
            </Text>
          </View>

          <ExpenseActivities 
            activities={expenseData?.data.activities || []}
            fundRequests={expenseData?.data.fund_requests || []}
          />
        </View>

        <View className="flex-row mt-8 justify-between gap-x-4 mb-36">
          <ButtonComponent
            title="Export"
            variant="text"
            onPress={() => {}}
            className="flex-1 w-full"
          />
          <ButtonComponent
            title="Share"
            variant="primary"
            onPress={() => {}}
            className="flex-1 w-full"
          />
        </View>
      </View>
    </GeneralLayout>
  );
}
