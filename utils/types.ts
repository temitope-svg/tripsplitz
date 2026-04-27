import {NavigationProp} from '@react-navigation/native';
import {SvgProps} from 'react-native-svg';

export type RootStackParamsList = {
  onboarding: undefined;
  login: undefined;
  signup: undefined;
  otp: undefined;
  forgot: undefined;
  resetEmail: undefined;
  resetPassword: undefined;
  passwordSuccess: undefined;
  settings: undefined;
  language: undefined;
  createPasscode: undefined;
  changePasscode: undefined;
  changePassword: undefined;
  privacy: undefined;
  notifications: undefined;
  createTrip: undefined;
  fundTrip: undefined;
  paidTrip: undefined;
  inviteTrip: undefined;
  upcomingTrips: undefined;
  allExpense: undefined;
  totalExpense: {
    tripId: number;
  };
  allTrips: undefined;
  addActivity: undefined;
  expense: undefined;
  settlement: undefined;
  statement: undefined;
  trip: undefined;
  editTrip: {
    tripId: number;
    tripData: {
      name: string;
      location: string;
      budget: string;
      currency: string;
      start_date: string;
      end_date: string;
      trip_image: string;
      participants: Array<{
        id: number;
        name: string;
        pivot: {
          role: string;
        };
      }>;
    };
  };
  home: undefined;
  profile: undefined;
  profileDetails: undefined;
  editDisplayName: undefined;
  editProfile: undefined;
  'bottom tabs': undefined;
  tripDetails: { tripId: number };
  payActivity: {
    activityId: string;
    tripId: string;
  };
  expenseActivities: undefined;
  activity: {
    activity: ActivityDetails | number;  // Can be either activity object or activity ID
  };
  upcomingExpense: undefined;
  buddies: {
    tripId: number;
    location?: string;
  };
  summaryActivity: {
    activity: {
      id: string;
      name: string;
      cost: string;
      date: string;
      location?: string;
      participants: Array<{
        name: string;
        initials: string;
      }>;
      addedBy?: string;
    };
  };
  toReceive: {
    tripId?: number;
  };
  toPay: {
    tripId?: number;
  };
};

export type BottomTabParamList = {
  home: undefined;
  addTrip: undefined;
  activity: undefined;
  messages: undefined;
  profile: undefined;
};

export interface BottomTabProps extends SvgProps {
  focused?: boolean;
}
export type NavigationProps = NavigationProp<RootStackParamsList>;

export interface TripParticipant {
  id: number;
  name: string;
  display_name: string | null;
  email: string;
  profile_image: string | null;
  pivot: {
    trip_id: number;
    user_id: number;
    role: 'host' | 'co-host' | 'member';
    status: number;
    created_at: string;
    updated_at: string;
  };
}
