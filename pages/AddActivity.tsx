import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Modal,
} from 'react-native';
import { NavigationProps, RootStackParamsList } from '../utils/types';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useContext, useState, useRef } from 'react';
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../api';
import useNotify from '../hooks/useNotify';
import { handleApiError } from '../utils/error.util';
import { IInputOptions } from '../interfaces';
import { FormikHelpers } from 'formik';
import { useAppSelector } from '../store/hooks';
import { InviteBuddyModal } from '../components/Modals/InviteBuddyModal';
import GeneralLayout from '../layouts/GeneralLayout';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ButtonComponent from '../components/ButtonComponent';
import { WhoPaidModal } from '../components/Modals/WhoPaidModal';
import { getRandomColor } from '../utils/color.util';
import { useColorScheme } from 'nativewind';


type AddActivityScreenRouteProp = RouteProp<RootStackParamsList, 'addActivity'>;

const ActivitySchema = Yup.object().shape({
  name: Yup.string().required('Activity name is required'),
  category: Yup.string()
    .required('Category is required'),
  budget: Yup.string()
    .required('Cost is required')
    .test('is-currency', 'Invalid amount', value => {
      if (!value) return false;
      return /^\d*\.?\d{0,2}$/.test(value);
    }),
  date: Yup.string().required('Date and time is required'),
  receipt: Yup.object().required('Receipt is required'),
});

interface ActivityFormValues {
  name: string;
  category: string;
  budget: string;
  date: string;
  receipt?: any;
  currency: string;
}


