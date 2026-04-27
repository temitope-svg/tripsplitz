import { reduxStore } from "../store";
import { clearLoggedInUser } from "../store/slices/user.slice";
import { API_CONFIG } from "../utils/api.util";
import { queryClient } from "../utils/queryClient";
import { storage } from "../utils/storage";
import { navigationRef } from "../utils/navigation";
import { PAGES } from "../utils/pages";

const API_URL = API_CONFIG.BASE_URL;

export const Base = {
  apiUrl: (): string => {
    if (API_URL) {
      return `${API_URL}`;
    }
    throw new Error('API_URL is not defined.');
  },
};

export const setConfig = () => {
  const authToken = getAccessToken();

  console.log("AUTH TOKEN: ", authToken);

  return {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  };
};

export const requestWrapper = async (request: Promise<any>) => {
  try {

    const res = await request;
    return res.data;
  } catch (err: any) {
    console.log("API Error: ", err.response);

    if (err.response?.status === 401) {
      // Clear user data from Redux and persistent storage.
      await storage.clearUserData();
      reduxStore.dispatch(clearLoggedInUser());
      queryClient.clear();
      
      // Navigate to login
      if (navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: PAGES.login.name }],
        });
      }
      
      throw "Invalid login credentials.";
    }

    if(err.response?.data?.errors) {
      throw err.response?.data?.errors;
    }

    if(err.response?.data?.message) {
      throw err.response?.data?.message;
    }

    throw "An error occurred";
  }
};

const getAccessToken = () => {
  const store = reduxStore;
  const state = store.getState();

  if (!state.user.loggedInUser || !state.user.loggedInUser.token) {
    throw "You are not logged in";
  }

  return state.user.loggedInUser.token;
};
