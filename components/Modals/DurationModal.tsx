import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import ButtonComponent from '../ButtonComponent';

interface DurationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (duration: number) => void;
}

const durations = [
  { label: '5 Minutes', value: 5 * 60 * 1000 },
  { label: '3 Minutes', value: 3 * 60 * 1000 },
  { label: '1 Minute', value: 60 * 1000 },
  { label: '30 Seconds', value: 30 * 1000 },
  // { label: 'Immediately', value: 0 },
];

export function DurationModal({ visible, onClose, onSelect }: DurationModalProps) {
  const handleSelect = (duration: number) => {
    onSelect(duration);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/95 justify-end">
        <View className="bg-white dark:bg-[#292C33] rounded-t-3xl">
          {/* Handle bar */}
          <View className="items-center pt-4">
            <View className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </View>

          {/* Title */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-black dark:text-white text-center">
              Select Duration
            </Text>
          </View>

          {/* Duration options */}
          <View className="px-4 pb-6">
            {durations.map((duration, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(duration.value)}
                className="border-b border-gray-200 dark:border-gray-600 py-4"
              >
                <Text className="text-base text-gray-600 dark:text-gray-400">
                  {duration.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save button */}
          <View className="px-4 pb-10">
            <ButtonComponent
              title="Cancel"
              onPress={onClose}
              variant="primary"
              className="bg-green-700 dark:bg-green-600"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
} 
