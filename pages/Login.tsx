import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import ButtonComponent from '../components/ButtonComponent';
import * as Yup from 'yup';
import api from '../api';
import useNotify from '../hooks/useNotify';
import { handleApiError } from '../utils/error.util';
import AuthLayout from '../layouts/AuthLayout';
import { Message, Lock } from 'iconsax-react-native';
import { getFCMToken } from '../utils/notification';
import { useMutation } from '@tanstack/react-query';
import DeviceInfo from 'react-native-device-info';
import { saveLocalSession } from '../utils/session';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: Yup.string()
    .required('Password is required'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: any;
  validationErrors?: any;
  timestamp: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    profileImageUrl: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  };
  expiresAt: string;
  device?: any;
}

export default function Login() {
  const navigation = useAppNavigation();
  const { showSnackBar } = useNotify();

  // const initialValues: LoginFormValues = {
  //   email: '',
  //   password: '',
  // };
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  // Device registration mutation
  const deviceRegistrationMutation = useMutation({
    mutationFn: async (token: string) => {
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceName = await DeviceInfo.getDeviceName();
      return api.notification.registerDevice({
        device_token: token,
        device_id: deviceId,
        device_type: Platform.OS === 'ios' ? 'ios' : 'android',
        device_name: deviceName
      });
    },
    onError: (error) => {
      console.log('Error registering device:', error);
      // Don't block login flow on device registration error
    }
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const dataresponse = await api.auth.login<LoginFormValues>({
        email: values.email,
        password: values.password,
      });

      // The API returns { success, data, message, ... } structure
      // requestWrapper extracts axios response.data, which is the ApiResponse wrapper
      const apiResponse = dataresponse as unknown as ApiResponse<LoginResponse>;
      const response = apiResponse.data;

      console.log("response222: ", response);

      // Store token in Redux FIRST so subsequent API calls can use it
      const initialUserData = {
        token: response.token,
        user: {
          ...response.user,
          name: response.user.fullName,
        },
        device: response.device,
        expiresAt: response.expiresAt,
      };
      await saveLocalSession(initialUserData);

      // Fetch full profile data after login (now that token is in Redux)
      try {
        const profileResponse = await api.user.getProfile();
        const basicInfo = profileResponse.data.basicInformation;

        const userData = {
          token: response.token,
          user: {
            ...response.user,
            name: response.user.fullName,
            display_name: basicInfo.displayName,
            phone: basicInfo.mobileNumber,
            address: basicInfo.homeAddress,
            city: basicInfo.city,
            profile_image: basicInfo.profileImage,
          },
          device: response.device,
          expiresAt: response.expiresAt,
        };

        // Update Redux with full profile data
        await saveLocalSession(userData);
      } catch (profileError) {
        console.log("Error fetching profile, using basic user data:", profileError);
        // If profile fetch fails, we already have the basic user data stored
      }

      // Register FCM token after successful login
      try {
        const fcmToken = await getFCMToken();
        console.log('FCM Token:', fcmToken);
        if (fcmToken) {
          await deviceRegistrationMutation.mutateAsync(fcmToken);
        }
      } catch (error) {
        console.log('Error registering FCM token:', error);
      }

      showSnackBar('Login successful!', 'success');
      navigation.navigate(PAGES.home);
    } catch (error: any) {
      console.log("MMMMM: ", error);

      if (error == 'Please verify your email address.') {
        navigation.navigate(PAGES.otp, {
          email: values.email,
          verifyType: 'registration'
        });
      }
      else {
        handleApiError(error, showSnackBar, {
          defaultMessage: 'An error occurred while logging in'
        });
      }
    }
  };

  return (
    <AuthLayout title="Welcome back!">
      <View className="flex-1 justify-center">
        <FormikForm
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}>
          <FormikInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
            icon={<Message size={20} color="#878F96" variant="Bold" />}
          />

          <FormikInput
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            icon={<Lock size={20} color="#878F96" variant="Bold" />}
          />

          <Text
            testID="forgot-password-link"
            className="text-[#4263EB] text-center font-semibold pb-5 mt-6"
            onPress={() => navigation.navigate(PAGES.resetEmail)}>
            Forgot your password?
          </Text>

          <FormikSubmitButton
            testID="login-button"
            title="Login"
            valueType={{} as LoginFormValues}
            className="bg-green-700 rounded-2xl mt-16"
          />
        </FormikForm>

        <View className="mt-6">
          <ButtonComponent
            testID="create-account-button"
            title="Create Account"
            onPress={() => navigation.navigate(PAGES.signup)}
            variant="secondary"
            className="mt-2"
          />
        </View>

        <View className="mx-auto mt-8 mb-6">
          <Text className="pl-16 text-gray-400 dark:text-gray-500">
            or login with
          </Text>
          <View className="flex-row gap-x-5 mt-3">
            <View className="border-gray-300 dark:border-gray-600 border rounded-full px-3 py-3">
              <Image
                source={require('../assets/google.png')}
                className="w-8 h-8"
              />
            </View>
            <View className="border-gray-300 dark:border-gray-600 border rounded-full px-3 py-3">
              <Image
                source={require('../assets/Facebook.png')}
                className="w-8 h-8"
              />
            </View>
            <View className="border-gray-300 dark:border-gray-600 border rounded-full px-3 py-3">
              <Image
                source={require('../assets/tiktok.png')}
                className="w-8 h-8"
              />
            </View>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
}
