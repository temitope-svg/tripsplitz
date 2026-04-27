import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

// Create a notification channel for Android
async function createChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });
  }
}

export async function requestUserPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  } else if (Platform.OS === 'android') {
    // For Android 13 and above
    if (Platform.Version >= 33) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return permission === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
}

export async function getFCMToken() {
  try {
    // initializeFirebase();
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
}

export const notificationListener = () => {
  // Create channel when app starts
  createChannel();

  // Handle background messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background Message:', JSON.stringify(remoteMessage, null, 2));
    displayNotification(remoteMessage);
  });

  // Handle foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message:', JSON.stringify(remoteMessage, null, 2));
    displayNotification(remoteMessage);
  });

  // Handle notification open
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open:', remoteMessage);
    // Navigate to appropriate screen based on the notification data
    handleNotificationOpen(remoteMessage);
  });

  // Check if app was opened from a notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        // Navigate to appropriate screen based on the notification data
        handleNotificationOpen(remoteMessage);
      }
    });
};

async function displayNotification(remoteMessage: any) {
  const { notification, data } = remoteMessage;

  await notifee.displayNotification({
    title: notification?.title,
    body: notification?.body,
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
      sound: 'default',
    },
    ios: {
      sound: 'default',
    },
    data: data,
  });
}

function handleNotificationOpen(remoteMessage: any) {
  // Handle navigation based on notification data
  const { data } = remoteMessage;
  
  if (data?.type === 'trip') {
    // Navigate to trip details
    // navigationRef.navigate('tripDetails', { tripId: data.tripId });
  } else if (data?.type === 'expense') {
    // Navigate to expense details
    // navigationRef.navigate('expenseDetails', { expenseId: data.expenseId });
  }
} 