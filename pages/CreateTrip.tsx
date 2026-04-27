import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, useColorScheme } from 'react-native';
import useAppNavigation from '../hooks/useAppNavigation';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import ButtonComponent from '../components/ButtonComponent';
import { CreateTripModal } from '../components/Modals';
import * as Yup from 'yup';
import api from '../api';
import useNotify from '../hooks/useNotify';
import useAnimate from '../hooks/useAnimate';
import { handleApiError } from '../utils/error.util';
import { PAGES } from '../utils/pages';
import { FormikProps } from 'formik';
import { FilePickerRef } from '../containers/forms/formik/formik-file-picker';
import { InviteBuddyModal } from '../components/Modals/InviteBuddyModal';
import { PaymentMethodModal } from '../components/Modals/PaymentMethodModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GeneralLayout from '../layouts/GeneralLayout';
import { Profile2User } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { CoHostModal } from '../components/Modals/CoHostModal';
import { usePageFocus } from '../hooks/usePageFocus';
import { colorScheme } from 'nativewind';

// Validation schema
const CreateTripSchema = Yup.object().shape({
  tripName: Yup.string()
    .required('Trip name is required')
    .min(2, 'Trip name must be at least 2 characters'),
  budget: Yup.string()
    .required('Budget is required')
    .test('is-currency', 'Invalid amount', value => {
      if (!value) return false;
      return /^\d*\.?\d{0,2}$/.test(value);
    }),
  location: Yup.string()
    .required('Location is required'),
  dates: Yup.string()
    .required('Dates are required'),
  image: Yup.mixed()
    .required('Trip image is required'),
});

interface CreateTripFormValues {
  tripName: string;
  budget: string;
  location: string;
  dates: string;
  image: any;
}

interface TripResponse {
  data: {
    id: number;
    name: string;
    budget: string;
    location: string;
    startDate: string;
    endDate: string;
    currency: string;
    trip_image: string;
    share_token: string;
    // ... other fields
  };
  message: string;
  share_token: string;
}

