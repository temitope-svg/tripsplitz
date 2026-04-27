import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import ButtonComponent from '../ButtonComponent';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (methods: PaymentMethod[]) => void;
  existingMethods?: {
    method_name: string;
    account_details: string;
  }[];
}

interface PaymentMethod {
  type: string;
  tag: string;
}

const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = [
  { type: 'PayPal', tag: '' },
  { type: 'Zelle', tag: '' },
  { type: 'Cash App', tag: '' },
  { type: 'E-Transfer', tag: '' },
  { type: 'Bank details', tag: '' },
];

export function PaymentMethodModal({ visible, onClose, onSave, existingMethods = [] }: PaymentMethodModalProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHOD_OPTIONS);

  // Filter out already added payment methods
  useEffect(() => {
    if (visible) {
      const availableMethods = PAYMENT_METHOD_OPTIONS.filter(method =>
        !existingMethods?.some(existing => 
          existing.method_name === method.type
        )
      );
      setMethods(availableMethods);
    }
  }, [visible, existingMethods]);

  const handleUpdateTag = (index: number, tag: string) => {
    const updatedMethods = [...methods];
    updatedMethods[index].tag = tag;
    setMethods(updatedMethods);
  };

  const handleSave = () => {
    onSave(methods.filter(method => method.tag !== ''));
    onClose();
  };

  if (methods.length === 0) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-[#292C33] rounded-t-3xl p-6">
            <Text className="text-xl font-semibold mb-6 text-black dark:text-white">Payment Method</Text>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">All payment methods have been added</Text>
            <ButtonComponent
              title="Close"
              onPress={onClose}
              variant="primary"
              className="bg-green-700 dark:bg-green-600"
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-[#292C33] rounded-t-3xl">
            <ScrollView 
              testID="payment-method-modal-scroll-view"
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              className="p-6"
            >
              <Text className="text-xl font-semibold mb-6 text-black dark:text-white">Payment Method</Text>

              <View className="space-y-4">
                {methods.map((method, index) => (
                  <View key={index} className="flex-row items-center">
                    <View className="w-32">
                      <Text className="text-base text-black dark:text-white">{method.type}</Text>
                    </View>
                    <View className="w-12 items-center">
                      <Text className="text-lg text-black dark:text-white">$</Text>
                    </View>
                    <TextInput
                      testID={`payment-method-input-${method.type.toLowerCase().replace(/\s+/g, '-')}`}
                      value={method.tag}
                      onChangeText={(text) => handleUpdateTag(index, text)}
                      placeholder={method.type === 'Bank details' ? 'Bank info here' : 'Enter your Tag'}
                      placeholderTextColor="#878F96"
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-black dark:text-white bg-white dark:bg-[#54585C]"
                    />
                  </View>
                ))}
              </View>

              <View className="mt-6">
                <ButtonComponent
                  title="Save"
                  onPress={handleSave}
                  variant="primary"
                  className="bg-green-700 dark:bg-green-600"
                  testID="save-payment-method-button"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
} 
