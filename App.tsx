import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { RootStackParamsList } from './utils/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './pages/Onboarding';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Otp from './pages/Otp';
import ResetEmail from './pages/ResetEmail';
import ResetPassword from './pages/ResetPassword';
import PasswordSuccess from './pages/PasswordSuccess';
import TabNavigator from './components/TabNavigator';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Language from './pages/Language';
import Privacy from './pages/Privacy';
import Notifications from './pages/Notifications';
import UpcomingTrips from './pages/UpcomingTrips';
import AllExpense from './pages/AllExpense';
import CreatePasscode from './pages/CreatePasscode';
import ChangePasscode from './pages/ChangePasscode';
import ChangePassword from './pages/ChangePassword';
import Trip from './pages/Trip';
import AddActivity from './pages/AddActivity';
import Activity from './pages/Activity';
import EditProfileItem from './pages/EditProfileItem';
import ExpenseActivities from './pages/ExpenseActivities';
import UpcomingExpense from './pages/UpcomingExpense';
import Activities from './pages/Activities';
import AllTrips from './pages/AllTrips';
import Buddies from './pages/Buddies';
import ToReceive from './pages/ToReceive';
import ToPay from './pages/ToPay';

import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { reduxStore } from './store';
import { NotificationContextProvider } from './components/Notification';
import { LoadingAnimationProvider } from './components/LoadingAnimation';
import { navigationRef } from './utils/navigation';
import PayActivity from './pages/PayActivity';
import TotalExpense from './pages/TotalExpense';
import EditTrip from './pages/EditTrip';
import Statement from './pages/Statement';
import SummaryActivity from './pages/SummaryActivity';
// import { initializeFirebase } from './config/firebase';
import { requestUserPermission, notificationListener } from './utils/notification';
import BootSplash from 'react-native-bootsplash';
import PayTrip from './pages/PayTrip';
import { storage } from './utils/storage';
import { biometrics } from './utils/biometrics';
import useNotify from './hooks/useNotify';
import { AppState, AppStateStatus } from 'react-native';
import PasscodeEntry from './components/PasscodeEntry';
import AddNoTripActivity from './pages/AddNoTripActivity';
import { api_url } from './utils/api.util';
import UserStatement from './pages/UserStatement';
import AcceptRejectTrip from './pages/AcceptRejectTrip';
import AboutApp from './pages/AboutApp';
import { clearLocalSession, logoutSession, refreshStoredSession } from './utils/session';
import { queryClient } from './utils/queryClient';
import { PAGES } from './utils/pages';
import { useColorScheme } from 'nativewind';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const linking = {
  prefixes: [
    'tripsplitz://',
    api_url,
  ],
  config: {
    screens: {
      activity: {
        path: 'activity/:activity',
        parse: {
          activity: (activity: string) => (activity),
        },
      },
      tripDetails: {
        path: 'trip/:tripId',
        parse: {
          tripId: (tripId: string) => (tripId),
        },
      },
      activities: {
        path: 'activities',
      },
      upcomingExpense: {
        path: 'upcoming-expenses',
      },
      allExpense: {
        path: 'expenses',
      },
      toPay: {
        path: 'payables',
      },
      toReceive: {
        path: 'receivables',
      },
    }
  }
};

