import {NavigationContainer} from '@react-navigation/native';
import { reduxStore } from '../store';
import {StatusBar,} from 'react-native';
import React, {ReactNode} from 'react';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {Provider as StoreProvider} from 'react-redux';
import {useColorScheme } from "nativewind";

// Separate StatusBar component to access theme context
const ThemedStatusBar = () => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme == 'dark'
  return (
    <StatusBar 
      barStyle={isDarkMode ? "light-content" : "dark-content"}
      backgroundColor={isDarkMode ? "#292C33" : "#ffffff"}
    />
  );
};

const AppManager = ({children}: {children: ReactNode}) => {
  return (
    <SafeAreaProvider>
      <StoreProvider store={reduxStore}>
          <NavigationContainer>
            <PaperProvider>
              <ThemedStatusBar />
              {children}
              <Toast />
            </PaperProvider>
          </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
};

export default AppManager;
