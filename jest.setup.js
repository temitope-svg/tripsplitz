/* eslint-env jest */

jest.mock(
  '@react-native-async-storage/async-storage',
  () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(async () => {}),
  isVisible: jest.fn(async () => false),
}));

jest.mock('react-native-biometrics', () => {
  const ReactNativeBiometrics = jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn(async () => ({
      available: false,
      biometryType: undefined,
    })),
    simplePrompt: jest.fn(async () => ({
      success: false,
    })),
  }));

  return {
    __esModule: true,
    default: ReactNativeBiometrics,
    BiometryTypes: {
      Biometrics: 'Biometrics',
      TouchID: 'TouchID',
      FaceID: 'FaceID',
    },
  };
});

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(async () => 'default'),
    displayNotification: jest.fn(async () => {}),
  },
  AndroidImportance: {
    HIGH: 'HIGH',
  },
}));

jest.mock('@react-native-firebase/messaging', () => {
  const messaging = () => ({
    requestPermission: jest.fn(async () => 1),
    registerDeviceForRemoteMessages: jest.fn(async () => {}),
    getToken: jest.fn(async () => 'test-token'),
    setBackgroundMessageHandler: jest.fn(),
    onMessage: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(async () => null),
  });

  messaging.AuthorizationStatus = {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  };

  return {
    __esModule: true,
    default: messaging,
  };
});

jest.mock('react-native-device-info', () => ({
  __esModule: true,
  default: {
    getUniqueId: jest.fn(async () => 'test-device-id'),
    getSystemName: jest.fn(() => 'iOS'),
    getVersion: jest.fn(() => '1.0.0'),
  },
}));
