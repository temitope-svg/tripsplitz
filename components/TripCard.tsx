import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Share, Location, Calendar } from 'iconsax-react-native';
import { getRandomColor } from '../utils/color.util';
import { formatCurrency } from '../utils/currency.util';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { getTripImageUrl } from '../utils/image.util';
import { useColorScheme } from 'nativewind';

interface TripCardProps {
  name: string;
  location: string;
  dateRange: string;
  imageUrl?: string;
  expense: string;
  activities: number;
  participants: Array<{
    name: string;
    initials: string;
  }>;
  onPress: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  name,
  location,
  dateRange,
  imageUrl,
  expense,
  activities,
  participants,
  onPress,
}) => {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#DDE2E5' : '#878F96';

  return (
    <TouchableOpacity className="w-full mb-8" onPress={onPress}>
      <View className="flex-col py-2">
        <View className="flex-row items-center">
          <Text className="font-semibold text-lg text-black dark:text-white mb-2">
            {name}
          </Text>
        </View>

        <View className='flex-row justify-between'>
          <View className="flex-row items-center ">
            <Location
              size={12}
              color={iconColor}
              variant="Bold"
            />
            <Text className="text-gray-500 dark:text-gray-400">
              {location}
            </Text>
          </View>

          <View className="flex-row items-center ">
            <Calendar
              size={12}
              color={iconColor}
              variant="Bold"
            />
            <Text className="text-gray-500 dark:text-gray-400">
              {dateRange}
            </Text>
          </View>
        </View>
      </View>

      <Image
        source={{ uri: getTripImageUrl(imageUrl) }}
        className="w-full h-32 rounded-xl"
      />

      <View className="flex-row mt-4 justify-between gap-x-2">
        <View className="flex-row rounded-2xl p-4 bg-gray-200 dark:bg-gray-700">
          <View className="mr-2">
            <Text className="text-gray-600 dark:text-gray-300">Your Expense</Text>
            <Text className="font-semibold text-base text-black dark:text-white">
              {formatCurrency(expense)}
            </Text>
          </View>
          <View>
            <Text className="text-gray-600 dark:text-gray-300">Activities</Text>
            <Text className="font-semibold text-base text-black dark:text-white">
              {activities}
            </Text>
          </View>
        </View>

        <View className="flex-row items-end bg-gray-200 dark:bg-gray-700 px-3 py-3 rounded-2xl">
          <View>
            <Text className="text-gray-600 dark:text-gray-300">Members</Text>
            <View className="flex-row pt-2 ml-2">
              {participants.map((participant, index) => (
                <View
                  key={index}
                  className={`rounded-full w-7 h-7 justify-center items-center -ml-3`}
                  style={{
                    backgroundColor: getRandomColor(),
                    zIndex: participants.length - index,
                  }}>
                  <Text className="text-sm font-semibold text-black dark:text-white">
                    {participant.initials}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity className="rounded-full w-9 h-9 justify-center items-center bg-green-900 dark:bg-green-700 ml-2">
            <Fontisto
              name="share"
              size={14}
              color="#FFF"
              className="text-white dark:text-white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
