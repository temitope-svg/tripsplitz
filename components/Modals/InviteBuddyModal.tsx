import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import ButtonComponent from '../ButtonComponent';
import { ArrowRight, ProfileRemove } from 'iconsax-react-native';

interface InviteBuddyModalProps {
  visible: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => void;
  inviteType?: 'trip' | 'activity';
}

export function InviteBuddyModal({ visible, onClose, onInvite, inviteType = 'trip'  }: InviteBuddyModalProps) {
  const [email, setEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getEmailError = (emailValue: string) => {
    const normalizedEmail = emailValue.trim().toLowerCase();

    if (!normalizedEmail) {
      return '';
    }

    if (invitedEmails.includes(normalizedEmail)) {
      return 'This email has already been added.';
    }

    if (!emailRegex.test(normalizedEmail)) {
      return 'Please enter a valid email address.';
    }

    return '';
  };

  const showEmailError = (message: string) => {
    setEmailError(message);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setEmailError('');
      errorTimeoutRef.current = null;
    }, 5000);
  };

  const handleEmailChange = (text: string) => {
    const sanitized = text.replace(/\s/g, '');
    if (/^[A-Za-z0-9._%+-@]*$/.test(sanitized)) {
      setEmail(sanitized);
    }
  };

  const handleAddEmail = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const validationError = getEmailError(normalizedEmail);

    if (validationError) {
      showEmailError(validationError);
      return;
    }

    if (!normalizedEmail) return;

    setInvitedEmails([...invitedEmails, normalizedEmail]);
    setEmail('');
    setEmailError('');

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleRemoveEmail = (emailToRemove: string) => {
    setInvitedEmails(invitedEmails.filter(e => e !== emailToRemove));
  };

  const handleClose = () => {
    onInvite(invitedEmails);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-[#292C33] rounded-t-3xl">
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              className="p-6"
            >
              <Text className="text-xl font-semibold mb-4 text-black dark:text-white">Invite to {inviteType === 'trip' ? 'Trip' : 'Activity'}</Text>

              <View className="mb-6">
                <Text className="text-gray-600 mb-2 text-black dark:text-white">Email</Text>
                <View className="flex-row items-center">
                  <TextInput
                    testID="invite-buddy-email-input"
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="example@gmail.com"
                    className={`flex-1 border rounded-lg p-3 mr-2 ${
                      emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />
                  <TouchableOpacity 
                    onPress={handleAddEmail}
                    testID="invite-buddy-add-email-button"
                    className="bg-green-700 dark:bg-[#54585C] p-3 rounded-lg"
                  >
                    <ArrowRight size={20} className="text-white" />
                  </TouchableOpacity>
                </View>
                {!!emailError && (
                  <Text className="text-red-500 dark:text-red-400 text-xs mt-2">
                    {emailError}
                  </Text>
                )}
              </View>

              {invitedEmails.length > 0 && (
                <View className="mb-6">
                  <Text className="text-gray-600 mb-2">Invited Buddies</Text>
                  {invitedEmails.map((invitedEmail, index) => (
                    <View key={index} className="flex-row items-center justify-between bg-gray-100 dark:bg-transparent dark:text-white p-3 rounded-lg mb-2">
                      <Text>{invitedEmail}</Text>
                      <TouchableOpacity onPress={() => handleRemoveEmail(invitedEmail)}>
                        <ProfileRemove size={16} color="#059669" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <View className="mt-4">
                <ButtonComponent
                  title="Close"
                  onPress={handleClose}
                  variant="primary"
                  className="bg-green-700"
                  testID="invite-buddy-close-button"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
} 
