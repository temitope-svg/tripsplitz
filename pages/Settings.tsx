import { View, Text, TouchableOpacity, Image, Switch, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';
import GeneralLayout from '../layouts/GeneralLayout';
import { storage, ThemePreference } from '../utils/storage';
import useNotify from '../hooks/useNotify';
import { biometrics } from '../utils/biometrics';
import ButtonComponent from '../components/ButtonComponent';
import PasscodeEntry from '../components/PasscodeEntry';
import { TickCircle } from 'iconsax-react-native';
import { useColorScheme } from "nativewind";

export default function Settings() {
  const appNavigation = useAppNavigation();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [showVerifyPasscodeModal, setShowVerifyPasscodeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemePreference>('system');
  const { setColorScheme } = useColorScheme();
  const { showSnackBar } = useNotify();

  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [biometricsType, setBiometricsType] = useState<'Face ID' | 'Fingerprint' | null>(null);

  // Load passcode setting on component mount
  useEffect(() => {
    const loadPasscodeSetting = async () => {
      const enabled = await storage.getPasscodeEnabled();
      setPasscodeEnabled(enabled);
    };
    loadPasscodeSetting();
  }, []);

  // Load biometrics availability on mount
  useEffect(() => {
    const checkBiometrics = async () => {
      const { available, isFaceId, isFingerprint } = await biometrics.isBiometricsAvailable();
      setIsBiometricsAvailable(available);
      if (available) {
        setBiometricsType(isFaceId ? 'Face ID' : isFingerprint ? 'Fingerprint' : null);
      }
    };
    checkBiometrics();
  }, []);

  // Load biometrics setting on component mount
  useEffect(() => {
    const loadBiometricsSetting = async () => {
      const enabled = await storage.getFaceIdEnabled(); // We'll keep using the same storage key
      setBiometricsEnabled(enabled);
    };
    loadBiometricsSetting();
  }, []);

  // Load theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      const theme = await storage.getThemePreference();
      setSelectedTheme(theme);
      setColorScheme(theme);
    };
    loadThemePreference();
  }, [setColorScheme]);

  const themeOptions: { label: string; value: ThemePreference }[] = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  const handleThemeChange = async (theme: ThemePreference) => {
    try {
      setSelectedTheme(theme);
      setColorScheme(theme);
      await storage.setThemePreference(theme);
      setShowThemeModal(false);
      showSnackBar('Theme updated successfully', 'success');
    } catch (error) {
      console.error('Error updating theme:', error);
      setSelectedTheme('system');
      showSnackBar('Failed to update theme', 'error');
    }
  };

  const handleBiometricsToggle = async () => {
    try {
      if (!biometricsEnabled) {
        // When enabling, first authenticate
        const authenticated = await biometrics.authenticate();
        if (!authenticated) {
          showSnackBar(`${biometricsType} authentication failed`, 'error');
          return;
        }
      }

      const newValue = !biometricsEnabled;
      await storage.setFaceIdEnabled(newValue); // We'll keep using the same storage key
      setBiometricsEnabled(newValue);
      showSnackBar(
        newValue ? `${biometricsType} enabled successfully` : `${biometricsType} disabled`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling biometrics:', error);
      showSnackBar('Failed to update biometrics settings', 'error');
    }
  };

  const handlePasscodeToggle = async () => {
    try {
      if (passcodeEnabled) {
        // Show verification modal before disabling
        setShowVerifyPasscodeModal(true);
      } else {
        // Require Face ID before enabling
        if (isBiometricsAvailable) {
          const authenticated = await biometrics.authenticate();
          if (!authenticated) {
            showSnackBar('Authentication required', 'error');
            return;
          }
        }
        setShowPasscodeModal(true);
      }
    } catch (error) {
      console.error('Error toggling passcode:', error);
      showSnackBar('Failed to update passcode settings', 'error');
    }
  };

  const handleVerifyPasscode = async (passcode: string): Promise<boolean> => {
    try {
      const storedPasscode = await storage.getPasscode();
      if (passcode === storedPasscode) {
        // Disable passcode after successful verification
        await storage.setPasscodeEnabled(false);
        setPasscodeEnabled(false);
        setShowVerifyPasscodeModal(false);
        showSnackBar('Passcode disabled', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying passcode:', error);
      showSnackBar('Failed to verify passcode', 'error');
      return false;
    }
  };

  const handlePasscodeSet = async (passcode: string): Promise<boolean> => {
    try {
      // First save the passcode
      await storage.setPasscode(passcode);
      
      // Then enable passcode setting
      await storage.setPasscodeEnabled(true);
      
      // Update local state
      setPasscodeEnabled(true);
      setShowPasscodeModal(false);
      
      showSnackBar('Passcode set successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error setting passcode:', error);
      // If there's an error, ensure passcode is disabled
      await storage.setPasscodeEnabled(false);
      setPasscodeEnabled(false);
      showSnackBar('Failed to set passcode', 'error');
      return false;
    }
  };

  // Render biometrics option
  const renderBiometricsOption = () => {
    if (!isBiometricsAvailable) return null;

    return (
      <TouchableOpacity
        className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-700 pb-3"
      >
        <View>
          <Text className="text-base text-black dark:text-white">{biometricsType}</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Enable {biometricsType} authentication
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#059669' }}
          thumbColor={biometricsEnabled ? '#f4f3f4' : '#f4f3f4'}
          onValueChange={handleBiometricsToggle}
          value={biometricsEnabled}
        />
      </TouchableOpacity>
    );
  };

  return (
    <GeneralLayout title="Settings">
      <View>
        <Text className="font-semibold text-lg pt-10 text-black dark:text-white">App Preferences</Text>
        <View className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-700 pb-3">
          <TouchableOpacity
            onPress={() => appNavigation.navigate(PAGES.notifications)}
            className="flex-1 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-base text-black dark:text-white">Notification</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">Turn in-app notification on/off</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#059669' }}
              thumbColor={notificationEnabled ? '#f4f3f4' : '#f4f3f4'}
              onValueChange={() => setNotificationEnabled(!notificationEnabled)}
              value={notificationEnabled}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-700 pb-3"
          onPress={() => setShowThemeModal(true)}
        >
          <View>
            <Text className="text-base text-black dark:text-white">Dark & Light Mode</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">Change the app theme</Text>
          </View>
          <View className="flex-row gap-x-3 items-center">
            <Text className="text-base font-semibold text-black dark:text-white capitalize">
              {selectedTheme}
            </Text>
            <Image source={require('../assets/right-arrow.png')} className="tint-black dark:tint-white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-700 pb-3"
        >
          <View>
            <Text className="text-base text-black dark:text-white">Passcode</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">Passcode login protection</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#059669' }}
            thumbColor={passcodeEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={handlePasscodeToggle}
            value={passcodeEnabled}
          />
        </TouchableOpacity>
        {renderBiometricsOption()}
        <TouchableOpacity
          className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-700 pb-3"
          onPress={() => appNavigation.navigate(PAGES.changePassword)}
        >
          <View>
            <Text className="text-base text-black dark:text-white">Change Password</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">Increase your password strength</Text>
          </View>
          <Image source={require('../assets/right-arrow.png')} className="tint-black dark:tint-white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center mt-3 border-b border-gray-300 dark:border-gray-700 pb-3"
          // onPress={() => appNavigation.navigate(PAGES.language)}
        >
          <View>
            <Text className="text-base text-black dark:text-white">App Language</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">Change app language</Text>
          </View>
          <View className="flex-row gap-x-3 items-center">
            <Text className="text-base font-semibold text-black dark:text-white">EN- US</Text>
            <Image source={require('../assets/right-arrow.png')} className="tint-black dark:tint-white" />
          </View>
        </TouchableOpacity>


        {/* Theme Selection Modal */}
        <Modal
          visible={showThemeModal}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowThemeModal(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <View className="flex-1 bg-black/50 justify-end">
              <View className="bg-white dark:bg-[#292C33] rounded-t-3xl p-6">
                <Text className="text-2xl font-semibold mb-8 text-black dark:text-white">
                  Choose Theme
                </Text>

                <View className="flex-col gap-4 mb-8">
                  {themeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      className={`flex-row justify-between items-center p-4 rounded-xl border ${selectedTheme === option.value
                        ? 'border-[#047857] bg-[#047857]/10'
                        : 'border-gray-300 dark:border-gray-700'
                        }`}
                      onPress={() => handleThemeChange(option.value)}
                    >
                      <Text className={`text-base font-medium ${selectedTheme === option.value
                        ? 'text-[#047857]'
                        : 'text-black dark:text-white'
                        }`}>
                        {option.label}
                      </Text>
                      {selectedTheme === option.value && (
                        <View className="w-6 h-6 bg-[#047857] rounded-full items-center justify-center">
                          <TickCircle
                            size={14}
                            color="#FFFFFF"
                            variant="Bold"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <ButtonComponent
                  title="Done"
                  onPress={() => setShowThemeModal(false)}
                  variant="primary"
                  className="bg-green-700 dark:bg-green-600"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {showPasscodeModal && (
          <PasscodeEntry
            mode="set"
            onSubmit={handlePasscodeSet}
            onCancel={() => setShowPasscodeModal(false)}
          />
        )}

        {showVerifyPasscodeModal && (
          <PasscodeEntry
            mode="verify"
            onSubmit={handleVerifyPasscode}
            onCancel={() => setShowVerifyPasscodeModal(false)}
          />
        )}
      </View>
    </GeneralLayout>
  );
}
