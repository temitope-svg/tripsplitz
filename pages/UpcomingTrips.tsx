import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import api from '../api';
import {PAGES} from '../utils/pages';
import useNotify from '../hooks/useNotify';
import {handleApiError} from '../utils/error.util';
import useAppNavigation from '../hooks/useAppNavigation';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {TripCard} from '../components/TripCard';

export default function UpcomingTrips() {
  const appNavigation = useAppNavigation();
  const navigation = useNavigation();
  const {showSnackBar} = useNotify();

  const {data: tripsData, isLoading, error} = useQuery({
    queryKey: ['upcomingTrips'],
    queryFn: api.trip.getUpcomingTrips,
    onError: (err: any) => {
      handleApiError(err, showSnackBar, {
        defaultMessage: 'Failed to fetch trips'
      });
    }
  });

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = moment(startDate).format('MMM Do');
    const end = moment(endDate).format('MMM Do / YYYY');
    return `${start} - ${end}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      );
    }

    if (error || !tripsData?.data) {
      return (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-600 text-center">
            Unable to load trips. Please try again later.
          </Text>
        </View>
      );
    }

    if (tripsData.data.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-600 text-center">
            You don't have any upcoming trips yet.
          </Text>
        </View>
      );
    }

    return (
      <>
        {tripsData.data.map((trip: any) => (
          <TripCard 
            name={trip.name}
            key={trip.id}
            location={trip.location}
            dateRange={formatDateRange(trip.startDate, trip.endDate)}
            imageUrl={trip.imageUrl}
            expense={String(trip.budget ?? 0)}
            activities={trip.activities?.length ?? 0}
            participants={(trip.participants ?? []).map((p: any) => {
              const fullName = p?.user?.fullName || p?.name || 'Unknown';
              const initials = fullName
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part: string) => part[0]?.toUpperCase() || '')
                .join('') || '?';

              return {
                name: fullName,
                initials,
              };
            })}
            onPress={() => {
              console.log("Trip ID", trip.id);
              appNavigation.navigate(PAGES.tripDetails, { tripId: trip.id })
            }}
          />
        ))}
      </>
    );
  };

  return (
    <GeneralLayout title="Upcoming Trips">
      <View className="flex-1">
        <ScrollView className="flex-1">
          {renderContent()}
        </ScrollView>

        <View className="px-4 mb-6">
          <ButtonComponent
            title="Close"
            variant="primary"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </GeneralLayout>
  );
}
