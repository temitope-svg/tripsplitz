import axios from 'axios';
import { Base, requestWrapper, setConfig } from './request.util';

interface DashboardStats {
  upcomingTrips: number;
  totalTrips: number;
  totalActivities: number;
}

interface DashboardExpenses {
  yourExpense: number;
  budget: number;
  percentage: number;
}

interface DebtBreakdown {
  debts: number;
  fundRequests: any[];
}

interface DebtSummary {
  oweYou: number;
  youOwe: number;
  breakdown: {
    oweYou: DebtBreakdown;
    youOwe: DebtBreakdown;
  };
}

interface DashboardResponse {
  greeting: string;
  stats: DashboardStats;
  expenses: DashboardExpenses;
  debtSummary: DebtSummary;
  years: number[];
  selectedYear: number;
  totalStats: {
    totalTrips: number;
    totalActivities: number;
  };
}

export const getDashboardData = async (year: number): Promise<DashboardResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/dashboard?year=${year}`, setConfig())
  );
}; 