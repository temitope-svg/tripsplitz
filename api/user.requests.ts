import axios from 'axios';
import { Base, requestWrapper, setConfig } from './request.util';

interface UserProfileResponse {
  data: {
    basicInformation: {
      displayName: string;
      email: string;
      mobileNumber: string;
      homeAddress: string;
      city: string;
      profileImage: string;
      location: {
        city: string;
        state: string;
      };
    };
  };
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  password_confirmation: string;
}

export const updateProfile = async (formData: FormData): Promise<any> => {
  return requestWrapper(
    axios.post(
      `${Base.apiUrl()}/user/profile`,
      formData,
      {
        ...setConfig(),
        headers: {
          ...setConfig().headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  );
};

export const getProfile = async (): Promise<UserProfileResponse> => {
  return requestWrapper(
    axios.get(
      `${Base.apiUrl()}/user/profile`,
      setConfig()
    )
  );
};

export const changePassword = async (data: ChangePasswordRequest): Promise<any> => {
  return requestWrapper(
    axios.post(
      `${Base.apiUrl()}/user/change-password`,
      data,
      setConfig()
    )
  );
}; 

export const exportActivities = async (format: string): Promise<any> => {
  return requestWrapper(
    axios.get(
      `${Base.apiUrl()}/user/activities/export?format=${format}`,
      setConfig()
    )
  );
};

export const getPastTripBuddies = async (): Promise<any> => {
  return requestWrapper(
    axios.get(
      `${Base.apiUrl()}/user/past-trip-buddies`,
      setConfig()
    )
  );
};