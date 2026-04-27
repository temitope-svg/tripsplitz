import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { getRandomColor } from '../utils/color.util';

interface EditActivityCardProps {
  title: string;
  participants: string[];
  participantNames: string;
  amount: number;
  date: string;
  onRemove: () => void;
}



export const EditActivityCard: React.FC<EditActivityCardProps> = ({
  title,
  participants,
  participantNames,
  amount,
  date,
  onRemove,
}) => {
  return (
    <View className="border border-gray-200 rounded-lg mb-3 relative">
      <TouchableOpacity
        onPress={onRemove}
        className="absolute -left-2 -top-2 z-10 rounded-full w-6 h-6 items-center justify-center">
        <Text className="font-bold text-2xl">×</Text>
      </TouchableOpacity>

      <View className="flex-row justify-between px-3 items-center py-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold">{title}</Text>
          <View className="flex-row items-center">
            <View className="flex-row pt-2 px-3">
              {participants.map((initial, idx) => (
                <View
                  key={idx}
                  className="rounded-full w-7 h-7 justify-center items-center -ml-2"
                  style={{
                    backgroundColor: getRandomColor(),
                    marginLeft: idx === 0 ? -16 : -8,
                  }}>
                  <Text className="font-semibold text-black dark:text-white">
                    {initial}
                  </Text>
                </View>
              ))}
            </View>
            <Text className="pt-8">{participantNames}</Text>
          </View>
        </View>
        <View className="ml-4">
          <Text className="text-xl font-semibold">${amount}</Text>
          <Text>{date}</Text>
        </View>
      </View>
    </View>
  );
};
