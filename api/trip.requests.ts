import axios from 'axios';
import { Base, requestWrapper, setConfig } from './request.util';

interface CreateTripResponse {
  message: string;
  data: any;
  share_token: string;
}

interface AddPaymentMethodRequest {
  method_name: string;
  account_details: string;
}

interface AddPaymentMethodResponse {
  message: string;
  data: string;
}

interface PaymentMethod {
  id: number;
  trip_id: number;
  method_name: string;
  account_details: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface GetPaymentMethodsResponse {
  data: PaymentMethod[];
}

interface RequestFundResponse {
  message: string;
  data: {
    fund_requests: string[];
    individual_contribution: string;
  };
}

interface Trip {
  id: number;
  name: string;
  description: string | null;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  imageUrl: string | null;
  isActive: boolean;
  isPublic: boolean;
  shareToken: string | null;
  hostId: string;
  host: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    profileImageUrl: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  };
  participants: Array<{
    id: number;
    tripId: number;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      profileImageUrl: string | null;
      isVerified: boolean;
      isActive: boolean;
      createdAt: string;
    };
    status: number;
    isHost: boolean;
    isCoHost: boolean;
    joinedAt: string;
    invitedAt: string | null;
    invitationMessage: string | null;
  }>;
  activities: any[];
  createdAt: string;
  updatedAt: string;
  totalExpenses: number;
  participantCount: number;
}

interface TripsResponse {
  data: {
    currentTrips: Trip[];
    pastTrips: Trip[];
  };
}

interface TripDetails {
  id: number;
  name: string;
  description: string | null;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  imageUrl: string | null;
  isActive: boolean;
  isPublic: boolean;
  shareToken: string | null;
  hostId: string;
  host: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    profileImageUrl: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  };
  participants: Array<{
    id: number;
    tripId: number;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      profileImageUrl: string | null;
      isVerified: boolean;
      isActive: boolean;
      createdAt: string;
    };
    status: number;
    isHost: boolean;
    isCoHost: boolean;
    joinedAt: string;
    invitedAt: string | null;
    invitationMessage: string | null;
  }>;
  activities: any[];
  createdAt: string;
  updatedAt: string;
  totalExpenses: number;
  participantCount: number;
}

interface ExpensesSummary {
  totalTripExpenses: number;
  yourExpenses: number;
  owedToYou: number;
  youOwe: number;
}

interface GetTripDetailsResponse {
  data: {
    trip: TripDetails;  
    expensesSummary: ExpensesSummary;
    isPendingInvitation?: boolean;
  };
}

interface AddParticipantsResponse {
  message: string;
  data: any;
}

interface AddActivityRequest {
  tripId: number;
  formData: FormData;
}

interface AddActivityResponse {
  message: string;
  data: string;
}

// Add interface for category
interface ActivityCategory {
  id: number;
  name: string;
  description: string;
}

// Add the fetch categories function
export const getActivityCategories = async (): Promise<ActivityCategory[]> => {
  const config = setConfig();
  // requestWrapper extracts res.data, so if API returns array directly, we get the array
  const response = await requestWrapper(
    axios.get(`${Base.apiUrl()}/activities/categories`, config)
  );
  // API returns array directly, requestWrapper extracts it, so response is already the array
  return Array.isArray(response) ? response : [];
};

export const createTrip = async (formData: FormData): Promise<CreateTripResponse> => {
  const config = setConfig();
  // Modify headers for multipart/form-data while keeping auth
  config.headers['Content-Type'] = 'multipart/form-data';

  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips`, formData, config)
  );
};

export const addPaymentMethod = async (
  tripId: number,
  data: AddPaymentMethodRequest
): Promise<AddPaymentMethodResponse> => {
  const config = setConfig();
  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips/${tripId}/payment-method`, data, config)
  );
};

export const getPaymentMethods = async (tripId: number): Promise<GetPaymentMethodsResponse> => {
  const config = setConfig();
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/trips/${tripId}/payment-methods`, config)
  );
};

export const togglePaymentMethod = async (
  tripId: number,
  methodId: number,
  status: number
): Promise<any> => {
  const config = setConfig();
  return requestWrapper(
    axios.patch(`${Base.apiUrl()}/trips/${tripId}/payment-methods/${methodId}`, { status }, config)
  );
};

export const requestTripFund = async (tripId: number): Promise<RequestFundResponse> => {
  const config = setConfig();
  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips/${tripId}/request-fund`, {}, config)
  );
};

export const getUpcomingTrips = async (): Promise<any> => {
  const config = setConfig();
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/trips/upcoming`, config)
  );
};

export const getTripDetails = async (tripId: number): Promise<GetTripDetailsResponse> => {
  const config = setConfig();
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/trips/${tripId}`, config)
  );
};

export const addParticipants = async (
  tripId: number, 
  formData: FormData
): Promise<AddParticipantsResponse> => {
  const config = setConfig();
  config.headers['Content-Type'] = 'multipart/form-data';
  
  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips/${tripId}/members`, formData, config)
  );
};

export const addActivity = async ({
  tripId,
  formData
}: AddActivityRequest): Promise<AddActivityResponse> => {
  const config = setConfig();
  config.headers['Content-Type'] = 'multipart/form-data';
  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips/${tripId}/activities`, formData, config)
  );
};

export const getAllTrips = async (): Promise<TripsResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/trips`, setConfig())
  );
};

interface TripExpenseActivity {
  id: number;
  trip_id: number;
  activity_category_id: number;
  created_by: number;
  paid_by: number;
  name: string;
  cost: string;
  scheduled_at: string;
  location: string | null;
  receipt: string | null;
  category: {
    id: number;
    name: string;
    description: string;
  };
  payer: {
    id: number;
    name: string;
  };
  participants: {
    id: number;
    name: string;
    email: string;
    pivot: {
      contribution: string;
      status: number;
    };
  }[];
}

interface TripExpenseResponse {
  data: {
    trip: Trip;
    total_expenses: {
      activities: number;
      fund_requests: number;
      total: number;
    };
    activities: TripExpenseActivity[];
    fund_requests: Array<{
      id: number;
      amount: string;
      status: string;
      user: {
        id: number;
        name: string;
      };
    }>;
    participant_balances: Array<{
      user: {
        id: number;
        name: string;
      };
      paid: number;
      share: number;
      debts_owed: string | number;
      debts_owing: string | number;
      fund_requests: string;
      balance: number;
    }>;
  };
}

export const getTripExpenses = async (tripId: number): Promise<TripExpenseResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/trips/${tripId}/expenses`, setConfig())
  );
};

export const updateTrip = async (tripId: number, data: any): Promise<any> => {
  return requestWrapper(
    axios.put(`${Base.apiUrl()}/trips/${tripId}`, data, setConfig())
  );
}; 

export function payTrip(tripId: number, paymentProof?: any, notes?: string) {
  const config = setConfig();
  config.headers['Content-Type'] = 'multipart/form-data';
  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips/${tripId}/fund-payment`, { payment_proof: paymentProof, notes }, config)
  );
}

export function confirmPayment(tripId: number, fundRequestId: number) {
  const config = setConfig();
  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips/${tripId}/confirm-payment/${fundRequestId}`, {}, config)
  );
}

export function exportTripStatement(tripId: number, format: string) {
  const config = setConfig();
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/trips/${tripId}/statement?format=${format}`, config)
  );
}

export function respondToTripInvitation(tripId: number, data: { action: 'accept' | 'reject', rejection_reason?: string }) {
  const config = setConfig();
  return requestWrapper(
    axios.post(`${Base.apiUrl()}/trips/${tripId}/respond-invitation`, data, config)
  );
}