export default function AddActivity() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<AddActivityScreenRouteProp>();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { showSnackBar } = useNotify();
  const queryClient = useQueryClient();
  const [isEnabled, setIsEnabled] = useState(false);
  const tripId = (route.params as any)?.tripId;
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // Changed to string[] for userIds
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitAmounts, setSplitAmounts] = useState<Record<string, string>>({}); // Changed to Record<string, string>
  const [searchText, setSearchText] = useState('');
  const formRef = useRef<any>(null);
  const [showWhoPaidModal, setShowWhoPaidModal] = useState(false);
  const [paidBy, setPaidBy] = useState<string | undefined>(undefined);

  // Get logged in user from Redux store
  const { loggedInUser } = useAppSelector(state => state.user);
  const loggedInUserId = loggedInUser?.user?.id;

  const addActivityMutation = useMutation({
    mutationFn: api.trip.addActivity
  });

  const { data: tripData } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => api.trip.getTripDetails(tripId),
  });

  // Set paidBy to logged in user when tripData loads
  React.useEffect(() => {
    if (loggedInUserId && !paidBy) {
      setPaidBy(loggedInUserId);
    }
  }, [loggedInUserId, tripData]);

  const initialValues: ActivityFormValues = {
    name: '',
    category: '',
    budget: '',
    date: '',
    receipt: null,
    currency: tripData?.data?.trip?.currency || 'USD'
  };

  const { data: categoriesData } = useQuery({
    queryKey: ['activityCategories'],
    queryFn: () => api.trip.getActivityCategories(),
  });

  const categoryOptions: IInputOptions[] = React.useMemo(() => {
    // categoriesData is already an array (requestWrapper extracts res.data)
    if (!categoriesData || !Array.isArray(categoriesData)) return [];
    return categoriesData.map((category: any) => ({
      label: category.name,
      value: category.id.toString()
    }));
  }, [categoriesData]);

  const handleMemberSelect = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedMembers(prev => [...prev, userId]);
    }
  };

  const calculateEqualSplit = (totalAmount: string, userIds: string[]) => {
    const amount = parseFloat(totalAmount) || 0;
    const splitAmount = (amount / userIds.length).toFixed(2);
    const newSplitAmounts: Record<string, string> = {};

    userIds.forEach(userId => {
      newSplitAmounts[userId] = splitAmount;
    });

    return newSplitAmounts;
  };

  const handleSplitExpense = () => {
    if (!formRef.current) return;

    const currentBudget = formRef.current.values?.budget || '0';

    if (selectedMembers.length === 0) {
      showSnackBar('Please select members first', 'error');
      return;
    }

    const initialSplit = calculateEqualSplit(currentBudget, selectedMembers);
    setSplitAmounts(initialSplit);
    setShowSplitModal(true);
  };

  const handlePaidBySelect = (userId: string | number) => {
    setPaidBy(userId.toString());
  };

  const MembersModal = React.useMemo(() => (
    <Modal
      visible={showMembersModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowMembersModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-[#292C33] rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold text-black dark:text-white">
              Buddies
            </Text>
            <TouchableOpacity onPress={() => setShowMembersModal(false)}>
              <Text className="text-green-700">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-4 mb-6">
            {tripData?.data?.trip?.participants?.map((participant) => {
              const userId = participant.userId || participant.user?.id;
              const userName = participant.user?.fullName || participant.user?.firstName || 'Unknown';
              if (!userId) return null;
              
              return (
                <TouchableOpacity
                  key={userId}
                  onPress={() => handleMemberSelect(userId)}
                  className="items-center"
                >
                  <View
                    className={`rounded-full w-14 h-14 justify-center items-center ${selectedMembers.includes(userId) ? 'border-2 border-green-700' : ''
                      }`}
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    <Text className="text-xl font-semibold text-white">
                      {userName[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <Text className="text-sm mt-1 text-black dark:text-white">
                    {userName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            className="bg-green-700 py-3 rounded-xl"
            onPress={() => {
              setShowMembersModal(false);
              const initialSplit = calculateEqualSplit(initialValues.budget, selectedMembers);
              setSplitAmounts(initialSplit);
              // setShowSplitModal(true);
            }}
          >
            <Text className="text-white text-center font-semibold">
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [showMembersModal, tripData, selectedMembers]);

  const SplitExpenseModal = React.useMemo(() => (
    <Modal
      visible={showSplitModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSplitModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-[#292C33] rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold text-black dark:text-white">
              Split expense
            </Text>
            <TouchableOpacity onPress={() => setShowSplitModal(false)}>
              <Text className="text-green-700">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-2"
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              className="bg-red-600 self-end px-4 py-2 rounded-lg"
              onPress={handleSplitExpense}
            >
              <Text className="text-white">Split Expense</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-96">
            {selectedMembers
              .filter(userId => {
                const participant = tripData?.data?.trip?.participants?.find(p => (p.userId || p.user?.id) === userId);
                const userName = participant?.user?.fullName || participant?.user?.firstName || '';
                return userName.toLowerCase().includes(searchText.toLowerCase());
              })
              .map(userId => {
                const participant = tripData?.data?.trip?.participants?.find(p => (p.userId || p.user?.id) === userId);
                if (!participant) return null;

                const userName = participant.user?.fullName || participant.user?.firstName || 'Unknown';

                return (
                  <View key={userId} className="flex-row items-center justify-between py-3 border-b border-gray-200">
                    <View className="flex-row items-center">
                      <View
                        className="rounded-full w-10 h-10 justify-center items-center mr-3"
                        style={{ backgroundColor: getRandomColor() }}
                      >
                        <Text className="text-lg font-semibold text-white">
                          {userName[0]?.toUpperCase() || '?'}
                        </Text>
                      </View>
                      <Text className="text-black dark:text-white text-lg">
                        {userName}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-lg mr-2">$</Text>
                      <TextInput
                        className="bg-gray-100 px-3 py-2 rounded-lg w-24"
                        value={splitAmounts[userId] || ''}
                        onChangeText={(text) => {
                          setSplitAmounts(prev => ({
                            ...prev,
                            [userId]: text
                          }));
                        }}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                );
              })}
          </ScrollView>

          <TouchableOpacity
            className="bg-green-700 py-3 rounded-xl mt-4"
            onPress={() => {
              setShowSplitModal(false);
              setShowWhoPaidModal(true)
            }}
          >
            <Text className="text-white text-center font-semibold">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [showSplitModal, tripData, selectedMembers, splitAmounts, searchText, handleSplitExpense]);

  const handleSubmit = async (
    values: ActivityFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<ActivityFormValues>
  ) => {
    try {
      const formData = new FormData();

      // Required fields from schema (using camelCase)
      formData.append('name', values.name);
      formData.append('categoryId', values.category);
      formData.append('cost', values.budget);
      formData.append('paidBy', paidBy || loggedInUserId || '');

      // Optional fields
      if (values.date) {
        formData.append('scheduledAt', values.date);
      }

      // Handle receipt if exists
      if (values.receipt) {
        formData.append('receipt', {
          uri: values.receipt.uri,
          type: values.receipt.type,
          name: values.receipt.fileName || 'receipt.jpg',
        } as any);
      }

      // Handle participants and their contributions
      // The API expects participants as a JSON string in formData
      if (selectedMembers.length > 0) {
        const participantsData = selectedMembers.map((userId) => ({
          userId: userId,
          amount: splitAmounts[userId] ? parseFloat(splitAmounts[userId]) : undefined,
          notes: null
        }));
        formData.append('participants', JSON.stringify(participantsData));
      }

      console.log('FORM DATA: ', formData);

      await addActivityMutation.mutateAsync({
        tripId,
        formData
      });

      showSnackBar('Activity added successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      handleApiError(error, showSnackBar, {
        defaultMessage: 'Failed to add activity',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GeneralLayout title="Add Activity">
      <ScrollView className="flex-1">
        <FormikForm
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ActivitySchema}
        >
          <FormikInput
            name="name"
            label="Activity Name"
            placeholder="Enter Activity Name"
          />

          <FormikInput
            name="category"
            label="Category"
            type="select"
            options={categoryOptions}
            config={{
              selectType: 'pill-multiple'
            }}
          />

          <FormikInput
            name="budget"
            label="Cost"
            placeholder="00"
            type="currency"
            keyboardType="decimal-pad"
            leftElement={
              <View className="rounded-xl border py-3 px-4 border-gray-300">
                <Text className="text-lg text-gray-400">$</Text>
              </View>
            }
            config={{
              disableCurrency: true,
              // defaultCurrency: 'USD'
            }}
          />

          <FormikInput
            name="date"
            type="datepicker"
            label="Date and Time"
            placeholder="Select date and time"
            rightElement={
              <Image source={require('../assets/arrow-white.png')} />
            }
          />

          <View className="pt-3">
            <FormikInput
              name="receipt"
              type="file"
              config={{
                allowMultiple: false,
                mediaType: 'photo',
              }}
              label="Upload Receipt"
              renderPreview={(uri) => (
                <Image
                  source={{ uri }}
                  className="w-20 h-20 rounded-lg"
                />
              )}
            >
              <View className="items-center">
                <Image
                  source={require('../assets/camera.png')}
                  className="ml-6 mb-1"
                />
                <Text className="text-gray-400">Snap Receipt</Text>
              </View>
            </FormikInput>
          </View>

          <View className="mt-4">
            <Text className="mb-2 text-gray-500">Notify Friends</Text>
            <Switch
              trackColor={{ false: 'white', true: 'gray' }}
              thumbColor="white"
              onValueChange={setIsEnabled}
              value={isEnabled}
            />
          </View>

          <View className="flex-row justify-center gap-x-5 mt-5">
            <TouchableOpacity
              onPress={() => setShowMembersModal(true)}
              className="items-center"
            >
              <View className="bg-green-700 rounded-full w-10 h-10 justify-center items-center">
                <FontAwesome5
                  name="user-friends"
                  size={14}
                  color="#FFFFFF"
                />
              </View>
              <Text>Add Trip Buddy</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="bg-green-700 rounded-full w-10 h-10 justify-center items-center">
                <FontAwesome5
                  name="user-plus"
                  size={14}
                  color="#FFFFFF"
                />
              </View>
              <Text>Add Buddy</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="bg-green-700 rounded-full w-10 h-10 justify-center items-center">
                <MaterialIcons
                  name="location-pin"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <Text>Add Location</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-12 space-y-3 mb-24">
            <View className="mb-6">
              <ButtonComponent
                variant="primary"
                title="Who Paid"
                className="bg-green-700"
                onPress={() => setShowWhoPaidModal(true)}
              />
            </View>

            {/* <FormikSubmitButton
              title="Add Activity"
              isLoading={addActivityMutation.isPending}
              className={isDarkMode ? 'bg-gray-700' : 'bg-white'}
              textClassName={isDarkMode ? 'text-green-400' : 'text-primary'}
            /> */}

            <ButtonComponent
              variant='text'
              title='Close'
              onPress={() => navigation.goBack()}
            />
          </View>
        </FormikForm>

        {MembersModal}
        {SplitExpenseModal}

        <WhoPaidModal
          visible={showWhoPaidModal}
          onClose={() => setShowWhoPaidModal(false)}
          onSelect={handlePaidBySelect}
          onSplitExpenseClick={() => {
            console.log('split expense clicked')
            setShowSplitModal(true)
            setShowWhoPaidModal(false)
          }}
          members={tripData?.data?.trip?.participants?.map(p => ({
            id: p.userId || p.user?.id || '',
            name: p.user?.fullName || p.user?.firstName || 'Unknown'
          })) || []}
          selectedMemberId={paidBy}
          onSubmit={() => formRef.current?.handleSubmit()}
          isSubmitLoading={addActivityMutation.isPending}
        />
      </ScrollView>
    </GeneralLayout>
  );
}
