import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import GeneralLayout from '../layouts/GeneralLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useLoadingAnimation } from '../components/LoadingAnimation';
import { useRoute } from '@react-navigation/native';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import { useAppSelector } from '../store/hooks';
import BuddyItem, { BuddyStats } from '../components/BuddyItem';



export default function Buddies() {
  const route = useRoute();
  const { tripId, location } = route.params as { tripId: number; location?: string };
  const { showAnimation } = useLoadingAnimation();
  const navigation = useAppNavigation();
  const { loggedInUser } = useAppSelector(state => state.user);
  const userData = loggedInUser?.user;

  // Get trip activities
  const { data: activities, isLoading } = useQuery({
    queryKey: ['trip-activities', tripId],
    queryFn: () => api.activity.getActivitiesByTripId(tripId),
  });

  // Get trip details to get participants
  const { data: tripDetails } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => api.trip.getTripDetails(tripId),
  });
  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  const getBuddyStats = () => {
    if (!tripDetails?.data?.trip?.participants) return [];
    if (!activities) return [];

    const buddyMap = new Map<string, BuddyStats>();

    // Process participants - use userId as key since id might be 0
    const participants = tripDetails.data.trip.participants || [];
    if (!Array.isArray(participants)) return [];

    participants.forEach(participant => {
      const userId = participant.userId || participant.user?.id;
      if (userId && !buddyMap.has(userId)) {
        buddyMap.set(userId, {
          name: participant.user?.fullName || participant.user?.firstName || 'Unknown',
          profileImage: participant.user?.profileImageUrl || null,
          mutualTrips: 1, // Current trip
          mutualActivities: 0,
          id: userId
        });
      }
    });
    // Count activities per participant
    // Activities API returns array directly (requestWrapper extracts res.data from axios)
    // The .NET API returns List<ActivityDto> directly, so after requestWrapper, activities is the array
    const activitiesList = Array.isArray(activities) 
      ? activities 
      : (activities && typeof activities === 'object' && 'data' in activities && Array.isArray(activities.data))
        ? activities.data
        : [];
    
    if (Array.isArray(activitiesList) && activitiesList.length > 0) {
      activitiesList.forEach((activity: any) => {
        // Check if activity has participants array
        const activityParticipants = activity.participants || activity.activityParticipants || [];
        if (Array.isArray(activityParticipants)) {
          activityParticipants.forEach((participant: any) => {
            // Handle different participant structures
            const userId = participant.userId || participant.user?.id || participant.id?.toString();
            if (userId) {
              const stats = buddyMap.get(userId);
              if (stats) {
                stats.mutualActivities++;
                buddyMap.set(userId, stats);
              }
            }
          });
        }
      });
    }

    return Array.from(buddyMap.values());
  };

  const buddyStats = getBuddyStats();

  const onBuddyPress = (userId: number) => {
    navigation.navigate(PAGES.statement, {
      tripId,
      userId
    });
  };

  const isHostOrCoHost = (userId: string | undefined) => {
    if (!userId || !tripDetails?.data?.trip?.participants) return false;
    const hostAndCoHostIds = tripDetails.data.trip.participants
      .filter(p => p.isHost || p.isCoHost)
      .map(participant => participant.userId || participant.user?.id)
      .filter(Boolean);
    return hostAndCoHostIds.includes(userId);
  }

  return (
    <GeneralLayout title={location ? `${location} Buddies` : 'Buddies'}>
      <ScrollView className="flex-1">
        {buddyStats.map((buddy, index) => (
          <BuddyItem
            key={index}
            name={buddy.name}
            profileImage={buddy.profileImage}
            mutualTrips={buddy.mutualTrips}
            mutualActivities={buddy.mutualActivities}
            id={buddy.id}
            onPress={() => isHostOrCoHost(userData?.id) ? onBuddyPress(Number(buddy.id)) : undefined}
            isHostOrCoHost={isHostOrCoHost(userData?.id || undefined)}
          />
        ))}
      </ScrollView>
    </GeneralLayout>
  );
} 
