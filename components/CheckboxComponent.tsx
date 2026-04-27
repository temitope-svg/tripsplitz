import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CheckboxProps {
  options?: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  values: string[];
}

export function CheckboxComponent({ options, onChange, values }: CheckboxProps) {
  return (
    <View className="flex-col space-y-2">
      {options?.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onChange(option.value)}
          className="flex-row items-center space-x-2">
          <View 
            className={`w-6 h-6 border rounded-md justify-center items-center
              ${values.includes(option.value) 
                ? 'bg-green-700 border-green-700' 
                : 'border-gray-300'}`}>
            {values.includes(option.value) && (
              <Icon name="check" size={16} color="white" />
            )}
          </View>
          <Text className="text-gray-700">{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
} 