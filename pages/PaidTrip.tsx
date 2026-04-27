import {View, Text, ScrollView, Image, TouchableOpacity, useColorScheme} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../utils/types';

type ActivityBuddyProps = {
  name: string;
  initial: string;
  color: string;
};

export default function PaidTrip() {
  const navigation = useNavigation<NavigationProps>();
  const {colorScheme} = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const activityBuddies: ActivityBuddyProps[] = [
    {name: 'Shade', initial: 'S', color: '#F87171'},
    {name: 'Philip', initial: 'P', color: '#4263EB'},
    {name: 'Tayo', initial: 'T', color: '#FFD4D4'},
    {name: 'Victor', initial: 'V', color: '#34D399'},
    {name: 'Grace', initial: 'G', color: '#F87171'},
    {name: 'Peace', initial: 'P', color: '#FFC92A'},
    {name: 'Chris', initial: 'C', color: '#B3BFF1'},
    {name: 'Sofie', initial: 'S', color: '#34D399'},
  ];
  return (
    <View className="flex-1 bg-white pt-16 dark:bg-[#292C33] px-4 pb-10">
      <View className="flex-row items-center pt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/arrow-left.png')}
            className="tint-black dark:tint-white"
          />
        </TouchableOpacity>
        <Text className="font-semibold text-xl ml-4 text-black dark:text-white">
          Fund Trip
        </Text>
      </View>
      <ScrollView>
        <Text
          className={`text-lg mb-6 mt-5 font-semibold ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
          Shade added you to this trip
        </Text>
        <View>
          <View
            className={`flex-row gap-x-5 py-3 ${
              isDarkMode ? 'bg-gray-500' : 'bg-[#F8F9FA]'
            } rounded-md mx-1`}>
            <View className="">
              <Text
                className={`text-base ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                Trip Budget
              </Text>
              <Text
                className={`text-2xl ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                $4,000
              </Text>
            </View>
          </View>
          <View
            className={`flex-row gap-x-5 py-3 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            } rounded-md`}>
            <View className="flex-row items-center">
              <Image
                source={require('../assets/pin.png')}
                className={isDarkMode ? 'tint-white' : 'tint-black'}
              />
              <Text
                className={`font-semibold text-base ml-2 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                Paris
              </Text>
            </View>
            <View className="flex-row items-center">
              <Image
                source={require('../assets/calendar.png')}
                className={isDarkMode ? 'tint-white' : 'tint-black'}
              />
              <Text
                className={`pl-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-black'
                } text-sm`}>
                Oct 5th - Nov 30th / 2024
              </Text>
            </View>
          </View>
          <Image
            source={require('../assets/trip_1.png')}
            className="w-full h-32 rounded-xl"
          />
          <View>
            <Text
              className={`text-base mt-6 font-semibold ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
              Trip Buddies
            </Text>
            <View className="flex-row flex-wrap w-[60%]">
              {activityBuddies.map(({name, initial, color}, index) => (
                <View key={index} className="mx-1 mt-2 mb-4 items-center">
                  <View
                    className="rounded-full w-10 h-10 justify-center items-center"
                    style={{backgroundColor: color}}>
                    <Text className="text-sm font-semibold text-white">
                      {initial}
                    </Text>
                  </View>
                  <Text
                    className={`text-center text-xs mt-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text className="pt-5 text-lg">You are to contribute</Text>
          <Text className="text-2xl font-semibold">$500</Text>

          <Text className="pt-5 font-semibold text-lg pb-2">Pay to</Text>
          <Text className="">Chase Bank</Text>
          <Text>Routine no. 00187839</Text>
          <Text>Account no. 232426865</Text>
        </View>
        <View className="space-y-3 mt-10">
          {['Have Paid', 'Close'].map((action, index) => (
            <TouchableOpacity
              key={action}
              className={`${
                index === 0
                  ? 'bg-green-700'
                  : isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-white'
              } py-4 rounded-2xl`}>
              <Text
                className={`${
                  index === 0
                    ? 'text-white'
                    : isDarkMode
                    ? 'text-green-400'
                    : 'text-primary'
                } text-center text-base font-semibold`}>
                {action}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
