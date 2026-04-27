import {View, Text, TextInput} from 'react-native';
import React from 'react';

interface PaymentInputRowProps {
  name: string;
  placeholder: string;
}

const PaymentInputRow: React.FC<PaymentInputRowProps> = ({
  name,
  placeholder,
}) => (
  <View className="border-b border-gray-200 pb-3 mb-3">
    <View className="flex-row items-center">
      <Text className="text-xl flex-1">{name}</Text>
      <View className="flex-row items-center gap-x-2">
        <View className="bg-gray-200 py-3 px-5 rounded-lg">
          <Text className="text-xl">$</Text>
        </View>
        <TextInput
          className="border rounded-lg py-6 px-3 w-44 h-9 border-gray-200 bg-gray-100"
          placeholder={placeholder}
          keyboardType="numeric"
        />
      </View>
    </View>
  </View>
);

const PaymentSection = () => {
  const users = [
    {name: 'Sofie', placeholder: '9'},
    {name: 'Chris', placeholder: '9'},
    {name: 'Victor', placeholder: '9'},
    {name: 'Grace', placeholder: '9'},
  ];

  return (
    <View className="mt-4">
      {users.map((user, index) => (
        <PaymentInputRow
          key={index}
          name={user.name}
          placeholder={user.placeholder}
        />
      ))}
    </View>
  );
};

export default PaymentSection;
