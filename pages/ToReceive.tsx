import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, { useEffect } from 'react';
import {RootStackParamsList} from '../utils/types';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import api from '../api';
import GeneralLayout from '../layouts/GeneralLayout';
import {useLoadingAnimation} from '../components/LoadingAnimation';
import moment from 'moment';
import ShareButtonComponent from '../components/ShareButtonComponent';
import ExportButtonComponent from '../components/ExportButtonComponent';

type ToReceiveRouteProp = RouteProp<RootStackParamsList, 'toReceive'>;

interface PaymentItemProps {
  name: string;
  activity: string;
  amount: string;
  date: string;
  onPress?: () => void;
}

const PaymentItem: React.FC<PaymentItemProps> = ({
  name,
  activity,
  amount,
  date,
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
        <Text className="text-gray-600 dark:text-gray-400">{activity}</Text>
      </View>
      <View className="items-end">
        <Text className="text-black dark:text-white text-base font-medium">
          {amount}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">
          {moment(date).format('MMM DD')}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function ToReceive() {
  const route = useRoute<ToReceiveRouteProp>();
  const tripId = route.params?.tripId;
  const {showAnimation} = useLoadingAnimation();

  const {data: receivablesData, isLoading} = useQuery({
    queryKey: ['receivables', tripId],
    queryFn: () => api.expense.getReceivables(tripId),
  });

  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  useEffect(() => {
    console.log("RECEIVABLES DATA: ", JSON.stringify(receivablesData, null, 2));
  }, [receivablesData]);

  return (
    <GeneralLayout title="To Receive">
      <View className="flex-1">
        <View className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-xl self-start mb-8">
          <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Total
          </Text>
          <Text className="text-3xl text-black dark:text-white">
            {receivablesData?.formatted_total || '$0.00'}
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {receivablesData?.receivables.map((receivable, index) => (
            <PaymentItem
              key={index}
              name={receivable.debtors[0]?.name || ''}
              activity={receivable.type === 'debt' ? receivable.activity?.name || '' : "fund_request"}
              amount={receivable.debtors[0]?.formatted_amount || '$0.00'}
              date={receivable.type === 'debt' ? receivable.activity?.scheduled_at || '' : receivable.fundRequest?.createdAt || ''}
              onPress={() => {
                // Handle payment item press
              }}
            />
          ))}
        </ScrollView>

        <View className="flex-row mt-4 mb-8 gap-x-4">
          <ExportButtonComponent variant='text' exportAPI={api.expense.exportOwedReport} />
          <ShareButtonComponent variant='button' title="Share" message="Share the list of people you owe money to." url='/receivables' />
        </View>
      </View>
    </GeneralLayout>
  );
} 
