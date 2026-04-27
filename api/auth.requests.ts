import axios from 'axios';
import { Base, requestWrapper, setConfig } from './request.util';

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
  device: {
    id: number;
    user_id: number;
    device_id: string;
    device_type: string;
    // ... add other device fields as needed
  };
  message: string;
}

interface ResendOtpRequest {
  email: string;
  verify_type: 'registration' | 'password_reset';
}

export const login = async <RequestDataType>(
  data: RequestDataType,
): Promise<LoginResponse> => {
  return requestWrapper(axios.post(`${Base.apiUrl()}/auth/login`, data));
};

export const logout = async (authToken?: string): Promise<any> => {
  const config = authToken
    ? {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    : setConfig();

  return requestWrapper(axios.post(`${Base.apiUrl()}/Auth/logout`, {}, config));
};

export const signup = async <RequestDataType>(
  data: RequestDataType,
): Promise<any> => {
  return requestWrapper(axios.post(`${Base.apiUrl()}/auth/register`, data));
};

export const verifyOtp = async (data: { email: string; code: string }): Promise<any> => {

  console.log("DATA: ", data);484

  return requestWrapper(
    axios.post(`${Base.apiUrl()}/auth/verify-email`, data)
  );
};

export const resendEmailOtp = async (data: ResendOtpRequest): Promise<any> => {
  if (data.verify_type === 'registration') {
    return requestWrapper(
      axios.post(`${Base.apiUrl()}/auth/resend-verification`, { email: data.email })
    );
  } else {
    return requestWrapper(
      axios.post(`${Base.apiUrl()}/auth/resend-password-reset-code`, { email: data.email })
    );
  }
};

export const forgotPassword = async <RequestDataType>(
  data: RequestDataType,
): Promise<any> => {
  return requestWrapper(axios.post(`${Base.apiUrl()}/auth/forgot-password`, data));
};

export const verifyForgotPasswordOtp = async (data: { email: string; code: string }): Promise<any> => {
  return requestWrapper(axios.post(`${Base.apiUrl()}/auth/verify-password-reset-code`, data));
};

export const resetPassword = async (data: {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any> => {
  return requestWrapper(axios.post(`${Base.apiUrl()}/auth/reset-password`, data));
};
