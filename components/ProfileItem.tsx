import { ArrowRight2 } from 'iconsax-react-native';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';

interface ProfileItemProps {
  icon: any;
  text: string;
  onPress: () => void;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
  icon,
  text,
  onPress,
}) => {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#DDE2E5' : '#878F96';

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center py-4 ">
        {icon}
        <Text className="flex-1 ml-4 text-black dark:text-white">{text}</Text>
        <ArrowRight2 size={14} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

interface ProfileFieldProps {
  label: string;
  value: string;
  onPress: () => void;
  showArrow?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  onPress,
  showArrow = true,
}) => {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#dc2626' : '#000';

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="py-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-gray-500 dark:text-gray-400">{label}</Text>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-black dark:text-white">{value}</Text>
          {showArrow && (
            <ArrowRight2 size={14} color={iconColor} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
