import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  FACE_ID_ENABLED: '@face_id_enabled',
  LAST_ACTIVE: '@last_active_timestamp',
  THEME_PREFERENCE: '@theme_preference',
  PASSCODE: '@passcode',
  PASSCODE_ENABLED: '@passcode_enabled',
};

export type ThemePreference = 'system' | 'light' | 'dark';

export const storage = {
  async setUserData(userData: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  async getUserData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async clearUserData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  },

  async setFaceIdEnabled(enabled: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FACE_ID_ENABLED, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving face ID setting:', error);
    }
  },

  async getFaceIdEnabled(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FACE_ID_ENABLED);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error getting face ID setting:', error);
      return false;
    }
  },

  async setLastActive() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
    } catch (error) {
      console.error('Error saving last active timestamp:', error);
    }
  },

  async getLastActive(): Promise<number> {
    try {
      const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
      return timestamp ? parseInt(timestamp) : 0;
    } catch (error) {
      console.error('Error getting last active timestamp:', error);
      return 0;
    }
  },

  async setThemePreference(theme: ThemePreference) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  },

  async getThemePreference(): Promise<ThemePreference> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
      return (theme as ThemePreference) || 'system';
    } catch (error) {
      console.error('Error getting theme preference:', error);
      return 'system';
    }
  },

  async setPasscode(passcode: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PASSCODE, passcode);
    } catch (error) {
      console.error('Error saving passcode:', error);
    }
  },

  async getPasscode(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.PASSCODE);
    } catch (error) {
      console.error('Error getting passcode:', error);
      return null;
    }
  },

  async setPasscodeEnabled(enabled: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PASSCODE_ENABLED, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving passcode enabled setting:', error);
    }
  },

  async getPasscodeEnabled(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PASSCODE_ENABLED);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error getting passcode enabled setting:', error);
      return false;
    }
  },
}; 