import React from 'react';
import { View, Text } from 'react-native';
// import { PopupMessage } from '../components/FormValidation';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import api from '../api';
import useNotify from '../hooks/useNotify';
import { handleApiError } from '../utils/error.util';
import AuthLayout from '../layouts/AuthLayout';
import { User, Message, Lock } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
// Validation schema
const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'Name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    ),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const navigation = useAppNavigation();
  const { showSnackBar } = useNotify();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme == 'dark' ? '#DDE2E5' : '#878F96';

  const initialValues: SignupFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleCreateAccount = async (values: SignupFormValues) => {
    try {
      const response = await api.auth.signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      });

      console.log("RES: ", response);

      showSnackBar('Account created successfully!', 'success');

      setTimeout(() => {
        navigation.navigate(PAGES.otp, {
          email: values.email,
          verifyType: 'registration'
        });
      }, 1000);

    } catch (error: any) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'An error occurred during signup'
      });
    }
  };

  return (
    <AuthLayout title="Start your journey!">
      <View className="flex-1 justify-center">
        <FormikForm
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={handleCreateAccount}>
          <FormikInput
            name="firstName"
            type="text"
            label="First Name"
            placeholder="Enter your first name"
            required
            icon={<User size={20} color={iconColor} variant="Bold" />}
          />

          <FormikInput
            name="lastName"
            type="text"
            label="Last Name"
            placeholder="Enter your last name"
            required
            icon={<User size={20} color={iconColor} variant="Bold" />}
          />

          <FormikInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
            icon={<Message size={20} color={iconColor} variant="Bold" />}
          />

          <FormikInput
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            icon={<Lock size={20} color={iconColor} variant="Bold" />}
          />

          <FormikInput
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            icon={<Lock size={20} color={iconColor} variant="Bold" />}
          />

          <View className="mt-4">
            <FormikSubmitButton
              testID="signup-button"
              title="Create Account"
              valueType={{} as SignupFormValues}
              className="bg-green-700 rounded-2xl"
            />
          </View>
        </FormikForm>

        <Text
          testID="go-to-login-link"
          className="text-center mt-4 mb-16 text-gray-600 dark:text-[#DDE2E5]"
          onPress={() => navigation.navigate(PAGES.login)}>
          Already have an account? Login
        </Text>
      </View>
    </AuthLayout>
  );
}
