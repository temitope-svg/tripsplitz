import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import GeneralLayout from '../layouts/GeneralLayout';
import { useLoadingAnimation } from '../components/LoadingAnimation';
import moment from 'moment';
import ExportButtonComponent from '../components/ExportButtonComponent';
import ShareButtonComponent from '../components/ShareButtonComponent';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import { usePageFocus } from '../hooks/usePageFocus';
import { formatCurrency } from '../utils/currency.util';

interface PaymentItemProps {
  name: string;
  description: string;
  amount: string;
  date: string;
  type: string;
  onPress?: () => void;
}

const parsePayload = (payload: any) => {
  if (typeof payload !== 'string') {
    return payload;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
};

const PaymentItem: React.FC<PaymentItemProps> = ({
  name,
  description,
  amount,
  date,
  type,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700">
    <View className="flex-row justify-between items-start">
      <View className="flex-1 mr-4">
        <Text className="text-black dark:text-white text-base font-medium">
          {name}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">{description}</Text>
        <Text className="text-gray-500 dark:text-gray-500 text-sm">
          {type === 'fund_request' ? 'Fund Request' : 'Activity Payment'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-black dark:text-white text-base font-medium">
          {amount}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">
          {date ? moment(date).format('MMM DD') : '-'}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function ToPay() {
  const navigation = useAppNavigation();
  const { showAnimation } = useLoadingAnimation();

  const { data: owedReportData, isLoading, refetch } = useQuery({
    queryKey: ['owed-report', 'string'],
    queryFn: () => api.expense.exportOwedReport('string'),
  });

  // Support wrapped, raw, and stringified JSON responses.
  const reportPayload = parsePayload((owedReportData as any)?.data ?? owedReportData ?? {});
  const rawItems = Array.isArray((reportPayload as any)?.payables)
    ? (reportPayload as any).payables
    : Array.isArray((reportPayload as any)?.receivables)
      ? (reportPayload as any).receivables
      : [];

  const normalizedItems = rawItems.flatMap((item: any) => {
    if (Array.isArray(item?.debtors)) {
      return item.debtors.map((debtor: any) => ({
        id: `${item.type || 'debt'}-${debtor.id}`,
        name: debtor?.name || 'Unknown User',
        description: item?.activity?.name || item?.tripName || item?.trip_name || 'Receivable',
        amount: debtor?.formatted_amount || formatCurrency(Number(debtor?.amount || 0)),
        date: item?.activity?.scheduled_at || item?.fundRequest?.createdAt || '',
        type: item?.type || 'debt',
      }));
    }

    return [{
      id: item?.id || Math.random().toString(),
      name: item?.paid_to?.name || item?.name || 'Unknown User',
      description: item?.activity?.name || item?.trip_name || 'Activity payment',
      amount: item?.formatted_amount || formatCurrency(Number(item?.amount || 0)),
      date: item?.activity?.scheduled_at || item?.created_at || '',
      type: item?.type || 'debt',
      raw: item,
    }];
  });

  const formattedTotal = (reportPayload as any)?.formatted_total
    || ((reportPayload as any)?.total ? formatCurrency(Number((reportPayload as any).total)) : '$0.00');

  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  usePageFocus(() => {
    refetch();
  });

  return (
    <GeneralLayout title="To Pay">
      <View className="flex-1">
        <View className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-xl self-start mb-8">
          <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Total
          </Text>
          <Text className="text-3xl text-black dark:text-white">
            {formattedTotal}
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {normalizedItems.length === 0 && (
            <Text className="text-center text-gray-500 dark:text-gray-400 py-8">
              No owing records found.
            </Text>
          )}

          {normalizedItems.map(item => (
            <PaymentItem
              key={item.id}
              name={item.name}
              description={item.description}
              amount={item.amount}
              date={item.date}
              type={item.type}
              onPress={() => {
                const rawItem = item.raw;
                if (rawItem?.type === 'debt' && rawItem?.activity?.id) {
                    navigation.navigate(PAGES.payActivity, {
                      activityId: String(rawItem.activity.id),
                      debtId: String(rawItem.id),
                    });
                } else if (rawItem?.type === 'fund_request') {
                  navigation.navigate(PAGES.payTrip, { tripId: rawItem.trip_id, amount: rawItem.amount });
                }
              }}
            />
          ))}
        </ScrollView>

        <View className="flex-row mt-4 mb-8 gap-x-4">
          <ExportButtonComponent
            variant='text'
            exportAPI={() => api.expense.exportOwedReport('string')}
          />
          <ShareButtonComponent 
          variant='button' 
          title="Share" 
          message="Share the list of people you owe money to." 
          url="/payables"
          />
        </View>
      </View>
    </GeneralLayout>
  );
}
