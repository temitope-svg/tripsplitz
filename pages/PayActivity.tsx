import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamsList, TripParticipant } from '../utils/types';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import { formatCurrency } from '../utils/currency.util';
import useNotify from '../hooks/useNotify';
import useAnimate from '../hooks/useAnimate';
import { handleApiError } from '../utils/error.util';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { getRandomColor } from '../utils/color.util';
import { Location, Calendar } from 'iconsax-react-native';
import { formatDateRange } from '../utils/date.util';
import NotificationModal from '../components/Modals/NotificationModal';
import { ActivityDebt } from '../api/expense.requests';

type PayActivityScreenRouteProp = RouteProp<RootStackParamsList, 'payActivity'>;

interface ActivityDetails {
  id: string;
  name: string;
  cost: string;
  formatted_cost: string;
  scheduled_at: {
    date: string;
    time: string;
    full: string;
    timestamp: string;
  };
  trip: {
    id: string;
    name: string;
    participants: TripParticipant[];
    cover_image: string | null;
    start_date: string;
    end_date: string;
  };
  participants: TripParticipant[];
}

export default function PayActivity() {
  const route = useRoute<PayActivityScreenRouteProp>();
  const { showSnackBar } = useNotify();
  const { showLoading } = useAnimate();
  const navigation = useNavigation();

  const activityId = route.params.activityId;
  const debtId = route.params.debtId;

  const { data: activity, isLoading, error, refetch } = useQuery({
    queryKey: ['activity', route.params.activityId],
    queryFn: () => api.activity.getActivityById(activityId)
  });

  const { data: trip, isLoading: tripLoading, error: tripError } = useQuery({
    queryKey: ['trip', activity?.trip.id],
    queryFn: () => api.trip.getTripDetails(activity.trip.id),
    enabled: !!activity?.trip.id
  });

  const { data: activityDebts } = useQuery({
    queryKey: ['activity-debts', activityId],
    queryFn: () => api.expense.getActivityDebts(parseInt(activityId)),
    enabled: !!activityId
  });

  const owingAmount = activityDebts?.total_owing ?? 0;
  const paidAmount = activityDebts?.total_paid ?? 0;

  console.log("Debt ID", debtId);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePay = async () => {
    if (!debtId) {
      showSnackBar('Invalid debt ID', 'error');
      return;
    }

    try {
      showLoading(async () => {
        await api.expense.settleDebt(parseInt(debtId));
        setShowSuccessModal(true);
      });
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to process payment'
      });
    }
  };

  if (isLoading || !activity) {
    return (
      <GeneralLayout title="Pay">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </GeneralLayout>
    );
  }


  if (error || tripError) {
    return (
      <GeneralLayout title="Pay">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Failed to load activity details</Text>
          <ButtonComponent
            title="Retry"
            variant="text"
            onPress={() => refetch()}
          />
        </View>
      </GeneralLayout>
    );
  }

  const renderParticipant = (participant: TripParticipant) => (
    <View key={participant.id} className="items-center mr-4">
      <View className="w-10 h-10 rounded-full items-center justify-center mb-1" style={{ backgroundColor: getRandomColor() }}>
        <Text className="text-white font-semibold">{participant.name[0]}</Text>
      </View>
      <Text className="text-xs text-gray-500">{participant.name}</Text>
      <Text className="text-xs text-gray-400">
        {participant.pivot.role === 'host' ? 'Host' : participant.pivot.role === 'co-host' ? 'Co-host' : 'Buddy'}
      </Text>
    </View>
  );

  return (
    <GeneralLayout title="Pay">
      <ScrollView className="flex-1">
        {/* Cost Summary */}
        <View className="flex-row justify-between mb-8">
          <View className="items-center">
            <Text className="text-gray-500 mb-2">Activity Cost</Text>
            <Text className="text-2xl font-semibold">{activity.formatted_cost}</Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 mb-2">Paid</Text>
            <Text className="text-2xl font-semibold">{formatCurrency(paidAmount)}</Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 mb-2">Owing</Text>
            <Text className="text-2xl font-semibold">{formatCurrency(owingAmount)}</Text>
          </View>
        </View>

        {/* Activity Details */}
        <View className="bg-gray-50 p-4 rounded-xl mb-6">
          <Text className="text-gray-500 mb-2">Activity Name</Text>
          <Text className="text-xl font-semibold mb-1">{activity.name}</Text>
          <Text className="text-gray-500">{activity.scheduled_at.full}</Text>
        </View>

        {/* Trip Hosts */}
        <View className="mb-6">
          <Text className="text-gray-500 mb-3">Trip Hosted by</Text>
          <View className="flex-row">
            {trip?.data.trip.participants
              .filter(p => p.pivot.role === 'host' || p.pivot.role === 'co-host')
              .map(renderParticipant)}
          </View>
        </View>

        {/* Activity Buddies */}
        <View className="mb-6">
          <Text className="text-gray-500 mb-3">Activity Buddy</Text>
          <View className="flex-row flex-wrap">
            {trip?.data.trip.participants
              .filter(p => p.pivot.role === 'member')
              .map(renderParticipant)}
          </View>
        </View>

        {/* Trip Details */}
        <View className="mb-6">
          <Text className="text-gray-500 mb-3">Trip</Text>

          <View className="flex-col py-2">
            <View className="flex-row items-center">
              <Location
                size={20}
                className="text-black dark:text-white mr-2"
                variant="Bold"
              />
              <Text className="font-semibold text-base text-black dark:text-white">
                {trip?.data.trip.location}
              </Text>
            </View>
            <View className="flex-row items-center self-end mt-1">
              <Calendar
                size={12}
                className="text-black dark:text-white mr-1"
                variant="Bold"
              />
              <Text className="text-gray-500 dark:text-gray-400">
                {formatDateRange(trip?.data.trip.start_date, trip?.data.trip.end_date)}
              </Text>
            </View>
          </View>

          <Image
            source={{ uri: `https://picsum.photos/1100/700` }}
            className="w-full h-32 rounded-xl"
          />

        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="p-6 space-y-6">
        {owingAmount > 0 && (
          <ButtonComponent
            title="Pay"
            variant="primary"
            className="bg-green-700"
            onPress={handlePay}
          />
        )}

        <ButtonComponent
          title="Close"
          variant="text"
          className="bg-green-700"
          onPress={() => navigation.goBack()}
        />
      </View>

      <NotificationModal 
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}
      />
    </GeneralLayout>
  );
} 