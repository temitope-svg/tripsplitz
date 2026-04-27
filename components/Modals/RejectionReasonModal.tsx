import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ButtonComponent from '../ButtonComponent';

interface RejectionReasonModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isLoading?: boolean;
}

export default function RejectionReasonModal({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}: RejectionReasonModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason.trim());
      setReason(''); // Reset after submission
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl">
          <View className="flex-row justify-between items-center p-6 pb-2">
            <Text className="text-xl font-semibold">Reason for Rejection</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-2xl">×</Text>
            </TouchableOpacity>
          </View>

          <View className="px-6 pb-6">
            <TextInput
              className="bg-gray-50 p-4 rounded-lg mb-4 min-h-[100] text-base"
              placeholder="Enter your reason for rejecting this trip invitation..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={reason}
              onChangeText={setReason}
            />

            <View className="space-y-3">
              <ButtonComponent
                title="Submit"
                variant="primary"
                className="bg-red-500"
                onPress={handleSubmit}
                isLoading={isLoading}
                disabled={!reason.trim() || isLoading}
              />
              <ButtonComponent
                title="Cancel"
                variant="text"
                onPress={onClose}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
} 