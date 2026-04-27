import { View, Text } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import api from '../api';
import { useLoadingAnimation } from '../components/LoadingAnimation';
import { handleApiError } from '../utils/error.util';
import useNotify from '../hooks/useNotify';

interface ExpenseItemProps {
  activity: string;
  amount: number;
  type?: 'activity' | 'fund_request';  // Add type to differentiate display
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ activity, amount, type = 'activity' }) => (
  <View className="flex-row justify-between items-center py-1 border-b border-gray-200">
    <View className="flex-1 mr-4">
      <Text className="text-gray-800 dark:text-white text-base" numberOfLines={1}>
        {activity}
        {type === 'fund_request' && ' (Fund Request)'}
      </Text>
    </View>
    <Text className="text-gray-900 dark:text-white text-base shrink-0">
      ${amount}
    </Text>
  </View>
);

export default function Statement() {
  const route = useRoute();
  const { tripId, userId } = route.params as { tripId: number; userId: number };
  const { showAnimation } = useLoadingAnimation();
  const { showSnackBar } = useNotify();

  const { data: tripExpenses, isLoading } = useQuery({
    queryKey: ['trip-expenses', tripId],
    queryFn: () => api.expense.getTripExpenses(tripId),
  });

  const exportTripStatementMutation = useMutation({
    mutationFn: () => api.trip.exportTripStatement(tripId, 'excel'),
    onSuccess: () => {
      showSnackBar("Export successful, Please check your email", "success");
    },
    onError: () => {
      handleApiError("Failed to export statement", showSnackBar, {
        defaultMessage: "Failed to export statement"
      });
    }
  })

  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  if (!tripExpenses) return null;

  // Find the participant's balance data
  // Get activities where this user is a participant
  const userActivities = tripExpenses.data.activities
    .filter(activity =>
      activity.participants.some(participant => participant.id === userId),
    )
    .map(activity => ({
      activity: activity.name,
      amount: Number(
        activity.participants.find(p => p.id === userId)?.pivot.contribution || 0,
      ),
      type: 'activity' as const,
    }));

  // Get fund requests for this user
  const userFundRequests = tripExpenses.data.fund_requests
    .filter(request => request.user_id === userId)
    .map(request => ({
      activity: request.message,
      amount: Number(request.amount),
      type: 'fund_request' as const,
    }));

  // Combine activities and fund requests
  const allExpenses = [...userActivities, ...userFundRequests];

  // Calculate total expense for this user
  const totalExpense = allExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <GeneralLayout title="Trip Statement">
      {/* Column Headers */}
      <View className="flex-row justify-between pb-3">
        <Text className="font-semibold text-black dark:text-white">Activity</Text>
        <Text className="font-semibold text-black dark:text-white">Amount</Text>
      </View>

      {/* Expense Items */}
      {allExpenses.map((expense, index) => (
        <ExpenseItem
          key={index}
          activity={expense.activity}
          amount={expense.amount}
          type={expense.type}
        />
      ))}

      <View className="bg-gray-50 dark:bg-transparent mb-12 pt-2">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-gray-900 dark:text-white">Total Expenses</Text>
          <Text className="font-semibold text-gray-900 dark:text-white">${totalExpense}</Text>
        </View>
        {/* {participantBalance && (
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600">Outstanding Balance</Text>
            <Text className="text-gray-600">
              ${Math.abs(participantBalance.balance)}
              {participantBalance.balance < 0 ? ' (You owe)' : ' (Owed to you)'}
            </Text>
          </View>
        )} */}
      </View>

      <ButtonComponent
        variant="primary"
        isLoading={exportTripStatementMutation.isPending}
        onPress={async () => {
          try {
            await exportTripStatementMutation.mutateAsync()
            showSnackBar("Export successful, Please check your email", "success");
          }
          catch (error) {
            handleApiError("Failed to export statement", showSnackBar, {
              defaultMessage: "Failed to export statement"
            });

          }
        }} // You might want to implement export functionality
        title="Export"
        className="mt-8 mb-12"
      />
    </GeneralLayout>
  );
}
