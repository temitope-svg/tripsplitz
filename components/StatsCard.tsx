import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';

interface StatsCardProps {
  title: string;
  value: number;
  navigateTo?: keyof typeof PAGES;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, navigateTo }) => {
  const navigation = useAppNavigation();

  const handlePress = () => {
    if (navigateTo) {
      navigation.navigate(PAGES[navigateTo]);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={!navigateTo}>
      <View>
        <Text className="text-green-900 dark:text-white pb-2 text-center text-xs font-semibold">
          {title}
        </Text>
        <View className="rounded-full border border-green-800 dark:border-green-500 w-[22vw] h-[22vw] items-center justify-center dark:bg-[#54585C]">
          <Text className="text-xl font-semibold text-green-900 dark:text-white text-center">
            {value || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StatsCard; 