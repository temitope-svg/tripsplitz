import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import AuthLayout from '../layouts/AuthLayout';
import ButtonComponent from './ButtonComponent';
import useNotify from '../hooks/useNotify';

interface PasscodeEntryProps {
  onSubmit: (passcode: string) => Promise<boolean>;
  onCancel?: () => void;
  mode: 'set' | 'verify';
  showLogout?: boolean;
  onLogout?: () => void;
}

export default function PasscodeEntry({ 
  onSubmit, 
  onCancel, 
  mode,
  showLogout,
  onLogout 
}: PasscodeEntryProps) {
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const { showSnackBar } = useNotify();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleError = (message: string) => {
    shake();
    showSnackBar(message, 'error');
    if (mode === 'set') {
      setPasscode('');
      setConfirmPasscode('');
      setIsConfirming(false);
    } else {
      setPasscode('');
    }
  };

  const handleNumberPress = (number: string) => {
    if (isConfirming) {
      if (confirmPasscode.length < 6) {
        setConfirmPasscode(prev => prev + number);
      }
    } else {
      if (passcode.length < 6) {
        setPasscode(prev => prev + number);
      }
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPasscode(prev => prev.slice(0, -1));
    } else {
      setPasscode(prev => prev.slice(0, -1));
    }
  };

  const handleContinue = async () => {
    if (mode === 'set') {
      if (!isConfirming) {
        setIsConfirming(true);
        return;
      }
      if (passcode === confirmPasscode) {
        onSubmit(passcode);
      } else {
        handleError('Passcodes do not match');
      }
    } else {
      const success = await onSubmit(passcode);
      if (!success) {
        handleError('Invalid passcode');
      }
    }
  };

  const content = (
    <View className="flex-1 justify-between">
      <View className="items-center mt-8">
        <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
          {isConfirming ? 'Confirm your passcode' : 'Enter 6-digit passcode'}
        </Text>
        
        <Animated.View 
          style={{ transform: [{ translateX: shakeAnimation }] }}
          className="flex-row justify-center space-x-4 mb-12"
        >
          {Array(6).fill(0).map((_, i) => (
            <View 
              key={i} 
              className={`w-3 h-3 rounded-full ${
                (isConfirming ? confirmPasscode : passcode).length > i 
                  ? 'bg-[#047857]' 
                  : 'bg-gray-300 dark:bg-gray-700'
              }`} 
            />
          ))}
        </Animated.View>

        <View className="w-full px-6">
          <View className="flex-row flex-wrap justify-between mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
              <TouchableOpacity
                key={number}
                className="w-24 h-24 items-center justify-center mb-4"
                onPress={() => handleNumberPress(number.toString())}
              >
                <Text className="text-2xl text-black dark:text-white">
                  {number}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="w-24 h-24 items-center justify-center"
              onPress={onCancel}
            >
              <Text className="text-lg text-red-500">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 h-24 items-center justify-center"
              onPress={() => handleNumberPress('0')}
            >
              <Text className="text-2xl text-black dark:text-white">0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 h-24 items-center justify-center"
              onPress={handleDelete}
            >
              <Text className="text-lg text-black dark:text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="mt-auto mb-6 space-y-4">
        <ButtonComponent
          title={isConfirming ? "Confirm Passcode" : "Continue"}
          onPress={handleContinue}
          variant="primary"
          disabled={(isConfirming ? confirmPasscode : passcode).length !== 6}
        />
        
        {showLogout && (
          <ButtonComponent
            title="Logout"
            onPress={onLogout}
            variant="secondary"
          />
        )}
      </View>
    </View>
  );

  const modalContent = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-[#292C33]"
    >
      <AuthLayout title={mode === 'set' ? 'Set Passcode' : 'Enter Passcode'}>
        {content}
      </AuthLayout>
    </KeyboardAvoidingView>
  );

  // If it's verify mode, render in a modal too
  if (mode === 'verify') {
    return (
      <Modal
        visible={true}
        transparent={false}
        animationType="slide"
      >
        {modalContent}
      </Modal>
    );
  }

  // For set mode
  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="slide"
      onRequestClose={onCancel}
    >
      {modalContent}
    </Modal>
  );
} 