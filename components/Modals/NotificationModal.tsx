import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Check } from 'iconsax-react-native';
import ButtonComponent from '../ButtonComponent';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white dark:bg-gray-800 w-[80%] rounded-2xl p-6">
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
              <Check size={32} color="#059669" variant="Bold" />
            </View>
            <Text className="text-2xl font-semibold text-black dark:text-white mb-2">
              Notification Sent!
            </Text>
          </View>

          <ButtonComponent
            title="Done"
            variant="primary"
            className="mt-6"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
} 