function App(): React.JSX.Element | null {
  const { Navigator, Screen } = Stack;
  const { setColorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamsList>('onboarding');
  const { showSnackBar } = useNotify();
  const [showPasscodeEntry, setShowPasscodeEntry] = useState(false);

  const restoreSession = useCallback(async (userData: any) => {
    const refreshedUserData = await refreshStoredSession(userData);

    if (!refreshedUserData) {
      showSnackBar('Your session has expired. Please login again.', 'error');
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: PAGES.login.name }],
      });
      return false;
    }

    return true;
  }, [showSnackBar]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedTheme = await storage.getThemePreference();
        setColorScheme(savedTheme);

        // Check for stored user data
        const userData = await storage.getUserData();
        const isFaceIdEnabled = await storage.getFaceIdEnabled();

        if (userData) {
          // If Face ID is enabled, require authentication
          if (isFaceIdEnabled) {
            const isAuthenticated = await biometrics.authenticate();
            
            if (!isAuthenticated) {
              const isPasscodeEnabled = await storage.getPasscodeEnabled();
              if (isPasscodeEnabled) {
                setInitialRouteName('login');
                setShowPasscodeEntry(true);
              } else {
                await clearLocalSession();
                setInitialRouteName('login');
                showSnackBar('Authentication required', 'error');
              }
            } else {
              const isRestored = await restoreSession(userData);
              setInitialRouteName(isRestored ? 'home' : 'login');
            }
          } else {
            const isRestored = await restoreSession(userData);
            setInitialRouteName(isRestored ? 'home' : 'login');
          }
        } else {
          setInitialRouteName('onboarding');
        }

        const initNotifications = async () => {
          await requestUserPermission();
          notificationListener();
        };

        await initNotifications();
      } catch (error) {
        console.error('Error initializing app:', error);
        // On error, clear user data to be safe
        await clearLocalSession();
      } finally {
        setIsLoading(false);
        await BootSplash.hide({ fade: true });
      }
    };

    initApp();
  }, [restoreSession, setColorScheme, showSnackBar]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App is going to background, save timestamp
        await storage.setLastActive();
      } else if (nextAppState === 'active') {
        // App has come to foreground
        const userData = await storage.getUserData();
        const isFaceIdEnabled = await storage.getFaceIdEnabled();
        const lastActive = await storage.getLastActive();
        const timeInBackground = Date.now() - lastActive;

        // Refresh stored user data after the app has been away for a while.
        if (userData && timeInBackground > 5 * 60 * 1000) {
          if (isFaceIdEnabled) {
            const isAuthenticated = await biometrics.authenticate();
            if (!isAuthenticated) {
              const isPasscodeEnabled = await storage.getPasscodeEnabled();
              if (isPasscodeEnabled) {
                setShowPasscodeEntry(true);
              } else {
                await clearLocalSession();
                showSnackBar('Authentication required', 'error');
              }
              return;
            }
          } else {
            const isPasscodeEnabled = await storage.getPasscodeEnabled();
            if (isPasscodeEnabled) {
              setShowPasscodeEntry(true);
              return;
            }
          }

          await restoreSession(userData);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [restoreSession, showSnackBar]);

  const handlePasscodeVerify = async (passcode: string) => {
    try {
      const storedPasscode = await storage.getPasscode();
      const currentUserData = await storage.getUserData();

      if (passcode === storedPasscode && currentUserData) {
        const isRestored = await restoreSession(currentUserData);
        if (!isRestored) {
          setShowPasscodeEntry(false);
          return false;
        }

        setShowPasscodeEntry(false);
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'home' }],
        });
        showSnackBar('Authentication successful', 'success');
      } else {
        // Return false to trigger error handling in PasscodeEntry
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verifying passcode:', error);
      showSnackBar('Error verifying passcode', 'error');
      return false;
    }
  };

  const handlePasscodeLogout = async () => {
    await logoutSession();
    setShowPasscodeEntry(false);
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: PAGES.login.name }],
    });
  };

  if (isLoading) {
    return null; // Or a loading screen component
  }

  return (
    <Provider store={reduxStore}>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <LoadingAnimationProvider>
            <NavigationContainer linking={linking} ref={navigationRef}>
              <Navigator 
                initialRouteName={initialRouteName}
                screenOptions={{ headerShown: false }}
              >
                <Screen name="onboarding" component={Onboarding} />
                <Screen name="signup" component={Signup} />
                <Screen name="login" component={Login} />
                <Screen name="otp" component={Otp} />
                <Screen name="resetEmail" component={ResetEmail} />
                <Screen name="resetPassword" component={ResetPassword} />
                <Screen name="passwordSuccess" component={PasswordSuccess} />
                <Screen name="home" component={TabNavigator} />
                <Screen name="editProfile" component={EditProfile} />
                <Screen name="editDisplayName" component={EditProfileItem} />
                <Screen name="settings" component={Settings} />
                <Screen name="language" component={Language} />
                <Screen name="privacy" component={Privacy} />
                <Screen name="notifications" component={Notifications} />
                <Screen name="upcomingTrips" component={UpcomingTrips} />
                <Screen name="allExpense" component={AllExpense} />
                <Screen name="createPasscode" component={CreatePasscode} />
                <Screen name="changePasscode" component={ChangePasscode} />
                <Screen name="changePassword" component={ChangePassword} />
                <Screen name="tripDetails" component={Trip} />
                <Screen name="addActivity" component={AddActivity} />
                <Screen name="activity" component={Activity} />
                <Screen name="payActivity" component={PayActivity} />
                <Screen name="expenseActivities" component={ExpenseActivities} />
                <Screen name="upcomingExpense" component={UpcomingExpense} />
                <Screen name="activities" component={Activities} />
                <Screen name="allTrips" component={AllTrips} />
                <Screen name="buddies" component={Buddies} />
                <Screen name="totalExpense" component={TotalExpense} />
                <Screen name="editTrip" component={EditTrip} />
                <Screen name="statement" component={Statement} />
                <Screen name="summaryActivity" component={SummaryActivity} />
                <Screen name="toReceive" component={ToReceive} />
                <Screen name="toPay" component={ToPay} />
                <Screen name="payTrip" component={PayTrip} />
                <Screen name="addNoTripActivity" component={AddNoTripActivity} />
                <Screen name="userStatement" component={UserStatement} />
                <Screen name="acceptRejectTrip" component={AcceptRejectTrip} />
                <Screen name="aboutApp" component={AboutApp} />
              </Navigator>
              {showPasscodeEntry && (
                <PasscodeEntry
                  mode="verify"
                  onSubmit={handlePasscodeVerify}
                  showLogout
                  onLogout={handlePasscodeLogout}
                />
              )}
            </NavigationContainer>
          </LoadingAnimationProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
