import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import useAppNavigation from '../hooks/useAppNavigation';
import {PAGES} from '../utils/pages';
import { useColorScheme } from 'nativewind';

export default function Onboarding() {
  const [selectedStep, setSelectedStep] = useState(0);
  const navigation = useAppNavigation();

  const {colorScheme} = useColorScheme();

  console.log(colorScheme);

  const steps = [
    {
      title: 'Effortlessly track your travel expenses',
      image: require('../assets/onboard_1.png'),
    },
    {
      title: 'Plan your trips to easily manage your expenses',
      image: require('../assets/onboard_2.png'),
    },
    {
      title: 'Record your activity on the goal',
      image: require('../assets/onboard_3.png'),
    },
  ];

  const handleSkip = () => {
    navigation.navigate(PAGES.signup);
  };

  const onSwipeLeft = () => {
    if (selectedStep < steps.length - 1) {
      setSelectedStep(selectedStep + 1);
    }
  };

  const onSwipeRight = () => {
    if (selectedStep > 0) {
      setSelectedStep(selectedStep - 1);
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <View className="flex-1">
      <Image
        source={steps[selectedStep].image}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        config={config}
        className="flex-1">
         <TouchableOpacity
          testID="onboarding-skip-button"
          onPress={handleSkip}
          className="absolute top-12 right-4 z-10 bg-white/60 p-3 rounded-xl dark:bg-[#54585C]">
          <Text className="text-lg text-sm dark:text-gray-300">Skip</Text>
        </TouchableOpacity>

        <View className="flex-1 justify-end pb-20">
          <View className="bg-white/90 dark:bg-black/90 mx-4 p-4 rounded-lg">
            <Text className="text-xl text-center text-sm dark:text-white">
              {steps[selectedStep].title}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-center pb-10">
          {steps.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === selectedStep ? 'bg-primary w-5' : 'bg-white/50'
              }`}
            />
          ))}
        </View>
      </GestureRecognizer>
    </View>
  );
}
