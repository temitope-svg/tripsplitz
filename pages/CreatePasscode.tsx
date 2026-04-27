import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../utils/types';
import GeneralLayout from '../layouts/GeneralLayout';

export default function CreatePasscode() {
  const navigation = useNavigation<NavigationProps>();
  const [passcode, setPassCode] = useState('');

  return (
    <GeneralLayout title="Create Passcode">
      <View className="mt-12">
        <Text className="text-2xl font-semibold text-center text-black dark:text-white">
          Create Passcode
        </Text>
        <Text className="px-4 pt-3 text-gray-700 dark:text-gray-300 text-center">
          You will be able to login the passcode below
        </Text>

        <View className="mb-4 mt-8 px-4">
          <Text className="mb-2 text-gray-700 dark:text-gray-300">Create Passcode</Text>
          <View
            className={`flex-row items-center border rounded-lg p-3 border-gray-300 dark:border-gray-600`}>
            <TextInput
              className="flex-1 ml-2 py-1 text-black dark:text-white"
              placeholder="6-digit PIN"
              placeholderTextColor="#9CA3AF"
              value={passcode}
              onChangeText={setPassCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    </GeneralLayout>
  );
}
