# RN Upgrade Step 1 Baseline

This file records the Step 1 baseline for the staged upgrade from React Native `0.75.3` to React Native `0.85.x`.

## Branch

- Upgrade branch: `chore/rn-0.85-staged-upgrade`
- Baseline source branch before upgrade work: `main`

## Current Versions

- `react-native`: `0.75.3`
- `react`: `18.3.1`
- `react-test-renderer`: `18.3.1`
- `@react-native/babel-preset`: `0.75.3`
- `@react-native/eslint-config`: `0.75.3`
- `@react-native/metro-config`: `0.75.3`
- `@react-native/typescript-config`: `0.75.3`

## Frozen Assumptions

These settings are intentionally preserved during Step 1.

- `newArchEnabled=false` in `android/gradle.properties`
- `hermesEnabled=true` in `android/gradle.properties`
- Jest preset remains `react-native` in `jest.config.js`
- Splash library remains `react-native-splash-screen`
- Existing native integrations remain untouched in this step:
  - Firebase App
  - Firebase Messaging
  - Notifee
  - Maps

## Baseline Files To Diff In Each Upgrade Hop

- `package.json`
- `babel.config.js`
- `metro.config.js`
- `jest.config.js`
- `android/build.gradle`
- `android/app/build.gradle`
- `android/gradle.properties`
- `android/gradle/wrapper/gradle-wrapper.properties`
- `ios/Podfile`

## High-Risk Libraries To Revalidate At Every Hop

- `react-native-reanimated` (`^3.17.5`)
- `react-native-screens` (`^3.34.0`)
- `react-native-gesture-handler` (`^2.20.2`)
- `react-native-safe-area-context` (`^5.4.0`)
- `@react-native-firebase/app` (`^21.7.2`)
- `@react-native-firebase/messaging` (`^21.7.2`)
- `@notifee/react-native` (`^9.1.8`)
- `react-native-maps` (`1.20.1`)
- `react-native-image-picker` (`^7.2.3`)
- `nativewind` (`^4.1.23`)
- `react-native-splash-screen` (`^3.3.0`)

## Step 1 Exit Conditions

Step 1 is complete only when all of the following are true:

- The upgrade branch exists and is checked out
- The working tree is clean
- The current RN and React toolchain versions are confirmed
- The current native and runtime defaults are explicitly preserved
- The file comparison set and high-risk library set are recorded for Step 2

## Notes

- No packages are upgraded in this step
- No Android or iOS template files are changed in this step
- No codemods are run in this step
- `tripsplitz-pro` remains untouched
