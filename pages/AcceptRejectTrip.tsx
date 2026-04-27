import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TripParticipant } from '../utils/types';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import { formatCurrency } from '../utils/currency.util';
import useNotify from '../hooks/useNotify';
import useAnimate from '../hooks/useAnimate';
import { handleApiError } from '../utils/error.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import { getRandomColor } from '../utils/color.util';
import { Location, Calendar } from 'iconsax-react-native';
import { formatDateRange } from '../utils/date.util';
import NotificationModal from '../components/Modals/NotificationModal';
import { getTripImageUrl } from '../utils/image.util';
import RejectionReasonModal from '../components/Modals/RejectionReasonModal';


export default function AcceptRejectTrip() {
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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  console.log("Trip", tripId);

  const updateTripInvitationMutation = useMutation({
    mutationFn: (data: { action: 'accept' | 'reject', rejection_reason?: string }) => api.trip.respondToTripInvitation(parseInt(tripId!), data),
  });


  const handleUpdateTripInvitation = async (action: 'accept' | 'reject', rejection_reason?: string) => {
    try {
      await updateTripInvitationMutation.mutateAsync({ action, rejection_reason });
      setShowSuccessModal(true);
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'An error occurred while updating the trip invitation'
      });
    }
  }

  useEffect(() => {
    console.log("Tripkkk: ", trip);
  }, [trip]);

  if (tripLoading) {
    return (
      <GeneralLayout title="Trip Invitation">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </GeneralLayout>
    );
  }

  if (tripError) {
    return (
      <GeneralLayout title="Trip Invitation">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Failed to load trip details</Text>
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
    <GeneralLayout title="Trip Invitation">
      <ScrollView className="flex-1">
        {/* Cost Summary */}
        <View className="flex-row justify-between mb-8">
          <View className="items-center">
            <Text className="text-gray-500 mb-2">Trip Budget</Text>
            <Text className="text-2xl font-semibold">{formatCurrency(trip?.data.trip.budget!)}</Text>
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
            source={{ uri: getTripImageUrl(trip?.data.trip.trip_image) }}
            className="w-full h-32 rounded-xl"
          />
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
          <Text className="text-gray-500 mb-3">Buddies</Text>
          <View className="flex-row flex-wrap">
            {trip?.data.trip.participants
              .filter(p => p.pivot.role === 'member')
              .map(renderParticipant)}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-500 mb-3 text-base">{forConfirmation ? "Paid" : "You are to contribute"}</Text>
          <Text className="text-2xl font-semibold">{formatCurrency(amount!)}</Text>
        </View>


      </ScrollView>

      <View className="p-6 space-y-6">


        {trip?.data.is_pending_invitation && <View className="flex-row justify-between gap-x-8 mb-6">
          <ButtonComponent
            title="Accept"
            variant="primary"
            className="bg-green-700 flex-1"
            isLoading={updateTripInvitationMutation.isPending}
            disabled={updateTripInvitationMutation.isPending}
            onPress={() => handleUpdateTripInvitation('accept')}
          />

          <ButtonComponent
            title="Reject"
            variant="primary"
            className="bg-transparent border border-red-500 text-red-500 flex-1"
            labelClassName="!text-red-500"
            isLoading={updateTripInvitationMutation.isPending}
            disabled={updateTripInvitationMutation.isPending}
            onPress={() => setShowRejectionModal(true)}
          />
        </View>}

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

      <RejectionReasonModal
        visible={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSubmit={(reason) => {
          handleUpdateTripInvitation('reject', reason);
          setShowRejectionModal(false);
        }}
        isLoading={updateTripInvitationMutation.isPending}
      />
    </GeneralLayout>
  );
} 