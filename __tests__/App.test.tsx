/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../utils/storage', () => ({
  storage: {
    getThemePreference: jest.fn(async () => 'light'),
    getUserData: jest.fn(async () => null),
    getFaceIdEnabled: jest.fn(async () => false),
    getPasscodeEnabled: jest.fn(async () => false),
    getLastActive: jest.fn(async () => 0),
    getPasscode: jest.fn(async () => null),
    setLastActive: jest.fn(async () => undefined),
  },
}));

jest.mock('../utils/notification', () => ({
  requestUserPermission: jest.fn(async () => true),
  notificationListener: jest.fn(),
}));

jest.mock('../utils/biometrics', () => ({
  biometrics: {
    authenticate: jest.fn(async () => true),
  },
}));

jest.mock('../utils/session', () => ({
  clearLocalSession: jest.fn(async () => undefined),
  logoutSession: jest.fn(async () => undefined),
  refreshStoredSession: jest.fn(async (userData: unknown) => userData),
}));

jest.mock('nativewind', () => ({
  useColorScheme: () => ({
    colorScheme: 'light',
    setColorScheme: jest.fn(),
  }),
}));

test('renders correctly', async () => {
  let app: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    app = ReactTestRenderer.create(<App />);
  });

  expect(app!).toBeTruthy();
});
