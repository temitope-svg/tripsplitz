import React from 'react';
import { View, Text, Image, ScrollView, ImageBackground, useColorScheme } from 'react-native';
import { ProfileItem } from '../components/ProfileItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';
import { useAppSelector } from '../store/hooks';
import { getUserProfileImageUrl } from '../utils/image.util';
import { logoutSession } from '../utils/session';
import { navigationRef } from '../utils/navigation';
type ProfileScreenName = { title: string; name: string; }

interface ProfileItemData {
  icon: React.ReactElement;
  text: string;
  screenName: ProfileScreenName;
}

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarSource: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, avatarSource }) => {

  console.log("EMAIL: ", email);
  console.log("AVATAR SOURCE: ", avatarSource);

  return (
    <ImageBackground
      source={require('../assets/bg-pattern.jpg')}
      style={{
        borderRadius: 30,
        overflow: 'hidden',
      }}
      imageStyle={{
        transform: 'scale(1.1)',
        opacity: 0.5,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(1, 132, 91, 0.872)',
          borderRadius: 30,
          overflow: 'hidden'
        }}
      />
      <View className="bg-transparent flex-row items-center justify-between rounded-2xl p-5 px-5">
        <View>
          <Text className="text-white font-bold text-lg mb-2">{name}</Text>
          <Text className="text-gray-100">{email}</Text>
        </View>
        <Image source={{ uri: avatarSource }} className="w-20 h-20 rounded-full" />
      </View>
    </ImageBackground>
  );
};

export default function Profile() {
  const appNavigation = useAppNavigation();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? 'white' : '#292C33';
  
  const { loggedInUser } = useAppSelector(state => state.user);
  const userData = loggedInUser?.user;

  const profileItems: ProfileItemData[] = [
    {
      icon: <Ionicons name="pencil" size={24} color={iconColor} />,
      text: 'Edit Profile',
      screenName: PAGES.editProfile,
    },
    {
      icon: <Ionicons name="pulse" size={24} color={iconColor} />,
      text: 'Your activities',
      screenName: PAGES.activities,
    },
    {
      icon: <FontAwesome5 name="suitcase" size={24} color={iconColor} />,
      text: 'Upcoming Trips',
      screenName: PAGES.upcomingTrips,
    },
    {
      icon: <Ionicons name="calendar" size={24} color={iconColor} />,
      text: 'Upcoming Expenses',
      screenName: PAGES.upcomingExpense,
    },
    {
      icon: <Ionicons name="chatbubble-ellipses" size={24} color={iconColor} />,
      text: 'All Expense',
      screenName: PAGES.allExpense,
    },
    {
      icon: <Ionicons name="settings" size={24} color={iconColor} />,
      text: 'Settings',
      screenName: PAGES.settings,
    },
    {
      icon: <Feather name="file-text" size={24} color={iconColor} />,
      text: 'Statement',
      screenName: PAGES.userStatement,
    },
    {
      icon: <Ionicons name="information-circle" size={24} color={iconColor} />,
      text: 'About',
      screenName: PAGES.aboutApp,
    },
  ];

  const handleItemPress = async (screenName: ProfileScreenName | 'LogOut') => {
    if (screenName === 'LogOut') {
      await logoutSession();
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: PAGES.login.name }],
      });
    } else {
      appNavigation.navigate(screenName);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#292C33] p-4">
      <View className="pt-16">
        <Text className="font-semibold text-xl text-black dark:text-white mb-12">My Profile</Text>
        <ProfileHeader
          name={userData?.name || 'Set name'}
          email={userData?.email || 'Set email'}
          avatarSource={getUserProfileImageUrl(userData?.profile_image)}
        />

        <View className="mx-2 mt-10">
          {profileItems.map((item, index) => (
            <ProfileItem
              key={index}
              icon={item.icon}
              text={item.text}
              onPress={() => handleItemPress(item.screenName)}
            />
          ))}
          <ProfileItem
            icon={<Ionicons name="log-out" size={24} color={iconColor} />}
            text="Log Out"
            onPress={() => handleItemPress('LogOut')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
