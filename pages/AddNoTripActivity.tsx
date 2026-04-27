import {View, Text, Image, ScrollView, Switch} from 'react-native';
import React, {useRef, useState} from 'react';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import {useMutation} from '@tanstack/react-query';
import {FormikHelpers} from 'formik';
import api from '../api';
import useNotify from '../hooks/useNotify';
import {handleApiError} from '../utils/error.util';
import GeneralLayout from '../layouts/GeneralLayout';
import {useColorScheme} from 'nativewind';

const TripSchema = Yup.object().shape({
  name: Yup.string().required('Trip name is required'),
  budget: Yup.string()
    .required('Budget is required')
    .test('is-currency', 'Invalid amount', value => {
      if (!value) return false;
      return /^\d*\.?\d{0,2}$/.test(value);
    }),
  currency: Yup.string().required('Currency is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
  description: Yup.string().required('Description is required'),
  location: Yup.string().required('Location is required'),
  buddies: Yup.string(),
  coHosts: Yup.string(),
  tripImage: Yup.mixed().nullable(),
});

interface TripFormValues {
  name: string;
  budget: string;
  currency: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  buddies: string;
  coHosts: string;
  tripImage?: any;
}

const normalizeDateInput = (value: string) => {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? value : parsedDate.toISOString();
};

const toEmailArray = (value: string) => {
  const normalized = value
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(normalized));
};

export default function AddNoTripActivity() {
  const {colorScheme} = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {showSnackBar} = useNotify();
  const formRef = useRef<any>(null);
  const [isPublic, setIsPublic] = useState(true);

  const initialValues: TripFormValues = {
    name: '',
    budget: '',
    currency: 'usd',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    buddies: '',
    coHosts: '',
    tripImage: null,
  };

  const createTripMutation = useMutation({
    mutationFn: (formData: FormData) => api.trip.createTrip(formData),
  });

  const handleSubmit = async (
    values: TripFormValues,
    {setSubmitting, resetForm}: FormikHelpers<TripFormValues>,
  ) => {
    try {
      const parsedBudget = Number(values.budget);
      if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
        showSnackBar('Please enter a valid budget', 'error');
        return;
      }

      const formData = new FormData();
      const normalizedStartDate = normalizeDateInput(values.startDate).split('T')[0];
      const normalizedEndDate = normalizeDateInput(values.endDate).split('T')[0];

      formData.append('name', values.name.trim());
      formData.append('budget', String(parsedBudget));
      formData.append('currency', values.currency.trim().toLowerCase());
      formData.append('startDate', normalizedStartDate);
      formData.append('endDate', normalizedEndDate);
      formData.append('description', values.description.trim());
      formData.append('location', values.location.trim());
      formData.append('isPublic', String(isPublic));

      toEmailArray(values.buddies).forEach((email, index) => {
        formData.append(`buddies[${index}]`, email);
      });

      toEmailArray(values.coHosts).forEach((email, index) => {
        formData.append(`coHosts[${index}]`, email);
      });

      if (values.tripImage?.uri) {
        formData.append('tripImage', {
          uri: values.tripImage.uri,
          type: values.tripImage.type || 'image/jpeg',
          name: values.tripImage.fileName || 'trip_image.jpg',
        } as any);
      }

      await createTripMutation.mutateAsync(formData);
      showSnackBar('Trip created successfully!', 'success');
      resetForm();
      setIsPublic(true);
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to create trip',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GeneralLayout title="Create Trip">
      <ScrollView className="flex-1">
        <FormikForm
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={TripSchema}>
          <FormikInput
            name="name"
            label="Name"
            placeholder="Birthday Party"
          />

          <FormikInput
            name="budget"
            label="Budget"
            placeholder="50"
            type="currency"
            keyboardType="decimal-pad"
            leftElement={
              <View className="rounded-xl border py-3 px-4 border-gray-300">
                <Text className="text-lg text-gray-400">$</Text>
              </View>
            }
          />

          <FormikInput
            name="currency"
            label="Currency"
            placeholder="usd"
          />

          <FormikInput
            name="startDate"
            type="datepicker"
            label="Start Date"
            placeholder="Select start date"
            rightElement={<Image source={require('../assets/arrow-white.png')} />}
          />

          <FormikInput
            name="endDate"
            type="datepicker"
            label="End Date"
            placeholder="Select end date"
            rightElement={<Image source={require('../assets/arrow-white.png')} />}
          />

          <FormikInput
            name="description"
            label="Description"
            placeholder="Just for fun"
          />

          <FormikInput
            name="location"
            label="Location"
            placeholder="Ibadan"
          />

          <View className="mt-4">
            <Text className="mb-2 text-gray-500">Public Trip</Text>
            <Switch
              trackColor={{false: 'white', true: 'gray'}}
              thumbColor="white"
              onValueChange={setIsPublic}
              value={isPublic}
            />
          </View>

          <View className="pt-3">
            <FormikInput
              name="tripImage"
              type="file"
              config={{
                allowMultiple: false,
                mediaType: 'photo',
              }}
              label="Trip Image"
              renderPreview={uri => (
                <Image source={{uri}} className="w-20 h-20 rounded-lg" />
              )}>
              <View className="items-center">
                <Image
                  source={require('../assets/camera.png')}
                  className="ml-6 mb-1"
                />
                <Text className="text-gray-400">Upload Image</Text>
              </View>
            </FormikInput>
          </View>

          <FormikInput
            name="buddies"
            label="Buddies"
            placeholder="buddy1@email.com,buddy2@email.com"
          />

          <FormikInput
            name="coHosts"
            label="Co-Hosts"
            placeholder="cohost1@email.com,cohost2@email.com"
          />

          <Text className="text-xs text-gray-500 mt-2">
            Use comma-separated emails for buddies and co-hosts.
          </Text>

          <View className="mt-10 mb-24">
            <FormikSubmitButton
              title="Create Trip"
              valueType={{} as TripFormValues}
              className={isDarkMode ? 'bg-gray-700' : 'bg-white'}
            />
          </View>
        </FormikForm>
      </ScrollView>
    </GeneralLayout>
  );
}
