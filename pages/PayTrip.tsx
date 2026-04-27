import React, { useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
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
import { getTripImageUrl } from '../utils/image.util';

interface RawTripParticipant {
  id: number;
  name?: string;
  display_name?: string | null;
  email?: string;
  profile_image?: string | null;
  initials?: string;
  pivot?: {
    role?: string;
    status?: number;
  };
  isHost?: boolean;
  isCoHost?: boolean;
  user?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImageUrl?: string | null;
  };
}

type NormalizedTripParticipant = {
  id: number;
  name: string;
  role: 'host' | 'co-host' | 'member';
};

export default function PayActivity() {
  const route = useRoute();
  const { showSnackBar } = useNotify();
  const { showLoading } = useAnimate();
  const navigation = useNavigation();

  const tripId = route.params?.tripId;
  const amount = route.params?.amount;
  const forConfirmation = route.params?.forConfirmation;
  const fundRequestId = route.params?.fundRequestId;
  const { data: trip, isLoading: tripLoading, error: tripError, refetch } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => api.trip.getTripDetails(parseInt(tripId!)),
    enabled: !!tripId
  });

  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ['paymentMethods', tripId],
    queryFn: () => api.trip.getPaymentMethods(parseInt(tripId!)),
    enabled: !!tripId
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  console.log("Trip", tripId);

  const tripDetails = trip?.data?.trip;
  const paymentMethodsList = Array.isArray(paymentMethods?.data) ? paymentMethods.data : [];

  const getTripDateRange = () => {
    const startDate = tripDetails?.startDate ?? tripDetails?.start_date;
    const endDate = tripDetails?.endDate ?? tripDetails?.end_date;

    if (!startDate || !endDate) {
      return '';
    }

    return formatDateRange(startDate, endDate);
  };

  const normalizedParticipants: NormalizedTripParticipant[] = (tripDetails?.participants ?? []).map(
    (participant: RawTripParticipant) => {
      const participantName =
        participant.name ||
        participant.display_name ||
        participant.user?.fullName ||
        [participant.user?.firstName, participant.user?.lastName]
          .filter(Boolean)
          .join(' ')
          .trim() ||
        'Unknown';

      let role: NormalizedTripParticipant['role'] = 'member';

      if (participant.pivot?.role === 'host' || participant.isHost) {
        role = 'host';
      } else if (participant.pivot?.role === 'co-host' || participant.isCoHost) {
        role = 'co-host';
      }

      return {
        id: participant.id,
        name: participantName,
        role,
      };
    }
  );

  const handlePay = async () => {
    if (!tripId) {
      showSnackBar('Invalid trip ID', 'error');
      return;
    }

    try {
      showLoading(async () => {
        await api.trip.payTrip(parseInt(tripId));
        setShowSuccessModal(true);
      });
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to process payment'
      });
    }
  };

  const handleConfirmPayment = async () => {
    if (!tripId) {
      showSnackBar('Invalid trip ID', 'error');
      return;
    }
    try {
      showLoading(async () => {
        await api.trip.confirmPayment(parseInt(tripId), parseInt(fundRequestId!));
        setShowSuccessModal(true);
      });
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to confirm payment'
      });
    };
  }

  if (tripLoading) {
    return (
      <GeneralLayout title="Pay">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </GeneralLayout>
    );
  }

  if (tripError) {
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

  const renderNormalizedParticipant = (participant: NormalizedTripParticipant) => (
    <View key={participant.id} className="items-center mr-4">
      <View className="w-10 h-10 rounded-full items-center justify-center mb-1" style={{ backgroundColor: getRandomColor() }}>
        <Text className="text-white font-semibold">{participant.name[0]}</Text>
      </View>
      <Text className="text-xs text-gray-500">{participant.name}</Text>
      <Text className="text-xs text-gray-400">
        {participant.role === 'host' ? 'Host' : participant.role === 'co-host' ? 'Co-host' : 'Buddy'}
      </Text>
    </View>
  );

  const renderPaymentMethod = (method: any) => (
    <View key={method.id} className="flex-row items-center mb-4 p-4 border border-gray-200 rounded-lg w-full">
      <View className="flex-1">
        <Text className="font-semibold text-base">{method.method_name}</Text>
        <Text className="text-gray-500">{method.account_details}</Text>
      </View>
    </View>
  );

  return (
    <GeneralLayout title="Fund Trip">
      <ScrollView className="flex-1">
        {/* Cost Summary */}
        <View className="flex-row justify-between mb-8">
          <View className="items-center">
            <Text className="text-gray-500 mb-2">Trip Budget</Text>
            <Text className="text-2xl font-semibold">{formatCurrency(tripDetails?.budget ?? 0)}</Text>
          </View>
        </View>

        {/* Trip Details */}
        <View className="mb-6">
          <View className="flex-col py-2">
            <View className="flex-row items-center">
              <Location
                size={20}
                className="text-black dark:text-white mr-2"
                variant="Bold"
              />
              <Text className="font-semibold text-base text-black dark:text-white">
                {tripDetails?.location}
              </Text>
            </View>
            <View className="flex-row items-center self-end mt-1">
              <Calendar
                size={12}
                className="text-black dark:text-white mr-1"
                variant="Bold"
              />
              <Text className="text-gray-500 dark:text-gray-400">
                {getTripDateRange()}
              </Text>
            </View>
          </View>

          <Image
            source={{ uri: getTripImageUrl(tripDetails?.imageUrl ?? tripDetails?.trip_image ?? '') }}
            className="w-full h-32 rounded-xl"
          />
        </View>

        {/* Trip Hosts */}
        <View className="mb-6">
          <Text className="text-gray-500 mb-3">Trip Hosted by</Text>
          <View className="flex-row">
            {normalizedParticipants
              .filter(participant => participant.role === 'host' || participant.role === 'co-host')
              .map(renderNormalizedParticipant)}
          </View>
        </View>

        {/* Activity Buddies */}
        <View className="mb-6">
          <Text className="text-gray-500 mb-3">Activity Buddy</Text>
          <View className="flex-row flex-wrap">
            {normalizedParticipants
              .filter(participant => participant.role === 'member')
              .map(renderNormalizedParticipant)}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-500 mb-3 text-base">{forConfirmation ? "Paid" : "You are to contribute"}</Text>
          <Text className="text-2xl font-semibold">{formatCurrency(amount!)}</Text>
        </View>

        <View>
          <Text className="text-gray-500 mb-3 text-base">{forConfirmation ? "Payment made to" : "Pay to"}</Text>
          <View className="flex-col w-full">
            {methodsLoading ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : paymentMethodsList.length ? (
              paymentMethodsList.map(renderPaymentMethod)
            ) : (
              <Text className="text-gray-500">No payment methods available</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="p-6 space-y-6">
        <ButtonComponent
          title={forConfirmation ? "Confirm Payment" : "I've paid"}
          variant="primary"
          className="bg-green-700"
          onPress={forConfirmation ? handleConfirmPayment : handlePay}
          disabled={methodsLoading || !paymentMethodsList.length}
        />

        <ButtonComponent
          title="Close"
          variant="text"
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
