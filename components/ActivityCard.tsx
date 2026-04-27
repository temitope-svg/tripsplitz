import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { getRandomColor } from '../utils/color.util';
import { formatCurrency } from '../utils/currency.util';
interface ActivityCardProps {
  name: string;
  description?: string | null;
  location?: string | null;
  startDate: string;
  budget: string;
  category?: string | null;
  participants?: string[];
  onPress?: () => void;
  showDate?: boolean
}

const formatParticipantText = (participants: string[]) => {
  if (!participants?.length) return '';
  
  const getFirstName = (fullName: string) => fullName.split(' ')[0] || fullName;
  
  if (participants.length === 1) {
    return getFirstName(participants[0]);
  }
  
  if (participants.length === 2) {
    return `${getFirstName(participants[0])} and ${getFirstName(participants[1])}`;
  }
  
  const othersCount = participants.length - 2;
  return `${getFirstName(participants[0])}, ${getFirstName(participants[1])} and ${othersCount} ${othersCount === 1 ? 'other' : 'others'}`;
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  name,
  startDate,
  budget,
  participants,
  onPress,
  showDate = true
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className=" flex-row justify-between items-center bg-white dark:bg-[#292C33] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-2"
    >
      <View>
        <Text className="text-sm font-semibold text-black dark:text-white mb-3">
          {name}
        </Text>

        <View className="flex-row items-center">
          <View className="flex-row mr-2 ">
            {participants?.slice(0, 3).map((participant, index) => (
              <View
                key={participant}
                className="rounded-full w-8 h-8 justify-center items-center -ml-2 first:ml-0"
                style={{
                  backgroundColor: getRandomColor(),
                  zIndex: participants.length - index,
                }}
              >
                <Text className="text-sm font-semibold text-white">
                  {participant[0]}
                </Text>
              </View>
            ))}
          </View>
          <Text className="text-xs text-gray-500">
            {formatParticipantText(participants || [])}
          </Text>
        </View>
      </View>
      
      <View className=" items-end">
        <Text className="text-sm font-semibold text-black dark:text-white">{formatCurrency(budget)}</Text>

        {showDate && startDate && <Text className="text-xs text-gray-500">{new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>}
      </View>
    </TouchableOpacity>
  );
};
