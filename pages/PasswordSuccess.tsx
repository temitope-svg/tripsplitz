import React from 'react';
import { View, Text, Image } from 'react-native';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import ButtonComponent from '../components/ButtonComponent';

export default function PasswordSuccess() {
  const navigation = useAppNavigation();

  const handleLogin = () => {
    navigation.navigate(PAGES.login);
  };

  return (
    <View className="flex-1 justify-around bg-white dark:bg-[#292C33] px-6">
      <View className="items-center mt-52">
        <Image 
          source={require('../assets/key.png')} 
          className="w-32 h-32"
        />
        <Text className="text-2xl font-bold mt-8 text-center text-black dark:text-white">
          Password Changed!
        </Text>
        <Text className="text-gray-500 text-center mt-4  dark:text-white  ">
          Your password has been changed successfully
        </Text>
      </View>

      <ButtonComponent
        title="Login"
        onPress={handleLogin}
        variant="primary"
        className="mt-96"
      />
    </View>
  );
}
