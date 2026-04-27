import React from 'react';
import {View, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useColorScheme} from 'nativewind';
export const BudgetExpense = ({percentage}: {percentage: number}) => {
  const {colorScheme} = useColorScheme();


  return (
    <View className="p-4 mt-2">
      <View className="flex-row items-center mb-2">
        <Text className="text-gray-700 dark:text-white font-medium">Your Budget </Text>
        <AntDesign
          name="arrowright"
          size={20}
          color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
          className="mx-2"
        />
        <Text className="text-gray-700 dark:text-white font-medium">Your Expense</Text>
      </View>
      <View className="flex-row gap-x-2">
        <View className="h-4 bg-gray-200 rounded-full overflow-hidden w-[85%]">
          <View
            className="h-full bg-primary rounded-full"
            style={{width: `${percentage}%`}}
          />
        </View>
        <Text className="text-sm dark:text-white">{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
};
