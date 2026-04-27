import axios from 'axios';
import { Base, requestWrapper, setConfig } from './request.util';

interface ActivitySchedule {
  date: string;
  time: string;
  full: string;
  timestamp: string;
}

interface ActivityLocation {
  address: string;
  coordinates: {
    lat: string;
    lng: string;
  };
}

interface ActivityCategory {
  id: string;
  name: string;
}

interface ActivityParticipant {
  id: number;
  name: string;
  initials: string;
}

interface PaidBy {
  id: number;
  name: string;
}

interface ActivityDetails {
  id: string;
  name: string;
  category: ActivityCategory;
  cost: string;
  formatted_cost: string;
  scheduled_at: ActivitySchedule;
  location: ActivityLocation;
  receipt_url: string | null;
  participants: string;
  paid_by: PaidBy | null;
  notify_participants: string;
  trip: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
  }
}

interface ActivityResponse {
  id: number;
  name: string;
  cost: string;
  formatted_cost: string;
  date: string;
  category: string;
  category_id?: number;
  participants: ActivityParticipant[];
  paid_by: PaidBy;
}

interface ActivityParticipant {
  id: number;
  name: string;
  email: string;
  pivot: {
    activity_id: number;
    user_id: number;
    contribution: string;
    status: number;
    created_at: string;
    updated_at: string;
  };
}

interface ActivityCategoryDetail {
  id: number;
  name: string;
  description: string;
  status?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

interface User {
  id: number;
  name: string;
  display_name: string | null;
  email: string;
  phone: string;
  profile_image: string | null;
  // ... other user fields
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
  category: ActivityCategoryDetail;
  host: User;
  payer: User;
  participants: ActivityParticipant[];
}

interface TripActivitiesResponse {
  data: TripActivity[];
}

// New interface for the category activities response
interface CategoryActivitiesResponse {
  search_term: string;
  categories: ActivityCategoryDetail[];
  activities: ActivityResponse[];
  total_categories: number;
  total_activities: number;
  total_cost: number;
  formatted_total_cost: string;
}

// Add this type for the response status
type ActivityResponseStatus = 'accepted' | 'rejected';

// Add this function to handle activity responses
export const respondToActivity = async (activityId: string, status: ActivityResponseStatus) => {
  return requestWrapper(
    axios.post(
      `${Base.apiUrl()}/activities/${activityId}/respond`,
      { status },
      setConfig()
    )
  );
};

export const getActivityById = async (activityId: string): Promise<ActivityDetails> => {
  return requestWrapper(
    axios.get(
      `${Base.apiUrl()}/activities/${activityId}`,
      setConfig()
    )
  );
};

export const getActivitiesByCategory = async (categoryName: string): Promise<CategoryActivitiesResponse> => {
  return requestWrapper(
    axios.get(
      `${Base.apiUrl()}/activities/category-name?name=${categoryName}`,
      setConfig()
    )
  );
};

export const getUserActivities = async (): Promise<ActivityResponse[]> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/activities`, setConfig())
  );
};

export const getActivitiesByTripId = async (tripId: number): Promise<TripActivitiesResponse> => {
  return requestWrapper(
    axios.get(
      `${Base.apiUrl()}/trips/${tripId}/activities`,
      setConfig()
    )
  );
}; 

export const getActivitiesByCategoryId = async (categoryId: number): Promise<CategoryActivitiesResponse> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/activities/category/${categoryId}`, setConfig())
  );
};

export const exportActivityByCategory = async (categoryId: number, format: string): Promise<void> => {
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/activities/category/${categoryId}/export?format=${format}`, setConfig())
  );
};

export interface CreateActivityParticipantPayload {
  userId: string;
  amount: number;
  isPayer: boolean;
  notes: string;
}

export interface CreateActivityPayload {
  cost: number;
  name: string;
  participants: CreateActivityParticipantPayload[];
  tripId: number;
  trip_id?: number;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  scheduledDate?: string;
  receiptImageUrl?: string;
  categoryId: number;
}

export const createActivity = async (
  activity: CreateActivityPayload
): Promise<ActivityDetails> => {
  const parsedTripId = Number(activity.tripId);
  const normalizedPayload: CreateActivityPayload = {
    ...activity,
    tripId: parsedTripId,
    trip_id: parsedTripId,
  };

  return requestWrapper(
    axios.post(`${Base.apiUrl()}/activities`, normalizedPayload, setConfig())
  );
};



