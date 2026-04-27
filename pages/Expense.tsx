import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {NavigationProps} from '../utils/types';
import {useNavigation} from '@react-navigation/native';

export default function Expense() {
  const navigation = useNavigation<NavigationProps>();
  return (
    <View className="flex-1 bg-white dark:bg-[#292C33] px-4 pt-16">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/arrow-left.png')}
            className="tint-black dark:tint-white"
          />
        </TouchableOpacity>
        <Text className="font-semibold text-xl ml-4 text-black dark:text-white">
          All Expense
        </Text>
      </View>

      <View>
        <View className="bg-gray-100 px-3 py-3 rounded-xl mt-7 w-36">
          <Text>Your Expense</Text>
          <Text className="text-2xl font-semibold">$3,454</Text>
        </View>

        <View>
          <Text className="text-xl font-semibold pt-8">Activity Category</Text>
          <View className="flex-row justify-between px-3 py-5 bg-gray-100 rounded-xl items-center mt-4 border border-gray-300">
            <Text className="text-xl">Meal</Text>
            <View className="">
              <Text className="text-lg text-gray-900">$352</Text>
              <Text className="text-gray-500">7+ Times</Text>
            </View>
          </View>
          <View className="flex-row justify-between px-3 py-5 bg-gray-100 rounded-xl items-center mt-2 border border-gray-300">
            <Text className="text-xl">Hotel</Text>
            <View className="">
              <Text className="text-lg text-gray-900">$1,840</Text>
              <Text className="text-gray-500">24+ Times</Text>
            </View>
          </View>
          <View className="flex-row justify-between px-3 py-5 bg-gray-100 rounded-xl items-center mt-2 border border-gray-300">
            <Text className="text-xl">Tour</Text>
            <View className="">
              <Text className="text-lg text-gray-900">$352</Text>
              <Text className="text-gray-500">19+ Times</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row items-center mt-36 justify-center">
        <TouchableOpacity
          onPress={() => navigation.navigate('createTrip')}
          className="rounded-lg py-3 px-16 items-center justify-center">
          <Text className="font-semibold text-lg text-green-700">Export</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('createTrip')}
          className="bg-green-700 rounded-lg py-3 px-16 items-center justify-center">
          <Text className="font-semibold text-lg text-white">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
