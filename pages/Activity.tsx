import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NavigationProps, RootStackParamsList} from '../utils/types';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import {useMutation, useQuery} from '@tanstack/react-query';
import api from '../api';
import useNotify from '../hooks/useNotify';
import {handleApiError} from '../utils/error.util';
import { Activity } from '../components/Activities';
import { PAGES } from '../utils/pages';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import { getRandomColor } from '../utils/color.util';
import { FormikHelpers } from 'formik';
import { getActivityReceiptUrl } from '../utils/image.util';
import { useColorScheme } from 'nativewind';
import { formatDate } from '../utils/date.util';

type ActivityScreenRouteProp = RouteProp<RootStackParamsList, 'activity'>;

const ActivitySchema = Yup.object().shape({
  name: Yup.string().required('Activity name is required'),
  category: Yup.string().required('Category is required'),
  budget: Yup.string()
    .required('Cost is required')
    .test('is-currency', 'Invalid amount', value => {
      if (!value) return false;
      return /^\d*\.?\d{0,2}$/.test(value);
    }),
  date: Yup.string().required('Date and time is required'),
});

interface ActivityFormValues {
  name: string;
  category: string;
  budget: string;
  date: string;
  receipt?: any;
}

export default function ActivityPage() {
  const navigation = useNavigation<NavigationProps>();
  const {colorScheme} = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const route = useRoute<ActivityScreenRouteProp>();
  const activityParam = route.params?.activity;

  console.log("activityParam: ", activityParam);

  console.log("activityParamType: ", typeof activityParam);
  
  // Fetch activity if ID is passed
  const { data: fetchedActivity } = useQuery({
    queryKey: ['activity', activityParam],
    queryFn: () => api.activity.getActivityById(activityParam.toString()),
    enabled: typeof activityParam === 'number'
  });

  // Use fetched activity if available, otherwise use passed activity object
  const activity = fetchedActivity || activityParam;

  const showSnackBar = useNotify();
  const [isEnabled, setIsEnabled] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  console.log("activity: ", activity);

  const initialValues: ActivityFormValues = {
    name: activity?.name || '',
    category: activity?.activity_category_id?.toString() || activity?.category?.id.toString() || '',
    budget: activity?.cost || '',
    date: activity?.scheduled_at?.full || formatDate(activity?.scheduled_at?.date, 'MMM D, YYYY h:mm a') || '',
    receipt: null,
  };

  // Get categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['activityCategories'],
    queryFn: () => api.trip.getActivityCategories(),
  });

  const categoryOptions = React.useMemo(() => 
    categoriesData?.map(category => ({
      label: category.name,
      value: category.id.toString()
    })) || [], 
    [categoriesData]
  );

  const updateActivityMutation = useMutation({
    mutationFn: api.trip.updateActivity
  });

  const handleSubmit = async (
    values: ActivityFormValues,
    { setSubmitting }: FormikHelpers<ActivityFormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('activity_category_id', values.category);
      formData.append('cost', values.budget);
      
      if (values.date) {
        formData.append('scheduled_at', values.date);
      }

      if (values.receipt) {
        formData.append('receipt', {
          uri: values.receipt.uri,
          type: values.receipt.type,
          name: values.receipt.fileName || 'receipt.jpg',
        });
      }

      await updateActivityMutation.mutateAsync({
        activityId: activity.id,
        formData
      });

      showSnackBar('Activity updated successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to update activity',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotifyPress = () => {
    navigation.navigate(PAGES.notifications);
  };

  useEffect(() => {
    console.log("categoryOptions: ", categoryOptions);
  },[categoryOptions])

  return (
    <GeneralLayout title="Activity Details">
      <ScrollView className="flex-1">
        <FormikForm
          initialValues={initialValues}
          validationSchema={ActivitySchema}
          onSubmit={handleSubmit}
        >
          <FormikInput
            name="name"
            label="Activity Name "
            placeholder="Enter activity name"
            disabled
          />

          <FormikInput
            name="category"
            label="Category"
            type="select"
            options={categoryOptions}
            disabled
            config={{
              selectType: 'pill-multiple'
            }}
          />

          <FormikInput
            name="budget"
            label="Cost"
            type="currency"
            disabled
          />

          <FormikInput
            name="date"
            label="Date and Time"
            type="text"
            disabled
          />

          <View className="my-3">
            <Text className="text-lg mb-2 font-medium text-black dark:text-white">Receipt</Text>
            <TouchableOpacity onPress={() => setShowReceiptModal(true)}>
              <Image source={{ uri: getActivityReceiptUrl(activity?.receipt) }} className="w-20 h-20 rounded-lg" />
            </TouchableOpacity>
          </View>

          <Modal
            visible={showReceiptModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowReceiptModal(false)}
          >
            <View className="flex-1 bg-black/80 justify-center items-center">
              <StatusBar backgroundColor="rgba(0,0,0,0.8)" />
              <TouchableOpacity 
                className="absolute top-10 right-5 z-10 p-2 bg-white/20 rounded-full"
                onPress={() => setShowReceiptModal(false)}
              >
                <Text className="text-white text-xl font-bold">✕</Text>
              </TouchableOpacity>
              <Image 
                source={{ uri: getActivityReceiptUrl(activity?.receipt) }} 
                style={{ width: screenWidth * 0.9, height: screenHeight * 0.7 }}
                resizeMode="contain"
                className="rounded-lg"
              />
            </View>
          </Modal>

          <View className="my-3">
            <Text className="text-lg font-semibold text-black dark:text-white">Activity Members</Text>

            <View className="flex-row flex-wrap gap-x-4 mt-3">
              {activity?.participants?.map((participant) => {
                // Handle single name case
                const firstName = participant.name.split(' ')[0] || participant.name;
                const initial = participant.name[0] || '?';

                return (
                  <View className="items-center" key={participant.id}>
                    <View 
                      className="rounded-full w-12 h-12 justify-center items-center mb-1"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      <Text className="text-black dark:text-white text-xl font-bold">
                        {initial}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm">
                      {firstName}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="mt-4">
            <View>
              <Text className="mb-2 text-gray-500">Notify Friends</Text>
              <Switch
                trackColor={{false: 'white', true: '#059669'}}
                thumbColor="white"
                onValueChange={setIsEnabled}
                value={isEnabled}
              />
            </View>

            <TouchableOpacity 
              onPress={handleNotifyPress}
              className="bg-green-700 py-3 px-6 rounded-xl mt-4"
            >
              <Text className="text-white text-center font-semibold">
                Notify Friends
              </Text>
            </TouchableOpacity>
          </View>
        </FormikForm>
      </ScrollView>

      <View className="px-4 mb-6">
        <ButtonComponent
          title="Close"
          variant="text"
          onPress={() => navigation.goBack()}
        />
      </View>
    </GeneralLayout>
  );
}
