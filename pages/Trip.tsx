import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../utils/types';
import { ActivitiesSection } from '../components/Activities';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import useNotify from '../hooks/useNotify';
import { handleApiError } from '../utils/error.util';
import { InviteBuddyModal } from '../components/Modals/InviteBuddyModal';
import { Activity } from '../components/Activities';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';
import { formatDateRange } from '../utils/date.util';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import { getRandomColor } from '../utils/color.util';
import { formatCurrency } from '../utils/currency.util';
import ShareButtonComponent from '../components/ShareButtonComponent';
import { usePageFocus } from '../hooks/usePageFocus';
import { getTripImageUrl } from '../utils/image.util';
import { useColorScheme } from 'nativewind';  

type TripScreenRouteProp = RouteProp<RootStackParamsList, 'tripDetails'>;

export default function Trip() {
  const appNavigation = useAppNavigation();
  const { showSnackBar } = useNotify();

  const [showInviteModal, setShowInviteModal] = useState(false);

  const route = useRoute<TripScreenRouteProp>();
  const tripId = (route.params as any)?.tripId;

  const { data: tripData, isLoading, refetch } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => api.trip.getTripDetails(tripId!),
    enabled: !!tripId,
  });

  const {colorScheme} = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#DDE2E5' : '#878F96';
  usePageFocus(() => {
    refetch();
  });

  const handleActivityPress = (activity: Activity) => {
    console.log('Activity pressed:', activity);
  };

  const handleAddActivity = () => {
    if (trip) {
      appNavigation.navigate(PAGES.addActivity, { tripId: trip.id });
    }
  };

  const handleInviteBuddies = async (emails: string[]) => {
    try {
      // Loop through each email and invite one by one
      for (const email of emails) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('role', 'member');

        // Send invitation for each email
        await api.trip.addParticipants(tripId, formData);
        console.log(`Invited buddy: ${email}`);
      }

      showSnackBar('Buddies invited successfully!', 'success');
      setShowInviteModal(false);
      refetch();
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to invite buddies'
      });
    }
  };


  const handleBuddiesView = () => {
    if (trip) {
      appNavigation.navigate(PAGES.buddies, {
        tripId: tripId,
        location: trip.location
      });
    }
  };

  const handleEditTrip = () => {
    if (trip) {
      appNavigation.navigate(PAGES.editTrip, {
        tripId: trip.id,
        tripData: {
          name: trip.name,
          location: trip.location,
          budget: trip.budget,
          currency: trip.currency,
          start_date: trip.startDate,
          end_date: trip.endDate,
          trip_image: trip.imageUrl,
          participants: trip.participants
        }
      });
    }
  };

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

  const handleExportStatement = async () => {
    try {
      await exportTripStatementMutation.mutateAsync();
      showSnackBar("Export successful, Please check your email", "success");
    } catch (error) {
      handleApiError("Failed to export statement", showSnackBar, {
        defaultMessage: "Failed to export statement"
      });
    }
  }


  if (isLoading) {
    return (
      <GeneralLayout title="">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </GeneralLayout>
    );
  }

  if (!tripData || !tripData.data) return null;

  const trip = tripData.data.trip;
  const expensesSummary = tripData.data.expensesSummary;



  return (
    <GeneralLayout title={trip.location}>
      <View className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-row mt-4 gap-x-2">
            <TouchableOpacity
              onPress={() => appNavigation.navigate(PAGES.totalExpense, { tripId })}
              className="bg-[#F8F9FA] dark:bg-[#54585C] px-3 py-3 rounded-xl"
            >
              <Text className="text-xs text-black dark:text-white font-light">Your Expense</Text>
              <Text className="text-lg font-medium text-black dark:text-white">
                {formatCurrency(expensesSummary?.yourExpenses || 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => appNavigation.navigate(PAGES.toReceive, { tripId })}
              className="bg-[#F8F9FA] dark:bg-[#54585C] px-3 py-3 rounded-xl"
            >
              <Text className="text-xs text-black dark:text-white font-light">Owe You</Text>
              <Text className="text-lg font-medium text-black dark:text-white">
                {formatCurrency(expensesSummary?.owedToYou || 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => appNavigation.navigate(PAGES.toPay, { tripId })}
              className="bg-[#F8F9FA] dark:bg-[#54585C] px-3 py-3 rounded-xl"
            >
              <Text className="text-xs text-black dark:text-white font-light">Owing</Text>
              <Text className="text-lg font-medium text-black dark:text-white">
                {formatCurrency(expensesSummary?.youOwe || 0)}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <View className="flex-row justify-between gap-x-3 py-2 mt-5">
              <View className="flex-row items-center">
                <AntDesign
                  name="calendar"
                  size={16}
                  color={iconColor}
                />
                <Text className="pl-3 text-black dark:text-white text-xs font-light">
                  {formatDateRange(trip.startDate, trip.endDate)}
                </Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <TouchableOpacity 
                  className="flex-row items-center gap-x-1" 
                  onPress={handleExportStatement}
                  disabled={exportTripStatementMutation.isPending}
                  style={{ opacity: exportTripStatementMutation.isPending ? 0.5 : 1 }}
                >
                  <View className="bg-[#F8F9FA] rounded-full w-7 h-7  justify-center items-center">
                    {exportTripStatementMutation.isPending ? (
                      <ActivityIndicator size="small" color="#14532d" />
                    ) : (
                      <FontAwesome5
                        name="sim-card"
                        size={15}
                        color="#14532d"
                      />
                    )}
                  </View>
                  <Text className="text-xs text-black dark:text-white">
                    {exportTripStatementMutation.isPending ? 'Exporting...' : 'Export Stats'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center gap-x-1" onPress={handleEditTrip}>
                  <View className="bg-[#F8F9FA] rounded-full w-7 h-7  justify-center items-center">
                    <FontAwesome5
                      name="edit"
                      size={15}
                      color="#14532d"
                    />
                  </View>
                  <Text className="text-xs text-black dark:text-white">Edit Trip</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Image
                source={{ uri: getTripImageUrl(trip.imageUrl || '') }}
                className="w-full h-32 rounded-xl"
              />
              <View className="flex-row gap-x-1 items-center mt-12 justify-between ">
                <View className="">
                  <Text className="text-black dark:text-white">Trip Members</Text>
                  <View className="flex-row pt-2 ml-2">
                    {trip.participants?.map((participant, index) => (
                      <View
                        key={participant.id || index}
                        className={`rounded-full w-8 h-8 justify-center items-center -ml-2`}
                        style={{
                          backgroundColor: getRandomColor(),
                          zIndex: (trip.participants?.length || 0) - index,
                        }}>
                        <Text className="text-sm font-semibold text-white dark:text-white">
                          {participant.user?.fullName?.[0] || participant.user?.firstName?.[0] || '?'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="flex-row gap-x-3">
                  <ShareButtonComponent title='Share Trip' message={`Check out this trip to ${trip.location}!`} url={`/trip/${tripId}`} />
                  <TouchableOpacity className="items-center"
                    onPress={() => setShowInviteModal(true)}
                  >
                    <View
                      className="rounded-full w-10 h-10 justify-center items-center bg-green-900 dark:bg-[#54585C]"
                    >
                      <FontAwesome5
                        name="user-plus"
                        size={14}
                        style={{
                          color: '#FFF'
                        }}
                      />
                    </View>
                    {/* <Text className="text-black dark:text-white text-xs">Invite to Trip</Text> */}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mt-6">

                <Text className="text-black dark:text-white">Trip Hosted By</Text>
                <View className="flex-row gap-x-2 mt-2">
                  {trip.participants
                    ?.filter(p => p.isHost || p.isCoHost)
                    .map(host => (
                      <View key={host.id || host.userId} className="items-center">
                        <View className="rounded-full w-14 h-14 justify-center items-center" style={{ backgroundColor: getRandomColor() }}>
                          <Text className="text-xl font-semibold text-white">
                            {host.user?.fullName?.[0] || host.user?.firstName?.[0] || '?'}
                          </Text>
                        </View>
                        <Text className="text-sm mt-1 text-black dark:text-white">{host.user?.fullName || host.user?.firstName || 'Unknown'}</Text>
                        <Text className="text-xs text-black dark:text-white">{host.isHost ? 'host' : 'co-host'}</Text>
                      </View>
                    ))}
                </View>
              </View>

              <View className="mt-6">
                <ActivitiesSection
                  activities={trip.activities}
                  onActivityPress={handleActivityPress}
                  onAddActivity={handleAddActivity}
                  onBuddiesView={handleBuddiesView}
                  showDate={false}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="px-4 mb-6">
          <ButtonComponent
            title="Close"
            variant="text"
            onPress={() => navigation.goBack()}
          />
        </View>

        <InviteBuddyModal
          visible={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteBuddies}
        />
      </View>
    </GeneralLayout>
  );
}
