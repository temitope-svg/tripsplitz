import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../utils/types';
import GeneralLayout from '../layouts/GeneralLayout';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import { DurationModal } from '../components/Modals/DurationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTO_LOCK_DURATION_KEY = 'autoLockDuration';

export default function ChangePassword() {
  const navigation = useAppNavigation();
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [autoLockTimer, setAutoLockTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load saved duration on mount
    loadSavedDuration();
    
    // Start auto-lock timer if duration is set
    if (selectedDuration !== null && selectedDuration > 0) {
      startAutoLockTimer();
    }

    return () => {
      if (autoLockTimer) {
        clearTimeout(autoLockTimer);
      }
    };
  }, [selectedDuration]);

  const loadSavedDuration = async () => {
    try {
      const savedDuration = await AsyncStorage.getItem(AUTO_LOCK_DURATION_KEY);
      if (savedDuration) {
        setSelectedDuration(parseInt(savedDuration));
      }
    } catch (error) {
      console.error('Error loading auto-lock duration:', error);
    }
  };

  const handleDurationSelect = async (duration: number) => {
    try {
      await AsyncStorage.setItem(AUTO_LOCK_DURATION_KEY, duration.toString());
      setSelectedDuration(duration);
    } catch (error) {
      console.error('Error saving auto-lock duration:', error);
    }
  };

  const startAutoLockTimer = () => {
    if (autoLockTimer) {
      clearTimeout(autoLockTimer);
    }

    if (selectedDuration && selectedDuration > 0) {
      const timer = setTimeout(() => {
        navigation.navigate(PAGES.login);
      }, selectedDuration);
      setAutoLockTimer(timer);
    }
  };

  const getDurationText = () => {
    if (selectedDuration === null) return 'Select duration';
    if (selectedDuration === 0) return 'Immediately';
    if (selectedDuration === 30 * 1000) return '30 Seconds';
    if (selectedDuration === 60 * 1000) return '1 Minute';
    if (selectedDuration === 3 * 60 * 1000) return '3 Minutes';
    if (selectedDuration === 5 * 60 * 1000) return '5 Minutes';
    return 'Select duration';
  };

  return (
    <GeneralLayout title="Settings">
      <View>
        <Text className="font-semibold text-xl pt-10 text-black dark:text-white">App Preferences</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(PAGES.changePasscode)}
          className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-600 pb-3">
          <View>
            <Text className="text-lg text-black dark:text-white">Change Password</Text>
            <Text className="text-gray-600 dark:text-gray-400">Increase your password strength</Text>
          </View>
          <Image 
            source={require('../assets/right-arrow.png')} 
            className="tint-black dark:tint-white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDurationModalVisible(true)}
          className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-600 pb-3">
          <View>
            <Text className="text-lg text-black dark:text-white">Auto Lock</Text>
            <Text className="text-gray-600 dark:text-gray-400">{getDurationText()}</Text>
          </View>
          <Image 
            source={require('../assets/right-arrow.png')} 
            className="tint-black dark:tint-white"
          />
        </TouchableOpacity>
      </View>

      <DurationModal
        visible={durationModalVisible}
        onClose={() => setDurationModalVisible(false)}
        onSelect={handleDurationSelect}
      />
    </GeneralLayout>
  );
}
