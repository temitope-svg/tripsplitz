import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavigationProps} from '../utils/types';
import ButtonComponent from '../components/ButtonComponent';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api';
import useNotify from '../hooks/useNotify';
import {handleApiError} from '../utils/error.util';
import { getRandomColor } from '../utils/color.util';
import GeneralLayout from '../layouts/GeneralLayout';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import * as Yup from 'yup';
import { useColorScheme } from 'nativewind';

const EditTripSchema = Yup.object().shape({
  tripName: Yup.string().required('Trip name is required'),
  budget: Yup.string().required('Budget is required'),
  location: Yup.string().required('Location is required'),
  dates: Yup.string().required('Date range is required'),
});

type ActivityBuddyProps = {
  id: number;
  name: string;
  initial: string;
  color: string;
  role: string;
};

export default function EditTrip() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const {tripId, tripData} = route.params;
  const {colorScheme} = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {showSnackBar} = useNotify();
  const queryClient = useQueryClient();

  const activityBuddies: ActivityBuddyProps[] = tripData.participants.map(p => ({
    id: p.id,
    name: p.name,
    initial: p.name[0],
    color: getRandomColor(),
    role: p.pivot.role
  }));

  const editTripMutation = useMutation({
    mutationFn: (data: any) => api.trip.updateTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['trip', tripId]);
      showSnackBar('Trip updated successfully');
      navigation.goBack();
    },
    onError: (error) => {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to update trip'
      });
    }
  });

  const initialValues = {
    tripName: tripData.name,
    budget: tripData.budget,
    location: tripData.location,
    dates: `${tripData.start_date}|${tripData.end_date}`
  };

  const handleEditTrip = (values: typeof initialValues) => {
    const [startDate, endDate] = values.dates.split('|');
    editTripMutation.mutate({
      name: values.tripName,
      budget: values.budget,
      location: values.location,
      start_date: startDate,
      end_date: endDate
    });
  };

  return (
    <GeneralLayout title="Edit Trip">
      <View className="flex-1">
        <FormikForm
          initialValues={initialValues}
          validationSchema={EditTripSchema}
          onSubmit={handleEditTrip}>
          <FormikInput
            name="tripName"
            type="text"
            label="Trip Name"
            placeholder="Enter trip title"
            required
          />

          <FormikInput
            name="budget"
            type="currency"
            label="Set Budget Per Participant"
            placeholder="Enter trip budget"
            required
          />

          <FormikInput
            name="location"
            type="text"
            label="Trip Location"
            placeholder="Enter location"
            required
          />

          <FormikInput
            name="dates"
            type="daterange"
            label="Start & End Date"
            placeholder="Select dates"
            required
          />

          <View>
            <Text className="text-base mt-6 font-semibold text-black dark:text-white">
              Trip Buddy
            </Text>
            <View className="flex-row flex-wrap w-[60%]">
              {activityBuddies.map(({name, initial, color, role}, index) => (
                <View key={index} className="mx-1 mt-2 mb-4 items-center">
                  <View
                    className="rounded-full w-10 h-10 justify-center items-center"
                    style={{backgroundColor: color}}>
                    <Text className="text-sm font-semibold text-white">
                      {initial}
                    </Text>
                  </View>
                  <Text className="text-center text-xs mt-1 text-gray-600 dark:text-gray-300">
                    {name}
                  </Text>
                  <Text className="text-center text-[10px] text-gray-500 dark:text-gray-400">
                    {role}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-5 mb-20">
            <ButtonComponent
              title="Save"
              variant="primary"
              type="submit"
              isLoading={editTripMutation.isPending}
              className="mb-3"
            />
            <ButtonComponent
              title="Close"
              variant="text"
              onPress={() => navigation.goBack()}
            />
          </View>
        </FormikForm>
      </View>
    </GeneralLayout>
  );
}
