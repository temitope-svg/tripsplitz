import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import React, {useContext, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../utils/types';
import {PaymentModal} from '../components/Modals';
import { useColorScheme } from 'nativewind';


export default function FundTrip() {
  const navigation = useNavigation<NavigationProps>();
  const {colorScheme} = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [tripName, setTripName] = useState('');
  const [budget, setBudget] = useState('');

  return (
    <View className="flex-1 bg-white dark:bg-[#292C33] px-4 pt-16">
      <View className="flex-row items-center p-4">
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

      <ScrollView className="flex-1">
        <View className="mb-4 mt-4">
          <Text className="mb-2 text-gray-700">Trip Name</Text>
          <View
            className={`flex-row items-center border rounded-xl p-3 ${'border-gray-300'}`}>
            <TextInput
              className="flex-1 ml-2 py-1"
              placeholder="Paris"
              value={tripName}
              onChangeText={setTripName}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-10">
          <View className="mt-2">
            <Text className="text-lg font-semibold">Set Budget</Text>
            <Text className="font-light">& Select Currency</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <View className="border rounded-xl py-3 px-4 border-gray-300">
              <Text className="text-lg">$</Text>
            </View>
            <TextInput
              className="flex-1 ml-2 py-4  border rounded-xl px-3 border-gray-300"
              placeholder="0.00"
              value={budget}
              onChangeText={setBudget}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4 mt-3">
            <Text className="mb-2 text-gray-700">Trip Location</Text>
            <View
              className={`flex-row items-center border rounded-xl p-3 ${'border-gray-300'}`}>
              <TextInput
                className="flex-1 ml-2 py-1"
                placeholder="Paris"
                value={tripName}
                onChangeText={setTripName}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mb-4 mt-1">
            <Text className="mb-2 text-gray-700">Start & End Date</Text>
            <View
              className={`flex-row items-center border rounded-xl p-3 ${'border-gray-300'}`}>
              <TextInput
                className="flex-1 ml-2 py-1"
                placeholder="DD/MM/YY"
                value={tripName}
                onChangeText={setTripName}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
          </View>
          <View className="mb-4 mt-1">
            <Text className="mb-2 text-gray-700">Set Reminder</Text>
            <View
              className={`flex-row items-center border rounded-xl p-3 ${'border-gray-300'}`}>
              <TextInput
                className="flex-1 ml-2 py-1"
                placeholder="Nov - 30th /2024"
                value={tripName}
                onChangeText={setTripName}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mt-2">
            <Text className="text-lg font-semibold py-2">Payment Method</Text>
            <View className="flex-row gap-x-4">
              <Switch
                trackColor={{false: '#767577', true: '#059669'}}
                thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
              />
              <View>
                <Text>Paypal</Text>
                <Text>John@gmail.com</Text>
              </View>
            </View>
            <View className="flex-row gap-x-4 mt-2">
              <Switch
                trackColor={{false: '#767577', true: '#059669'}}
                thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
              />
              <View>
                <Text>Zelle</Text>
                <Text>$johnn1</Text>
              </View>
            </View>
            <View className="flex-row gap-x-4 mt-2">
              <Switch
                trackColor={{false: '#767577', true: '#059669'}}
                thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
              />
              <View>
                <Text>Bank Transfer</Text>
                <Text>Routine no. 00187839 | Account no. 232426865</Text>
              </View>
            </View>
            <View className="flex-row gap-x-4 mt-2">
              <Switch
                trackColor={{false: '#767577', true: '#059669'}}
                thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
              />
              <View>
                <Text>Cash App</Text>
                <Text>$johnn1</Text>
              </View>
            </View>
            <View className="flex-row gap-x-4 mt-2">
              <Switch
                trackColor={{false: '#767577', true: '#059669'}}
                thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
              />
              <View>
                <Text>E-Transfer</Text>
                <Text>johin@gmail.com</Text>
              </View>
            </View>
          </View>

          <View className="mt-10">
            {['Request Trip Fund', 'Add Payment Method'].map(
              (action, index) => (
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
              ),
            )}
          </View>
        </View>
      </ScrollView>
      <PaymentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
