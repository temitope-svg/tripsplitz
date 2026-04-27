import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ActivityCard } from './ActivityCard';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import Feather from 'react-native-vector-icons/Feather';

export interface Activity {
  id: number;
  tripId: number;
  name: string;
  description: string | null;
  cost: number;
  location: string | null;
  scheduledDate: string | null;
  receiptImageUrl: string | null;
  categoryId: number | null;
  category?: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  participants?: Array<{
    id: number;
    activityId: number;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      profileImageUrl: string | null;
    };
    status: number;
    amount: number | null;
    isPayer: boolean;
    notes: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ActivitiesSectionProps {
  activities: Activity[];
  onAddActivity?: () => void;
  onBuddiesView?: () => void;
  showDate?: boolean;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  activities,
  onAddActivity,
  onBuddiesView,
  showDate = true
}) => {
  const navigation = useAppNavigation();

  const onActivityPress = (activity: Activity) => {
    navigation.navigate(PAGES.activity, { activity });
  };

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-black dark:text-white">{activities.length} Activities</Text>

        <View className="flex-row gap-x-2">
          <TouchableOpacity  onPress={onAddActivity} className=" gap-x-2 items-center flex-col">
            <View
              className="rounded-full w-10 h-10 justify-center items-center bg-green-900 dark:bg-green-700"
            >
              <Feather
                name="file-plus"
                size={14}
                color="#FFFFFF"
              />
            </View>
            <Text className="text-[11px] mt-1 font-light text-black dark:text-white">Add Activity</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBuddiesView} className=" gap-x-2 items-center flex-col">
            <View
              className="rounded-full w-10 h-10 justify-center items-center bg-green-900 dark:bg-green-700"
            >
              <Feather
                name="users"
                size={14}
                color="#FFFFFF"
              />
            </View>
            <Text className="text-[11px] mt-1 font-light text-black dark:text-white">View Buddies</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <ScrollView className="space-y-3 mt-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              name={activity.name}
              description={activity.description || ''}
              location={activity.location || ''}
              startDate={activity.scheduledDate || activity.createdAt}
              budget={activity.cost.toString()}
              category={activity.category?.name}
              participants={activity.participants?.map(p => p.user?.fullName || p.user?.firstName || 'Unknown').filter(Boolean) || []}
              onPress={() => onActivityPress(activity)}
              showDate={showDate}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
