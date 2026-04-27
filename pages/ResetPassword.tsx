import React from 'react';
import { View, Text } from 'react-native';
import { PAGES } from '../utils/pages';
import { useRoute } from '@react-navigation/native';
import useAppNavigation from '../hooks/useAppNavigation';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import api from '../api';
import useNotify from '../hooks/useNotify';
import useAnimate from '../hooks/useAnimate';
import { handleApiError } from '../utils/error.util';
import GeneralLayout from '../layouts/GeneralLayout';
import { Lock } from 'iconsax-react-native';

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface RouteParams {
  email: string;
  token: string;
}

export default function ResetPassword() {
  const navigation = useAppNavigation();
  const { showSnackBar } = useNotify();
  const { showLoading } = useAnimate();
  const route = useRoute();
  const { email, token } = route.params as RouteParams;

  const initialValues: ResetPasswordFormValues = {
    password: '',
    confirmPassword: '',
  };

  const handleReset = async (values: ResetPasswordFormValues) => {
    try {
      await api.auth.resetPassword({
        email,
        token,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });

      showSnackBar('Password reset successful!', 'success');
      showLoading(() => {
        navigation.navigate(PAGES.passwordSuccess);
      });

    } catch (error: any) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to reset password'
      });
    }
  };

  return (
    <GeneralLayout title="Reset Password">
      <View className="flex-1 justify-center">
        <Text className="text-center font-semibold text-2xl mb-8 text-black dark:text-white">
          Create new password
        </Text>

        <FormikForm
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleReset}>
          <FormikInput
            name="password"
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            required
            icon={<Lock size={20} color="#878F96" variant="Bold" />}
          />

          <FormikInput
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your new password"
            required
            icon={<Lock size={20} color="#878F96" variant="Bold" />}
          />

          <View className="mt-10">
            <FormikSubmitButton
              title="Create New Password"
              valueType={{} as ResetPasswordFormValues}
              className="bg-green-700 rounded-2xl"
            />
          </View>
        </FormikForm>
      </View>
    </GeneralLayout>
  );
}
