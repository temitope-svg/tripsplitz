import { axiosInstance } from '../utils/axios';

interface SignupData {
  email: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

export const AuthService = {
  signup: async (data: SignupData): Promise<SignupResponse> => {
    try {
      const response = await axiosInstance.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
}; 