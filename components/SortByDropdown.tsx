import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

interface SortByDropdownProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function SortByDropdown({ selectedCategory, onSelectCategory }: SortByDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const { data: categories } = useQuery({
    queryKey: ['activity-categories'],
    queryFn: () => api.trip.getActivityCategories(),
  });

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    Animated.spring(animatedValue, {
      toValue: showDropdown ? 0 : 1,
      useNativeDriver: true,
      tension: 40,
      friction: 7
    }).start();
  };

  return (
    <View>
      <TouchableOpacity 
        className="bg-[#F8F9FA] dark:bg-[#54585C] px-4 py-2 rounded-xl mr-3"
        onPress={toggleDropdown}
      >
        <Text className="text-black dark:text-white">
          {selectedCategory || 'Sort by'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          className="flex-1"
          activeOpacity={1}
          onPress={() => {
            setShowDropdown(false);
            animatedValue.setValue(0);
          }}
        >
          <Animated.View 
            className="absolute left-6 top-44 bg-white dark:bg-[#54585C] rounded-xl shadow-lg p-2"
            style={{
              opacity: animatedValue,
              transform: [{
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0]
                })
              }]
            }}
          >
            {categories?.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="px-4 py-2"
                onPress={() => {
                  onSelectCategory(category.name);
                  setShowDropdown(false);
                  animatedValue.setValue(0);
                }}
              >
                <Text className="text-black dark:text-white text-base">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
} 