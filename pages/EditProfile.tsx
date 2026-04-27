import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import { ProfileField } from '../components/ProfileItem';
import Entypo from 'react-native-vector-icons/Entypo';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import * as ImagePicker from 'react-native-image-picker';
import api from '../api';
import useNotify from '../hooks/useNotify';
import { handleApiError } from '../utils/error.util';
import { setLoggedInUser } from '../store/slices/user.slice';
import { getUserProfileImageUrl } from '../utils/image.util';
import { storage } from '../utils/storage';

export default function EditProfile() {
  const appNavigation = useAppNavigation();
  const { showSnackBar } = useNotify();
  const dispatch = useAppDispatch();

  // Get user data from Redux store
  const { loggedInUser } = useAppSelector(state => state.user);
  const userData = loggedInUser?.user;

  console.log("The user data is: ", userData);

  // Handle profile image selection and upload
  const handleImageSelect = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      });

      if (result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];

        // Create form data for upload
        const formData = new FormData();
        formData.append('profile_image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });

        // Upload the image
        await api.user.updateProfile(formData);

        // Get fresh user data
        const userProfile = await api.user.getProfile();

        // Map profile fields to user structure
        const basicInfo = userProfile.data.basicInformation;

        const updatedUserData = {
          token: loggedInUser?.token,
          user: {
            ...loggedInUser?.user,
            name: basicInfo.displayName,
            display_name: basicInfo.displayName,
            phone: basicInfo.mobileNumber,
            address: basicInfo.homeAddress,
            city: basicInfo.city,
            profile_image: basicInfo.profileImage,
          },
          device: loggedInUser?.device,
          expiresAt: loggedInUser?.expiresAt,
        };

        dispatch(setLoggedInUser(updatedUserData));
        await storage.setUserData(updatedUserData);

        showSnackBar('Profile image updated successfully', 'success');
      }
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to update profile image'
      });
    }
  };

  return (
    <GeneralLayout title="Edit Profile">
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
        <View className="bg-transparent flex-row items-center justify-center rounded-2xl p-3 px-5">
          <View className="bg-[#059669] dark:bg-[#047857] mt-6 items-center justify-center rounded-3xl py-4">
            {/* User Avatar - Make it touchable */}
            <TouchableOpacity onPress={handleImageSelect}>
              <Image
                source={{ uri: getUserProfileImageUrl(userData?.profile_image || userData?.profileImageUrl) }}
                className="w-20 h-20 rounded-full"
              />

            </TouchableOpacity>
            <View className="pt-3 items-center">
              <Text className="text-white font-semibold text-lg">
                {userData?.display_name || userData?.fullName || userData?.name || 'Set Display Name'}
              </Text>
              <View className="flex-row items-center">
                <Entypo name="location-pin" size={14} color="white" />
                <Text className="text-white text-xs text-center">
                  {userData?.address || userData?.city || 'Set Location'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View>
        <Text className="font-semibold text-xl pt-5 text-black dark:text-white">Basic Information</Text>
        <ProfileField
          label="Display Name"
          value={userData?.display_name || userData?.fullName || userData?.name || 'Set display name'}
          onPress={() => appNavigation.navigate(PAGES.editDisplayName, {
            label: 'Display Name',
            routeLabel: 'Display name',
            placeholder: 'Enter your display name',
            name: 'display_name',
            defaultValue: userData?.display_name || userData?.fullName || userData?.name || ''
          })}
        />
        <ProfileField
          label="Email"
          value={userData?.email || 'No email set'}
          showArrow={false}
          onPress={() => { }}
        />
        <ProfileField
          label="Phone Number"
          value={userData?.phone || 'Set phone number'}
          onPress={() => appNavigation.navigate(PAGES.editDisplayName, {
            label: 'Phone Number',
            routeLabel: 'Change number',
            placeholder: 'Enter your phone number',
            name: 'mobile_number',
            defaultValue: userData?.phone || ''
          })}
        />
        <ProfileField
          label="Home Address"
          value={userData?.address || 'Set address'}
          onPress={() => appNavigation.navigate(PAGES.editDisplayName, {
            label: 'Home Address',
            routeLabel: 'Home address',
            placeholder: 'Enter your home address',
            name: 'home_address',
            defaultValue: userData?.address || ''
          })}
        />
      </View>

      <View className="mt-16">
        <ButtonComponent
          title="Close"
          variant="primary"
          onPress={() => appNavigation.goBack()}
        />
      </View>
    </GeneralLayout>
  );
}
