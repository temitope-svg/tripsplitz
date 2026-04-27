import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { createContext, useContext } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

let timeout: NodeJS.Timeout;
let showNotificationFunction: (message: string, type: 'success' | 'error') => void;

const NotificationProvider = () => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const [notification, setNotification] = React.useState<NotificationProps | null>(null);

  const show = useCallback((message: string, type: 'success' | 'error' = 'error') => {
    setNotification({ message, type });
    
    if (timeout) {
      clearTimeout(timeout);
    }

    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    timeout = setTimeout(() => {
      setNotification(null);
    }, 2600);
  }, [translateY]);

  // Store the show function in our global variable
  useEffect(() => {
    showNotificationFunction = show;
  }, [show]);

  if (!notification) return null;

  return (
    <Animated.View
      style={[{ transform: [{ translateY }] }]}
      className="absolute top-12 left-0 right-0 z-50 mx-4">
      <View
        className={`p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
        <Text
          className={`text-center font-medium ${
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
          {notification.message}
        </Text>
      </View>
    </Animated.View>
  );
};

const NotificationContext = createContext<{
  showNotification: (message: string, type?: 'success' | 'error') => void;
}>({
  showNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationContextProvider = ({ children }: { children: React.ReactNode }) => {
  const showNotification = (message: string, type: 'success' | 'error' = 'error') => {
    if (showNotificationFunction) {
      showNotificationFunction(message, type);
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationProvider />
    </NotificationContext.Provider>
  );
}; 
