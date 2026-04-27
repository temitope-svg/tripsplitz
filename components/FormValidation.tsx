import React from 'react';
import { Text, View } from 'react-native';

interface PasswordRuleProps {
  label: string;
  isValid?: boolean;
}

interface PopupMessageProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export function PasswordRule({ label, isValid = false }: PasswordRuleProps) {
  return (
    <View className="flex-row items-center gap-x-2 py-1">
      <Text className={isValid ? 'text-green-700' : 'text-gray-500'}>
        {isValid ? 'OK' : '*'}
      </Text>
      <Text className="text-sm text-black dark:text-white">{label}</Text>
    </View>
  );
}

export function PopupMessage({
  message,
  type = 'info',
}: PopupMessageProps) {
  const colorClass =
    type === 'success'
      ? 'text-green-700'
      : type === 'error'
        ? 'text-red-600'
        : 'text-gray-600';

  return (
    <View className="rounded-xl bg-white px-4 py-3 dark:bg-[#292C33]">
      <Text className={`text-sm ${colorClass}`}>{message}</Text>
    </View>
  );
}
