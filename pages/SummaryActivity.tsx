import React from 'react';
import {View, Text} from 'react-native';
import GeneralLayout from '../layouts/GeneralLayout';
import {useRoute} from '@react-navigation/native';
import ButtonComponent from '../components/ButtonComponent';
import {getRandomColor} from '../utils/color.util';
import {Calendar, Location} from 'iconsax-react-native';
import { formatCurrency } from '../utils/currency.util';
import useAppNavigation from '../hooks/useAppNavigation';
import { formatDate } from '../utils/date.util';

interface RouteParams {
  activity: {
    id: string;
    name: string;
    cost: string;
    location?: string;
    date: string;
    participants: Array<{
      name: string;
      initials: string;
    }>;
    addedBy?: string; // The person who added the user
  };
}

interface MemberCircleProps {
  initial: string;
  name: string;
}

const MemberCircle: React.FC<MemberCircleProps> = ({initial, name}) => (
  <View className="items-center mr-4 mb-4">
    <View
      className="w-12 h-12 rounded-full items-center justify-center mb-1"
      style={{backgroundColor: getRandomColor()}}>
      <Text className="text-lg text-white">{initial}</Text>
    </View>
    <Text className="text-sm text-gray-600">{name.split(' ')[0]}</Text>
  </View>
);

export default function SummaryActivity() {
  const route = useRoute();
  const {activity} = route.params as RouteParams;
  const navigation = useAppNavigation();

  console.log("VVCCCC: ",activity);

  return (
    <GeneralLayout title="Activity">
      <View className="flex-1">
        {activity.addedBy && (
          <Text className="text-xl mb-6">
            {activity.addedBy} added you to this activity
          </Text>
        )}

        <View className="flex-row items-center mb-4 bg-[#F8F9FA] p-3 rounded-lg self-start">
          {activity.location && (
            <>
              <Location size={20} className="mr-2" />
              <Text className="text-base mr-4">{activity.location}</Text>
            </>
          )}
          <Calendar size={14} className="mr-2" />
          <Text className="text-xs">
            {formatDate(activity.date, 'MMM D')} - {formatDate(activity.date, 'Y')}  / {formatDate(activity.date, 'h:mm a')}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base text-gray-600 mb-1">Activity Name</Text>
          <Text className="text-2xl bg-[#F8F9FA] p-3 rounded-lg">{activity.name}</Text>
        </View>

        <View className="mb-8">
          <Text className="text-base text-gray-600 mb-1">Price</Text>
          <Text className="text-2xl  bg-[#F8F9FA] p-3 rounded-lg self-start">{formatCurrency(activity.cost)}</Text>
        </View>

        <Text className="text-base text-gray-600 mb-4 font-semibold">Activity Members</Text>
        <View className="flex-row flex-wrap">
          {activity.participants.map((participant, index) => (
            <MemberCircle
              key={index}
              initial={participant.name.split(' ')[0][0]}
              name={participant.name}
            />
          ))}
        </View>

        <View className="mt-auto">
          <ButtonComponent
            variant="primary"
            title="Close"
            onPress={() => navigation.goBack()}
            className="mb-4"
          />
        </View>
      </View>
    </GeneralLayout>
  );
} 