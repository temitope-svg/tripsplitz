import React from 'react';
import { View, Text } from 'react-native';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import api from '../api';
import useNotify from '../hooks/useNotify';
import useAnimate from '../hooks/useAnimate';
import { handleApiError } from '../utils/error.util';
import GeneralLayout from '../layouts/GeneralLayout';
import { Message } from 'iconsax-react-native';

// Validation schema
const ResetEmailSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
});

interface ResetEmailFormValues {
  email: string;
}

export default function ResetEmail() {
  const navigation = useAppNavigation();
  const { showSnackBar } = useNotify();
  const { showLoading } = useAnimate();

  const initialValues: ResetEmailFormValues = {
    email: '',
  };

  const handleReset = async (values: ResetEmailFormValues) => {
    try {
      await api.auth.forgotPassword({
        email: values.email,
      });

      showSnackBar('Password reset email sent successfully!', 'success');
      showLoading(() => {
        navigation.navigate(PAGES.otp, {
          email: values.email,
          verifyType: 'password_reset'
        });
      });

    } catch (error: any) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to send password reset email'
      });
    }
  };

  return (
    <GeneralLayout title="Reset Password" >

      <Text className="text-center font-semibold text-2xl pt-48 text-black dark:text-white">
        Enter your email
      </Text>

      <FormikForm
        initialValues={initialValues}
        validationSchema={ResetEmailSchema}
        onSubmit={handleReset}>
        <FormikInput
          name="email"
          type="email"
          label="Email"
          placeholder="shade@example.com"
          required
          icon={<Message size={20} color="#878F96" variant="Bold" />}
        />

        <View className="mt-10">
          <FormikSubmitButton
            title="Send Code"
            valueType={{} as ResetEmailFormValues}
            className="bg-green-700 rounded-2xl"
        />
        </View>
      </FormikForm>
    </GeneralLayout>
  );
}
