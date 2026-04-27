import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ButtonComponent from '../../components/ButtonComponent';

interface WhoPaidModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (memberId: number | string) => void;
  onSplitExpenseClick: () => void;
  members: Array<{
    id: number | string;
    name: string;
  }>;
  selectedMemberId?: number | string;
  onSubmit?: () => void;
  isSubmitLoading?: boolean;
}

export function WhoPaidModal({ 
  visible, 
  onClose, 
  onSelect,
  members,
  selectedMemberId,
  onSubmit,
  isSubmitLoading = false,
  onSplitExpenseClick
}: WhoPaidModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-gray-700 rounded-t-3xl">
          <View className="flex-row justify-between items-center p-6 pb-2">
            <Text className="text-xl font-semibold">Who Paid?</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-2xl">×</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="p-2 mr-6 mb-3 self-end bg-[#B91C1C] rounded-lg" onPress={onSplitExpenseClick}>
            <Text className='text-white text-sm font-semibold'>Split Expense</Text>
          </TouchableOpacity>
          
          <ScrollView 
            className="px-6 pb-6"
            keyboardShouldPersistTaps="handled"
          >
            <View className="space-y-3">
              {members?.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => {
                    onSelect(member.id);
                  }}
                  className={`flex-row items-center justify-between p-3 rounded-lg mt-1 ${
                    selectedMemberId === member.id ? 'bg-green-50 dark:bg-green-700' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="rounded-full w-10 h-10 justify-center items-center bg-green-700">
                      <Text className="text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text className="ml-3 text-base">{member.name}</Text>
                  </View>
                  {selectedMemberId === member.id && (
                    <Text className="text-green-600 font-bold">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Submit button */}
            <View className="mt-6">
              <ButtonComponent
                title="Add Activity"
                variant="primary"
                className="bg-green-700"
                onPress={onSubmit}
                isLoading={isSubmitLoading}
                testID="who-paid-submit-button"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
} 
