import api from '../api';
import { reduxStore } from '../store';
import { clearLoggedInUser, setLoggedInUser } from '../store/slices/user.slice';
import { queryClient } from './queryClient';
import { storage } from './storage';

export interface StoredUserData {
  token?: string;
  user?: any;
  device?: any;
  expiresAt?: string;
}

const EXPIRY_BUFFER_MS = 30 * 1000;

export const isSessionExpired = (userData?: StoredUserData | null) => {
  if (!userData?.expiresAt) {
    return false;
  }

  const expiresAt = new Date(userData.expiresAt).getTime();

  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return expiresAt <= Date.now() + EXPIRY_BUFFER_MS;
};

export const clearLocalSession = async () => {
  await storage.clearUserData();
  reduxStore.dispatch(clearLoggedInUser());
  queryClient.clear();
};

export const logoutSession = async () => {
  const storedUserData = await storage.getUserData();
  const authToken = reduxStore.getState().user.loggedInUser?.token || storedUserData?.token;

  try {
    if (authToken) {
      await api.auth.logout(authToken);
    }
  } catch (error) {
    console.log('Unable to logout from server:', error);
  } finally {
    await clearLocalSession();
  }
};

export const saveLocalSession = async (userData: StoredUserData) => {
  reduxStore.dispatch(setLoggedInUser(userData));
  await storage.setUserData(userData);
};

export const refreshStoredSession = async (storedUserData?: StoredUserData | null) => {
  if (!storedUserData?.token || isSessionExpired(storedUserData)) {
    await clearLocalSession();
    return null;
  }

  reduxStore.dispatch(setLoggedInUser(storedUserData));

  try {
    const profileResponse = await api.user.getProfile();
    const basicInfo = profileResponse.data.basicInformation;

    const freshUserData: StoredUserData = {
      ...storedUserData,
      user: {
        ...storedUserData.user,
        name: basicInfo.displayName || storedUserData.user?.fullName || storedUserData.user?.name,
        display_name: basicInfo.displayName,
        phone: basicInfo.mobileNumber,
        address: basicInfo.homeAddress,
        city: basicInfo.city || basicInfo.location?.city,
        profile_image: basicInfo.profileImage,
      },
    };

    await saveLocalSession(freshUserData);
    return freshUserData;
  } catch (error) {
    const currentUser = reduxStore.getState().user.loggedInUser;

    if (!currentUser?.token) {
      return null;
    }

    console.log('Unable to refresh stored session profile:', error);
    return storedUserData;
  }
};
