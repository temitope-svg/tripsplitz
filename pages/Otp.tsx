import React, {useState, useRef, useEffect} from 'react';
import {
  View, 
  Text, 
  Image, 
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import useAppNavigation from '../hooks/useAppNavigation';
import {PAGES} from '../utils/pages';
// import {PopupMessage} from '../components/FormValidation';
import LottieView from 'lottie-react-native';
import { useRoute } from '@react-navigation/native';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import api from '../api';
import useNotify from '../hooks/useNotify';
import useAnimate from '../hooks/useAnimate';
import { handleApiError } from '../utils/error.util';
import GeneralLayout from '../layouts/GeneralLayout';
import { FormikProps } from 'formik';

const {width, height} = Dimensions.get('window');

// Configuration
const COUNTDOWN_TIME = 5 * 60; // 5 minutes in seconds

// Validation schema
const OtpSchema = Yup.object().shape({
  code: Yup.string()
    .required('OTP code is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers'),
});

interface OtpFormValues {
  code: string;
}

interface RouteParams {
  email: string;
  verifyType: 'registration' | 'password_reset';
}

export default function Otp() {
  const navigation = useAppNavigation();
  const { showSnackBar } = useNotify();
  const { showLoading } = useAnimate();
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const formRef = useRef<FormikProps<OtpFormValues>>(null);
  const route = useRoute();

  const { email, verifyType } = route.params as RouteParams;
  const maskedEmail = email.replace(/(?<=^[^@]{1})[^@]*(?=@)/g, match => '*'.repeat(match.length));

  // Reset everything when component mounts or route params change
  useEffect(() => {
    resetPage();
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [email, verifyType]); // Reset when email or verifyType changes

  const resetPage = () => {
    // Reset form
    if (formRef.current) {
      formRef.current.resetForm();
    }
    
    // Reset timer
    setTimeLeft(COUNTDOWN_TIME);
    setCanResend(false);
    
    // Clear and restart timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    startTimer();
  };

  const startTimer = () => {
    setCanResend(false);
    setTimeLeft(COUNTDOWN_TIME);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const initialValues: OtpFormValues = {
    code: '',
  };

  const handleVerifyOtp = async (values: OtpFormValues) => {
    try {

      let response;

      switch(verifyType){
        case 'registration':
          response = await api.auth.verifyOtp({
            email,
            code: values.code,
          });
          break;
        case 'password_reset':
          response = await api.auth.verifyForgotPasswordOtp({
            email,
            code: values.code,
          });
          break;
      }

      showSnackBar('Verification success!', 'success');
      showLoading(() => {
        if(verifyType == 'registration'){
          navigation.navigate(PAGES.login);
        }
        else{
          // For password reset, pass the token from the response
          const token = response?.data?.token || values.code;
          navigation.navigate(PAGES.resetPassword, {
            email,
            token
          });
        }
      });

    } catch (error: any) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Invalid OTP code'
      });
    }
  };

  const handleResendOtp = async () => {
    // if (!canResend) return;
    
    try {
      const response = await api.auth.resendEmailOtp({
        email,
        verify_type: verifyType
      });

      console.log("RES: ", response);
      showSnackBar('OTP code resent successfully', 'success');
      startTimer();
    } catch (error: any) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to resend OTP'
      });
    }
  };

  return (
    <GeneralLayout title="Verification">
      <View className="flex-1 justify-center">
        <Text className="text-center font-semibold text-2xl mb-2 text-black dark:text-white">
          Enter 6-digit verification 
        </Text>
        <Text className="text-center mb-8 text-black dark:text-white">Code sent to {maskedEmail}</Text>

        <FormikForm
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={OtpSchema}
          onSubmit={handleVerifyOtp}>
          <FormikInput
            name="code"
            label="Code"
            type="number"
            placeholder="6-digit code"
            keyboardType="number-pad"
            maxLength={6}
          />

          <Text className="text-center text-gray-600 mt-4 dark:text-[#DDE2E5]">
            Input your code before it times out
          </Text>
          <Text className="text-center font-semibold text-lg py-4 text-black dark:text-white">
            {formatTime(timeLeft)}
          </Text>

          <TouchableOpacity
            onPress={handleResendOtp}
            className="flex-row justify-center items-center rounded-2xl p-2">
            <Text 
              className={`text-center ${
                canResend 
                  ? 'text-green-800 bg-green-300 dark:text-[#DC2626] dark:bg-[#FECACA]' 
                  : 'text-gray-500 bg-gray-200'
              } rounded-2xl px-3 w-28 mx-auto mt-4 mb-8 py-2`}>
              Resend Code
            </Text>
          </TouchableOpacity>

          <FormikSubmitButton
            testID="otp-verify-button"
            title="Verify"
            valueType={{} as OtpFormValues}
            className="bg-green-700 rounded-2xl"
          />
        </FormikForm>
      </View>
    </GeneralLayout>
  );
}
