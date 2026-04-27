import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { CloseCircle } from 'iconsax-react-native';
import api from '../../../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Feather from 'react-native-vector-icons/Feather';
import { formatCurrency } from '../../../utils/currency.util';
import { getRandomColor } from '../../../utils/color.util';
import { handleApiError } from '../../../utils/error.util';
import useNotify from '../../../hooks/useNotify';

interface ActivityRequestModalProps {
  visible: boolean;
  onClose: () => void;
  notification: any;
  isLoading?: boolean;
}

export const ActivityRequestModal = ({
  visible,
  onClose,
  notification,
  isLoading: parentLoading
}: ActivityRequestModalProps) => {
  const activity = notification?.additional_data?.activity;
  const queryClient = useQueryClient();
  const { showSnackBar } = useNotify();

  // Fetch activity if ID is passed
  const { data, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', activity?.id],
    queryFn: () => api.activity.getActivityById(activity?.id.toString())
  });

  const activityResponse = useMutation({
    mutationFn: ({ status }: { status: 'accepted' | 'rejected' }) => 
      api.activity.respondToActivity(activity?.id.toString(), status),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activity?.id] });
      // Close the modal
      onClose();
    }
  });

  const handleResponse = async (status: 'accepted' | 'rejected') => {
    try {
      await activityResponse.mutateAsync({ status });
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: `Failed to ${status} activity request`
      });
    }
  };

  const isLoading = parentLoading || activityLoading || activityResponse.isPending;

  const renderContent = () => {
    if (activityLoading) {
      return (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          {/* <Text className="text-gray-500 dark:text-gray-400 mt-4">
            Loading activity details...
          </Text> */}
        </View>
      );
    }

    return (
      <View className="space-y-4">
        <Text className=' text-black dark:text-white text-xl font-semibold'>{data?.created_by.name} requests your interest  on this activity</Text>

        <View className='my-3 bg-[#F8F9FA] rounded-lg p-4 flex-row gap-x-6'>

          <View className='flex-row items-center gap-2'>
            <Feather name='map-pin' size={16} color='#000' />
            <Text className=' text-black dark:text-white text-lg font-semibold'>{data?.trip.location}</Text>
          </View>

          <View className='flex-row items-center gap-2'>
            <Feather name='calendar' size={12} color='#000' />
            <Text className=' text-black dark:text-white text-sm'>{data?.scheduled_at.date} / {data?.scheduled_at.time}</Text>
          </View>
        </View>

        <View className='mb-4'>
          <Text className=' text-black dark:text-white text-xl font-light'>Activity Name</Text>

          <View className='bg-[#F8F9FA] rounded-lg p-4 mt-2'>
            <Text className=' text-black dark:text-white text-2xl font-regular'>{data?.name}</Text>
          </View>
        </View>

        <View className='mb-4'>
          <Text className=' text-black dark:text-white text-xl font-light'>Price</Text>

          <View className='bg-[#F8F9FA] rounded-lg p-4 mt-2 self-start'>
            <Text className=' text-black dark:text-white text-2xl font-regular'>{formatCurrency(data?.cost)}</Text>
          </View>
        </View>

        <View className='mb-4'>
          <Text className=' text-black dark:text-white text-xl font-semibold mb-3'>Activity Buddies</Text>
          <View className='flex-row gap-x-2'>
            {
              data?.participants.map((participant: any) => (
                <View key={participant.id} className='flex-col items-center gap-x-2'>
                  <View style={{ backgroundColor: getRandomColor() }} className=' rounded-full w-10 h-10 items-center justify-center'>
                    <Text className='text-white text-lg font-semibold'>{participant.initials}</Text>
                  </View>
                  <Text className=' text-black dark:text-white text-sm font-regular'>{participant.name}</Text>
                </View>
              ))
            }
          </View>
        </View>
      </View>
    );
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
            <View className="p-6">
              <TouchableOpacity
                onPress={onClose}
                className="absolute right-4 top-4 z-10"
                disabled={isLoading}
              >
                <CloseCircle
                  size={24}
                  color="#878F96"
                  variant="Bold"
                />
              </TouchableOpacity>

              <Text className="text-base font-semibold mb-4 text-black dark:text-white pr-8">
                Activity Request
              </Text>

              {renderContent()}

              <View className="mt-6 space-y-3">
                <TouchableOpacity
                  className="bg-emerald-600 p-4 rounded-lg"
                  onPress={() => handleResponse('accepted')}
                  disabled={isLoading}
                >
                  <Text className="text-white text-center font-semibold">
                    {isLoading ? 'Loading...' : 'Add Me'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="p-4 rounded-lg"
                  onPress={() => handleResponse('rejected')}
                  disabled={isLoading}
                >
                  <Text className="text-emerald-600 text-center font-semibold">
                    Remove Me
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}; 