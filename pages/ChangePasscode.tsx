import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../utils/types';
import GeneralLayout from '../layouts/GeneralLayout';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import { Lock } from 'iconsax-react-native';
import useNotify from '../hooks/useNotify';
import { handleApiError } from '../utils/error.util';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';
import api from '../api';

// Validation schema
const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .required('New password is required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export default function ChangePassword() {
  const navigation = useAppNavigation();
  const { showSnackBar } = useNotify();

  const initialValues: ChangePasswordFormValues = {
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: '',
  };

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await api.user.changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        password_confirmation: values.passwordConfirmation,
      });

      showSnackBar('Password changed successfully!', 'success');
      navigation.navigate(PAGES.settings);

    } catch (error: any) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to change password',
      });
    }
  };

  return (
    <GeneralLayout title="Change Password">
      <View className="flex-1 justify-center">
        <FormikForm
          initialValues={initialValues}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleSubmit}>
          <FormikInput
            name="currentPassword"
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            required
            icon={<Lock size={20} className="text-[#878F96] dark:text-[#DDE2E5]" variant="Bold" />}
          />

          <FormikInput
            name="newPassword"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            required
            icon={<Lock size={20} className="text-[#878F96] dark:text-[#DDE2E5]" variant="Bold" />}
          />

          <FormikInput
            name="passwordConfirmation"
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            required
            icon={<Lock size={20} className="text-[#878F96] dark:text-[#DDE2E5]" variant="Bold" />}
          />

          <View className="mt-6">
            <FormikSubmitButton
              title="Change Password"
              valueType={{} as ChangePasswordFormValues}
              className="bg-green-700 rounded-2xl"
            />
          </View>
        </FormikForm>
      </View>
    </GeneralLayout>
  );
}
