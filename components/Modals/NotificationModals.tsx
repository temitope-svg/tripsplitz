import React from 'react';
import {View, Text, Modal, Image} from 'react-native';
import ButtonComponent from '../ButtonComponent';
import {formatCurrency} from '../../utils/currency.util';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  notification: NotificationProps;
}

// Activity Payment Request Modal
export function ActivityPaymentRequestModal({visible, onClose, notification: _notification}: BaseModalProps) {
  const activityCost = 24; // This should come from the activity details
  const paidAmount = 0;
  const owingAmount = activityCost - paidAmount;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl">
          <View className="p-6">
            {/* Header with back button */}
            <View className="flex-row items-center mb-6">
              <Text className="text-xl font-semibold">Pay</Text>
            </View>

            {/* Cost Summary */}
            <View className="flex-row justify-between mb-8">
              <View className="items-center">
                <Text className="text-gray-500 mb-2">Activity Cost</Text>
                <Text className="text-2xl font-semibold">{formatCurrency(activityCost)}</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 mb-2">Paid</Text>
                <Text className="text-2xl font-semibold">{formatCurrency(paidAmount)}</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 mb-2">Owing</Text>
                <Text className="text-2xl font-semibold">{formatCurrency(owingAmount)}</Text>
              </View>
            </View>

            {/* Activity Details */}
            <View className="bg-gray-50 p-4 rounded-xl mb-6">
              <Text className="text-gray-500 mb-2">Activity Name</Text>
              <Text className="text-xl font-semibold mb-1">Picnic</Text>
              <Text className="text-gray-500">Oct 29 12:12pm</Text>
            </View>

            {/* Trip Hosts */}
            <View className="mb-6">
              <Text className="text-gray-500 mb-3">Trip Hosted by</Text>
              <View className="flex-row">
                <View className="items-center mr-4">
                  <View className="w-10 h-10 rounded-full bg-red-400 items-center justify-center mb-1">
                    <Text className="text-white font-semibold">S</Text>
                  </View>
                  <Text className="text-xs text-gray-500">Shade</Text>
                  <Text className="text-xs text-gray-400">Co-host</Text>
                </View>
                <View className="items-center mr-4">
                  <View className="w-10 h-10 rounded-full bg-blue-400 items-center justify-center mb-1">
                    <Text className="text-white font-semibold">P</Text>
                  </View>
                  <Text className="text-xs text-gray-500">Philip</Text>
                  <Text className="text-xs text-gray-400">Co-host</Text>
                </View>
                <View className="items-center">
                  <View className="w-10 h-10 rounded-full bg-pink-200 items-center justify-center mb-1">
                    <Text className="text-white font-semibold">T</Text>
                  </View>
                  <Text className="text-xs text-gray-500">Tayo</Text>
                  <Text className="text-xs text-gray-400">Host</Text>
                </View>
              </View>
            </View>

            {/* Activity Buddies */}
            <View className="mb-6">
              <Text className="text-gray-500 mb-3">Activity Buddy</Text>
              <View className="flex-row flex-wrap">
                {['Victor', 'Grace', 'Peace', 'Chris', 'Sofie'].map((name, index) => (
                  <View key={index} className="items-center mr-4 mb-2">
                    <View className="w-10 h-10 rounded-full bg-green-400 items-center justify-center mb-1">
                      <Text className="text-white font-semibold">{name[0]}</Text>
                    </View>
                    <Text className="text-xs text-gray-500">{name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Trip Details */}
            <View>
              <Text className="text-gray-500 mb-3">Trip</Text>
              <View className="flex-row items-center mb-2">
                <Text className="text-base">Paris</Text>
              </View>
              <Text className="text-gray-500">Oct 27 - Nov 30th / 2024</Text>
              <Image 
                source={{ uri: `https://picsum.photos/1100/700` }} 
                className="w-full h-32 rounded-xl mt-2"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="p-6 space-y-3">
            <ButtonComponent
              title="Pay"
              variant="primary"
              className="bg-green-700"
              onPress={() => {
                // Handle payment
                onClose();
              }}
            />
            <ButtonComponent
              title="Close"
              variant="text"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Activity Interest Request Modal
export function ActivityInterestRequestModal({visible, onClose, notification}: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <Text className="text-xl font-semibold mb-4">Interest Request</Text>
          <Text className="text-gray-600 mb-6">
            {notification.userName} wants to join this activity
          </Text>
          <View className="space-y-3">
            <ButtonComponent
              title="Accept"
              variant="primary"
              className="bg-green-700"
              onPress={() => {
                // Handle accept interest
                onClose();
              }}
            />
            <ButtonComponent
              title="Decline"
              variant="text"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Trip Activity Request Modal
export function TripActivityRequestModal({visible, onClose, notification}: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <Text className="text-xl font-semibold mb-4">New Activity Request</Text>
          <Text className="text-gray-600 mb-6">
            {notification.userName} wants to add a new activity to the trip
          </Text>
          <View className="space-y-3">
            <ButtonComponent
              title="View Activity"
              variant="primary"
              className="bg-green-700"
              onPress={() => {
                // Navigate to activity details
                onClose();
              }}
            />
            <ButtonComponent
              title="Close"
              variant="text"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Payment Notification Modal
export function PaymentNotificationModal({visible, onClose, notification}: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <Text className="text-xl font-semibold mb-4">Payment Received</Text>
          <Text className="text-gray-600 mb-6">
            {notification.userName} has made a payment
          </Text>
          <ButtonComponent
            title="Close"
            variant="text"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

// Trip Payment Request Modal
export function TripPaymentRequestModal({visible, onClose, notification}: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <Text className="text-xl font-semibold mb-4">Trip Payment Request</Text>
          <Text className="text-gray-600 mb-6">
            {notification.userName} is requesting payment for the trip
          </Text>
          <View className="space-y-3">
            <ButtonComponent
              title="Pay Now"
              variant="primary"
              className="bg-green-700"
              onPress={() => {
                // Handle payment
                onClose();
              }}
            />
            <ButtonComponent
              title="Later"
              variant="text"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
} 
