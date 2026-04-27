import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import useAppNavigation from '../hooks/useAppNavigation';
import {PAGES} from '../utils/pages';
import { getRandomColor } from '../utils/color.util';
interface PastTripCardProps {
  destination: string;
  dateRange: string;
  imageSource: any;
  expense: number;
  activities: number;
  buddies: string[];
}


export const PastTripCard: React.FC<PastTripCardProps> = ({
  destination,
  dateRange,
  imageSource,
  expense,
  activities,
  buddies,
}) => {
  const appNavigation = useAppNavigation();
  return (
    <TouchableOpacity
      className="px-5 w-full mb-8 opacity-80 border-b border-gray-100 pb-5"
      onPress={() => appNavigation.navigate(PAGES.allExpense)}>
      <View className="flex-row gap-x-5 py-2">
        <View className="flex-row items-center">
          <Image
            source={require('../assets/pin.png')}
            className="tint-black dark:tint-white grayscale"
          />
          <Text className="font-semibold text-lg ml-2 text-gray-500 dark:text-gray-400">
            {destination}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Image
            source={require('../assets/calendar.png')}
            className="tint-black dark:tint-white grayscale"
          />
          <Text className="pl-3 text-gray-400 dark:text-gray-500">
            {dateRange}
          </Text>
        </View>
      </View>
      <Image
        source={imageSource}
        className="w-full h-32 rounded-xl grayscale opacity-80"
      />
      <View className="flex-row mt-4 justify-between gap-x-2">
        <View className="flex-row rounded-2xl p-3 bg-gray-300 dark:bg-gray-800">
          <View className="mr-2">
            <Text className="text-gray-500 dark:text-gray-400">
              Your Expense
            </Text>
            <Text className="font-semibold text-lg text-gray-600 dark:text-gray-300">
              ${expense}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 dark:text-gray-400">Activities</Text>
            <Text className="font-semibold text-lg text-gray-600 dark:text-gray-300">
              {activities}
            </Text>
          </View>
        </View>
        <View className="flex-row items-end bg-gray-300 dark:bg-gray-800 px-3 py-3 rounded-2xl">
          <View>
            <Text className="text-gray-500 dark:text-gray-400">Members</Text>
            <View className="flex-row pt-2">
              {buddies.map((initial, index) => (
                <View
                  key={index}
                  className={`rounded-full w-7 h-7 justify-center items-center -ml-2 grayscale`}
                  style={{
                    backgroundColor: getRandomColor(),
                    zIndex: buddies.length - index,
                    opacity: 0.6,
                  }}>
                  <Text className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {initial}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity className="rounded-full w-12 h-12 justify-center items-center bg-gray-500 dark:bg-gray-600 ml-2 grayscale">
            <Image
              source={require('../assets/share.png')}
              className="w-5 h-5 tint-white opacity-70"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
