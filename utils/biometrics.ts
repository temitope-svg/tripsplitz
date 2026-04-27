import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { Platform } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();

export const biometrics = {
  async isBiometricsAvailable() {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      return {
        available,
        biometryType,
        isFaceId: biometryType === BiometryTypes.FaceID,
        isFingerprint: biometryType === BiometryTypes.TouchID || biometryType === BiometryTypes.Biometrics
      };
    } catch (error) {
      console.error('Error checking biometrics availability:', error);
      return {
        available: false,
        biometryType: undefined,
        isFaceId: false,
        isFingerprint: false
      };
    }
  },

  async authenticate() {
    try {
      const { biometryType } = await rnBiometrics.isSensorAvailable();
      
      let promptMessage = 'Authenticate';
      if (biometryType === BiometryTypes.FaceID) {
        promptMessage = 'Authenticate with Face ID';
      } else if (biometryType === BiometryTypes.TouchID || biometryType === BiometryTypes.Biometrics) {
        promptMessage = Platform.OS === 'ios' ? 'Authenticate with Touch ID' : 'Authenticate with Fingerprint';
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel'
      });
      return success;
    } catch (error) {
      console.error('Error authenticating with biometrics:', error);
      return false;
    }
  }
}; 