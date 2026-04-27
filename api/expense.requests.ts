import axios from 'axios';
import { Base, requestWrapper, setConfig } from './request.util';

interface ExpenseCategory {
  name: string;
  total: string;
  count: number;
  formatted_count: string;
}

interface AllExpensesResponse {
  total_expense: string;
  formatted_total: string;
  categories: ExpenseCategory[];
}

interface Participant {
  id: number;
  name: string;
  initials: string;
}

interface Activity {
  id: number;
  name: string;
  cost: string;
  formatted_cost: string;
  date: string;
  participants: Participant[];
}

interface TotalExpensesResponse {
  total_expense: number;
  formatted_total: string;
  activities: Activity[];
}

interface UpcomingExpenseActivity {
  id: number;
  name: string;
  cost: string;
  formatted_cost: string;
  date: string;
  category: string;
  participants: {
    id: number;
    name: string;
    initials: string;
  }[];
}

interface UpcomingExpensesResponse {
  total_expense: number;
  formatted_total: string;
  activities: UpcomingExpenseActivity[];
}

interface TripParticipant {
  id: number;
  name: string;
  display_name: string | null;
  email: string;
  phone: string;
  profile_image: string | null;
  pivot: {
    trip_id: number;
    user_id: number;
    role: string;
    status: number;
    created_at: string;
    updated_at: string;
  };
}

interface TripActivity {
  id: number;
  trip_id: number;
  activity_category_id: number;
  created_by: number;
  paid_by: number;
  name: string;
  cost: string;
  scheduled_at: string;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  receipt: string | null;
  notify_participants: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    description: string;
    status: number;
  };
  payer: TripParticipant;
  participants: Array<TripParticipant & {
    pivot: {
      activity_id: number;
      user_id: number;
      contribution: string;
      status: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

interface FundRequest {
  id: number;
  trip_id: number;
  user_id: number;
  amount: string;
  message: string;
  status: string;
  payment_proof: string | null;
  payment_notes: string | null;
  rejection_reason: string | null;
  payment_submitted_at: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  user: TripParticipant;
}

interface ParticipantBalance {
  user: TripParticipant;
  paid: number;
  share: number;
  debts_owed: string | number;
  debts_owing: string | number;
  fund_requests: string;
  balance: number;
}

interface TripExpensesResponse {
  data: {
    trip: {
      id: number;
      trip_host_id: number;
      name: string;
      location: string;
      start_date: string;
      end_date: string;
      budget: string;
      currency: string;
      trip_image: string;
      status: boolean;
      share_token: string;
      created_at: string;
      updated_at: string;
      participants: TripParticipant[];
    };
    total_expenses: {
      activities: number;
      fund_requests: number;
      total: number;
    };
    activities: TripActivity[];
    fund_requests: FundRequest[];
    participant_balances: ParticipantBalance[];
    date_generated: string;
  };
}

interface PayableActivity {
  id: number;
  name: string;
  cost: string;
  category: {
    name: string;
    icon: string | null;
  };
  participant_count: number;
  scheduled_at: string;
}

export interface Payable {
  type: 'debt' | 'fund_request';
  id: number;
  amount: number;
  formatted_amount: string;
  paid_to: {
    id: number;
    name: string;
  };
  trip_id: number;
  trip_name: string;
  activity?: PayableActivity;
  created_at?: string;
}

interface PayablesResponse {
  total: number;
  formatted_total: string;
  payables: Payable[];
  has_payables: boolean;
  trip_id?: string;
}

interface ReceivableDebtor {
  id: number;
  name: string;
  amount: number;
  formatted_amount: string;
  tripId: number;
  tripName: string;
}

interface FundRequest {
  createdAt: string;
}

interface Receivable {
  type: 'debt' | 'fund_request';
  debtors: ReceivableDebtor[];
  activity?: PayableActivity;
  fundRequest?: FundRequest;
}

interface ReceivablesResponse {
  total: number;
  formatted_total: string;
  receivables: Receivable[];
  tripId?: number | null;
}

interface SettleDebtResponse {
  message: string;
  data: any;
}

interface ActivityDebtParty {
  id: number;
  name: string;
}

interface ActivityDebt {
  id: number;
  amount: number;
  formatted_amount: string;
  status: 'unsettled' | 'settled';
  is_payable: boolean;
  is_receivable: boolean;
  other_party: ActivityDebtParty;
}

interface ActivityDebtsResponse {
  debts: ActivityDebt[];
  total_payable: number;
  total_receivable: number;
  total_owing: number;
  total_paid: number;
}

export const getAllExpenses = async (): Promise<AllExpensesResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/expenses/all`, setConfig())
  );
};

export const getTotalExpenses = async (): Promise<TotalExpensesResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/expenses/total`, setConfig())
  );
};

export const getUpcomingExpenses = async (): Promise<UpcomingExpensesResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/expenses/upcoming`, setConfig())
  );
};

export const getTripExpenses = async (tripId: number): Promise<TripExpensesResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/trips/${tripId}/expenses`, setConfig())
  );
};

export const getPayables = async (tripId?: number): Promise<PayablesResponse> => {
  const url = tripId 
    ? `${Base.apiUrl()}/expenses/payables?tripId=${tripId}`
    : `${Base.apiUrl()}/expenses/payables`;

  console.log("URL: ", url);

  return requestWrapper(axios.get(url, setConfig()));
}; 

export const getReceivables = async (tripId?: number): Promise<ReceivablesResponse> => {
  const url = tripId 
    ? `${Base.apiUrl()}/expenses/receivables?tripId=${tripId}`
    : `${Base.apiUrl()}/expenses/receivables`;

  return requestWrapper(axios.get(url, setConfig()));
};

export const settleDebt = async (debtId: number, paymentProof?: File): Promise<SettleDebtResponse> => {
  const formData = new FormData();
  formData.append('user_debt_id', debtId.toString());
  
  if (paymentProof) {
    formData.append('payment_proof', paymentProof);
  }

  const config = setConfig();
  config.headers['Content-Type'] = 'multipart/form-data';

  return requestWrapper(
    axios.post(`${Base.apiUrl()}/expenses/settle-debt`, formData, config)
  );
};

export const getActivityDebts = async (activityId: number): Promise<ActivityDebtsResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/expenses/activity/${activityId}/debts`, setConfig())
  );
};

export const exportExpenses = async (format: string): Promise<ExportExpensesResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/expenses/export?format=${format}`, setConfig())
  );
};


export const exportOwingReport = async (format: string): Promise<any> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/expenses/owing/export?format=${format}`, setConfig())
  );
};

export const exportOwedReport = async (format: string): Promise<any> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/expenses/owed/export?format=${format}`, setConfig())
  );
};

