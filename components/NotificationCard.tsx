import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { getRandomColor } from '../utils/color.util';
import { useColorScheme } from 'nativewind';

interface NotificationCardProps {
  initial: string;
  color: string;
  date: string;
  isRead: boolean;
  message: string;
  onPress: () => void;
}

export function NotificationCard({
  initial,
  date,
  isRead,
  message,
  onPress,
}: NotificationCardProps) {
  const {colorScheme} = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row rounded-2xl py-6  mb-3 bg-white dark:bg-transparent`}
      style={{
        shadowColor: isDarkMode ? '#000' : '#bcb7b7',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        elevation: 2,
      }}>
      <View className={`rounded-full h-12 w-12 flex items-center justify-center`} style={{ backgroundColor: getRandomColor() }}>
        <Text className="text-xl font-semibold text-white">{initial}</Text>
      </View>
      <View className="ml-3 flex-1">
        <View className="flex-row gap-x-4 items-center">
          <Text className={`text-xs text-black dark:text-white`}>
            {date}
          </Text>
          <View
            className={`px-2 py-1 rounded-xl ${isRead ? 'bg-[#DEFFDD]' : 'bg-[#DDE2E5]'} dark:bg-[#54585C]`}>
            <Text
              className={`text-xs text-black `}>
              {isRead ? 'Read' : 'Unread'}
            </Text>
          </View>
        </View>
        <Text className={`pt-1 text-black dark:text-white`}>
          {message}
        </Text>
      </View>
    </TouchableOpacity>
  );
} 
