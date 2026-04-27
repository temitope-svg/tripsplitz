import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import GeneralLayout from '../layouts/GeneralLayout';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useLoadingAnimation } from '../components/LoadingAnimation';
import moment from 'moment';
import { TripCard } from '../components/TripCard';

export default function AllTrips() {
  const navigation = useAppNavigation();
  const { showAnimation, hideAnimation } = useLoadingAnimation();

  const { data: tripsData, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => api.trip.getAllTrips(),
    onSettled: () => {
      hideAnimation();
    },
  });
  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = moment(startDate).format('MMM Do');
    const end = moment(endDate).format('MMM Do / YYYY');
    return `${start} - ${end}`;
  };

  return (
    <GeneralLayout title="All Trips">
      <ScrollView className="flex-1">
        {tripsData?.data?.currentTrips && tripsData.data.currentTrips.length > 0 ? (
          <View className="mt-3">
            <Text className="font-semibold text-lg pt-6 pl-6 mb-3 text-black dark:text-white">
              Current Trip
            </Text>
            {tripsData.data.currentTrips.map((trip) => (
              <TripCard
                name={trip.name}
                key={trip.id}
                location={trip.location}
                dateRange={formatDateRange(trip.startDate, trip.endDate)}
                imageUrl={trip.imageUrl}
                expense={trip.budget}
                activities={trip.activities?.length || 0}
                participants={trip.participants?.map(p => ({
                  name: p.user?.fullName || p.user?.firstName || 'Unknown',
                  initials: (p.user?.fullName || p.user?.firstName || '?')[0] || '?'
                })) || []}
                onPress={() => navigation.navigate(PAGES.tripDetails, { tripId: trip.id })}
              />
            ))}
          </View>
        ) : null}

        {tripsData?.data?.pastTrips && tripsData.data.pastTrips.length > 0 ? (
          <>
            <Text className="font-semibold text-lg pt-6 pl-6 mb-3 text-black dark:text-white">
              Past Trips
            </Text>
            {tripsData.data.pastTrips.map((trip) => (
              <TripCard
                name={trip.name}
                key={trip.id}
                location={trip.location}
                dateRange={formatDateRange(trip.startDate, trip.endDate)}
                imageUrl={trip.imageUrl}
                expense={trip.budget}
                activities={trip.activities?.length || 0}
                participants={trip.participants?.map(p => ({
                  name: p.user?.fullName || p.user?.firstName || 'Unknown',
                  initials: (p.user?.fullName || p.user?.firstName || '?')[0] || '?'
                })) || []}
                onPress={() => navigation.navigate(PAGES.tripDetails, { tripId: trip.id })}
              />
            ))}
          </>
        ) : null}

        {(!tripsData?.data?.currentTrips || tripsData.data.currentTrips.length === 0) && 
         (!tripsData?.data?.pastTrips || tripsData.data.pastTrips.length === 0) && (
          <View className="px-6 py-8">
            <Text className="text-center text-gray-500 dark:text-gray-400">
              No trips found
            </Text>
          </View>
        )}

        <TouchableOpacity
          className="bg-green-700 py-3 mx-4 rounded-2xl mb-6 mt-8"
          onPress={() => navigation.goBack()}>
          <Text className="text-white text-center font-semibold text-base">
            Close
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </GeneralLayout>
  );
}
