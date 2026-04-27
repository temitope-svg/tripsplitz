/**
 * @format
 */

import { LogBox } from 'react-native';

if (__DEV__) {
    require('./ReactotronConfig');
    // Disable all LogBox warnings to prevent them from blocking Detox E2E tests
    LogBox.ignoreAllLogs(true);
}

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-get-random-values'

AppRegistry.registerComponent(appName, () => App);
