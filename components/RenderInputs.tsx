import { View, Text, TextInput } from 'react-native';
import React from 'react';

export const RenderTextInput = (
  label: string,
  value: string,
  placeholder: string,
  setValue: (text: string) => void,
  secureTextEntry = false
) => (
  <View className="mb-4">
    <Text className="text-gray-600 mb-1">{label}</Text>
    <TextInput
      className="border border-gray-300 rounded-md px-2 py-3"
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
    />
  </View>
);