export default function CreateTrip() {
  const appNavigation = useAppNavigation();
  const navigation = useNavigation();
  const { showSnackBar } = useNotify();
  const { showLoading } = useAnimate();
  const [modalVisible, setModalVisible] = useState(false);
  const formRef = useRef<FormikProps<CreateTripFormValues>>(null);
  const filePickerRef = useRef<FilePickerRef>(null);
  const [invitedBuddies, setInvitedBuddies] = useState<string[]>([]);

  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [createdTripId, setCreatedTripId] = useState<number | null>(null);

  const [coHostModalVisible, setCoHostModalVisible] = useState(false);
  const [coHosts, setCoHosts] = useState<string[]>([]);

  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#DDE2E5' : '#fff';

  const initialValues: CreateTripFormValues = {
    tripName: '',
    budget: '',
    location: '',
    dates: '',
    image: null,
    currency: 'USD',
  };

  const queryClient = useQueryClient();

  // Query for fetching payment methods
  const { data: paymentMethodsData, isLoading } = useQuery({
    queryKey: ['paymentMethods', createdTripId],
    queryFn: () => api.trip.getPaymentMethods(createdTripId!),
    enabled: !!createdTripId, // Only run query when we have a tripId
  });

  // Mutation for adding payment methods
  const addPaymentMethodMutation = useMutation({
    mutationFn: async (method: PaymentMethod) => {
      return api.trip.addPaymentMethod(createdTripId!, {
        method_name: method.type,
        account_details: method.tag
      });
    },
    onSuccess: () => {
      // Invalidate and refetch payment methods
      queryClient.invalidateQueries({ queryKey: ['paymentMethods', createdTripId] });
    }
  });

  // Mutation for toggling payment method status
  const togglePaymentMethodMutation = useMutation({
    mutationFn: async ({ methodId, status }: { methodId: number; status: number }) => {
      return api.trip.togglePaymentMethod(createdTripId!, methodId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods', createdTripId] });
    }
  });

  // Mutation for requesting funds
  const requestFundMutation = useMutation({
    mutationFn: () => api.trip.requestTripFund(createdTripId!),
    onSuccess: (response) => {
      showSnackBar('Fund request sent successfully!', 'success');
      showLoading(() => {
        appNavigation.navigate(PAGES.home);
      });
    },
    onError: (error) => {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to request funds'
      });
    }
  });

  const handleInviteBuddies = (emails: string[]) => {
    if (createdTripId) {
      (async () => {
        try {
          for (const email of emails) {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('role', 'member');
            await api.trip.addParticipants(createdTripId, formData);
          }
          showSnackBar('Buddies invited successfully!', 'success');
        } catch (error) {
          handleApiError(error, showSnackBar, {
            defaultMessage: 'Failed to invite buddies'
          });
        } finally {
          setModalVisible(false);
        }
      })();
      return;
    }

    setInvitedBuddies(emails);
    setModalVisible(false);
  };

  const handleCoHosts = (emails: string[]) => {
    if (createdTripId) {
      (async () => {
        try {
          for (const email of emails) {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('role', 'co-host');
            await api.trip.addParticipants(createdTripId, formData);
          }
          showSnackBar('Co-hosts added successfully!', 'success');
        } catch (error) {
          handleApiError(error, showSnackBar, {
            defaultMessage: 'Failed to add co-hosts'
          });
        } finally {
          setCoHostModalVisible(false);
        }
      })();
      return;
    }

    setCoHosts(emails);
    setCoHostModalVisible(false);
  };

  const handleCreateTrip = async (values: CreateTripFormValues) => {
    try {
      const [startDate, endDate] = values.dates.split(' - ');

      const formData = new FormData();
      formData.append('name', values.tripName);
      formData.append('budget', values.budget);
      formData.append('location', values.location);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('currency', values.currency);

      invitedBuddies.forEach((email, index) => {
        formData.append(`buddies[${index}]`, email);
      });

      coHosts.forEach((email, index) => {
        formData.append(`coHosts[${index}]`, email);
      });

      if (values.image) {
        formData.append('tripImage', {
          uri: values.image.uri,
          type: values.image.type || 'image/jpeg',
          name: values.image.name || 'trip_image.jpg',
        });
      }

      console.log("FORM DATA: ", formData);
      const response = await api.trip.createTrip(formData) as TripResponse;
      console.log("RESPONSE: ", response);

      // Store the trip ID
      setCreatedTripId(response.data.id);
      
      showSnackBar('Trip created successfully!', 'success');
      setInvitedBuddies([]); 
      setShowPaymentMethods(true);

    } catch (error: any) {
      console.log("TRRIERROR: ", error);
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to create trip'
      });
    }
  };

  const handleSavePaymentMethods = async (methods: PaymentMethod[]) => {
    console.log("PAYMENT METHODS: ", methods);
    
    if (createdTripId) {
      try {
        // Loop through each payment method and send request
        for (const method of methods) {
          await addPaymentMethodMutation.mutateAsync(method);
        }

        showSnackBar('Payment methods added successfully!', 'success');

      } catch (error: any) {
        handleApiError(error, showSnackBar, {
          defaultMessage: 'Failed to add payment methods'
        });
      }
    }
  };

  const handleTogglePaymentMethod = async (methodId: number, currentStatus: number) => {
    try {
      await togglePaymentMethodMutation.mutateAsync({
        methodId,
        status: currentStatus === 1 ? 0 : 1
      });
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to update payment method'
      });
    }
  };

  const handleRequestFund = async () => {
    if (createdTripId) {
      await requestFundMutation.mutateAsync();
    }
  };

  // Show existing payment methods if any
  const renderExistingPaymentMethods = () => {
    if (isLoading) return <Text className="text-black dark:text-white">Loading payment methods...</Text>;

    if (paymentMethodsData?.data.length) {
      return (
        <View className="mb-4">
          <Text className="font-semibold mb-2 text-black dark:text-white">Current Payment Methods</Text>
          {paymentMethodsData.data.map((method) => (
            <View key={method.id} className="flex-row items-center  gap-x-4 p-3 rounded-lg mb-2">

              <Switch
                trackColor={{ false: '#767577', true: '#059669' }}
                thumbColor={method.status ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                // onValueChange={() => handleTogglePaymentMethod(method.id, method.status)}
                value={method.status}
              />
              <View>
                <Text className="font-medium text-base text-black dark:text-white">{method.method_name}</Text>
                <Text className="text-gray-600 dark:text-gray-400">{method.account_details}</Text>
              </View>

            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  // Reset function to clear all states
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.resetForm();
    }
    if (filePickerRef.current) {
      filePickerRef.current.reset();
    }
    setInvitedBuddies([]);
    setCoHosts([]);
    setShowPaymentMethods(false);
    setShowPaymentMethodModal(false);
    setPaymentMethods([]);
    setCreatedTripId(null);
    setModalVisible(false);
    setCoHostModalVisible(false);
  };

  // Reset when component mounts or unmounts
  useEffect(() => {
    resetForm();
    
    // Optional: Reset when component unmounts
    return () => {
      resetForm();
    };
  }, []);

  // usePageFocus(() => {
  //   resetForm();
  // });

  // Optional: Reset when navigation focus changes
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <GeneralLayout title="Create Trip">
      <View className="flex-1">
        <FormikForm
          initialValues={initialValues}
          validationSchema={CreateTripSchema}
          onSubmit={handleCreateTrip}>
          <FormikInput
            name="tripName"
            type="text"
            label="Trip Name"
            placeholder="Enter trip title"
            disabled={showPaymentMethods}
            required
          />

          <FormikInput
            name="budget"
            type="currency"
            label="Set Budget Per Participant"
            placeholder="Enter trip budget"
            disabled={showPaymentMethods}
            required
          />

          <FormikInput
            name="location"
            type="text"
            label="Trip Location"
            placeholder="Enter trip location"
            required
            disabled={showPaymentMethods}
          />

          <FormikInput
            name="dates"
            type="daterange"
            label="Start & End Date"
            placeholder="Select dates"
            required
            disabled={showPaymentMethods}
          />

          <FormikInput
            name="image"
            type="file"
            label="Upload Trip Image"
            required
            ref={filePickerRef}
            hide={showPaymentMethods}
            disabled={showPaymentMethods}
          />

          <View className={` ${showPaymentMethods ? 'hidden':'flex-row justify-center gap-x-8 mt-5'}`}>
            <TouchableOpacity
              testID="pre-create-invite-buddy-button"
              onPress={() => setModalVisible(true)}
              className="flex-col items-center gap-y-2"
            >
              <View className="bg-green-900 dark:bg-[#54585C] rounded-full w-12 h-12 justify-center items-center">
                <Profile2User size={24} className="text-white dark:text-[#292C33]" color={iconColor} variant="Bold" />
              </View>
              <Text className="text-black text-sm dark:text-white">Invite Buddy</Text>
            </TouchableOpacity>
           
            <TouchableOpacity 
              testID="pre-create-add-cohost-button"
              onPress={() => setCoHostModalVisible(true)} 
              className="flex-col items-center gap-y-2"
            >
              <View className="bg-green-900 dark:bg-[#54585C] rounded-full w-12 h-12 justify-center items-center">
                <Profile2User size={24} className="text-white dark:text-[#292C33]" color={iconColor} variant="Bold" />
              </View>
              <Text className="text-black text-sm dark:text-white">Add Co-host</Text>
            </TouchableOpacity>
          </View>

          <View className={` ${showPaymentMethods ? 'hidden':'block'} mt-7 space-y-3`}>
            
            <View className ="mb-4">
            <FormikSubmitButton
              testID="create-trip-button"
              title="Create Trip"
              valueType={{} as CreateTripFormValues}
              className="bg-green-700 rounded-2xl"
            />
              </View>

            <ButtonComponent
              title="Close"
              variant="text"
              onPress={() => navigation.goBack()}
            />
          </View>
        </FormikForm>

        <View className={` ${showPaymentMethods ? 'block':'hidden'} mt-7 space-y-3`}>
          <Text className="font-semibold text-md mb-6 text-black dark:text-white">Payment Methods</Text>

          {renderExistingPaymentMethods()}

          <View className="flex-row justify-center gap-x-8 mt-5 mb-8">
            <TouchableOpacity
              testID="post-create-invite-buddy-button"
              onPress={() => setModalVisible(true)}
              className="flex-col items-center gap-y-2"
            >
              <View className="bg-green-900 dark:bg-[#54585C] rounded-full w-12 h-12 justify-center items-center">
                <Profile2User size={24} className="text-white dark:text-[#292C33]" color={iconColor} variant="Bold" />
              </View>
              <Text className="text-black text-sm dark:text-white">Invite Buddy</Text>
            </TouchableOpacity>
           
            <TouchableOpacity
              testID="post-create-add-cohost-button"
              onPress={() => setCoHostModalVisible(true)}
              className="flex-col items-center gap-y-2"
            >
              <View className="bg-green-900 dark:bg-[#54585C] rounded-full w-12 h-12 justify-center items-center">
                <Profile2User size={24} className="text-white dark:text-[#292C33]" color={iconColor} variant="Bold" />
              </View>
              <Text className="text-black text-sm dark:text-white">Add Co-host</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-y-4">
            <ButtonComponent
              title="Request Trip Fund"
              variant="Primary"
              onPress={handleRequestFund}
              isLoading={requestFundMutation.isPending}
              testID="request-trip-fund-button"
            />
          <View className="mt-3">
            <ButtonComponent
              title="Add Payment Method"
              variant="text"
              onPress={() => setShowPaymentMethodModal(true)}
              testID="add-payment-method-button"
            />
            </View>
          </View>
        </View>

        <InviteBuddyModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onInvite={handleInviteBuddies}
        />

        <PaymentMethodModal
          visible={showPaymentMethodModal}
          onClose={() => setShowPaymentMethodModal(false)}
          onSave={handleSavePaymentMethods}
          existingMethods={paymentMethodsData?.data.map(method => ({
            method_name: method.method_name,
            account_details: method.account_details
          }))}
        />

        <CoHostModal
          visible={coHostModalVisible}
          onClose={() => setCoHostModalVisible(false)}
          onSave={handleCoHosts}
        />
      </View>
    </GeneralLayout>
  );
}
