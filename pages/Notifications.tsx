import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeneralLayout from '../layouts/GeneralLayout';
import ButtonComponent from '../components/ButtonComponent';
import { NotificationCard } from '../components/NotificationCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { PAGES } from '../utils/pages';
import useAppNavigation from '../hooks/useAppNavigation';
import useNotify from '../hooks/useNotify';

interface NotificationInitiator {
  name: string;
  initial?: string;
  avatar_color?: string;
  avatarColor?: string;
}

interface TripData {
  id: number;
  name: string;
  total_budget?: string | number;
  totalBudget?: string | number;
  budget?: string | number;
}

interface PaymentData {
  id?: number;
  amount?: string | number;
  fund_request_id?: number;
  fundRequestId?: number;
  created_at?: string;
  createdAt?: string;
}

interface AdditionalData {
  trip?: TripData;
  payment?: PaymentData;
  [key: string]: any;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  initiator: NotificationInitiator | null;
  read: boolean;
  createdAt?: string;
  created_at?: string;
  actionUrl?: string | null;
  action_url?: string | null;
  additionalData?: AdditionalData;
  additional_data?: AdditionalData;
}

interface NotificationResponse {
  data: Notification[];
  meta: {
    unreadCount?: number;
    unread_count?: number;
  };
}

interface TripLookupItem {
  id: number;
  name?: string;
  budget?: string | number;
  total_budget?: string | number;
  totalBudget?: string | number;
}

export default function Notifications() {
  const navigation = useAppNavigation();
  const rawNavigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { showSnackBar } = useNotify();

  const { data: notificationsData, isLoading, error, refetch, isRefetching } = useQuery<NotificationResponse>({
    queryKey: ['notifications'],
    queryFn: () => api.notifications.getNotifications()
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      api.notifications.markNotificationsAsRead([notificationId]),
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications =
        queryClient.getQueryData<NotificationResponse>(['notifications']);

      queryClient.setQueryData<NotificationResponse>(
        ['notifications'],
        currentNotifications => {
          if (!currentNotifications?.data) {
            return currentNotifications;
          }

          let notificationWasUnread = false;
          const updatedNotifications = currentNotifications.data.map(item => {
            if (item.id === notificationId && !item.read) {
              notificationWasUnread = true;
              return { ...item, read: true };
            }

            return item;
          });

          if (!notificationWasUnread) {
            return currentNotifications;
          }

          return {
            ...currentNotifications,
            data: updatedNotifications,
            meta: {
              ...currentNotifications.meta,
              unreadCount: Math.max(
                Number(
                  currentNotifications.meta?.unreadCount ??
                  currentNotifications.meta?.unread_count ??
                  0
                ) - 1,
                0
              ),
              unread_count: Math.max(
                Number(
                  currentNotifications.meta?.unread_count ??
                  currentNotifications.meta?.unreadCount ??
                  0
                ) - 1,
                0
              ),
            },
          };
        }
      );

      return { previousNotifications };
    },
    onError: (error, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications'],
          context.previousNotifications
        );
      }

      console.error('Failed to mark notification as read:', error);
    },
    onSuccess: response => {
      const unreadCount = Number(
        response?.meta?.unreadCount ?? response?.meta?.unread_count
      );

      if (!Number.isNaN(unreadCount)) {
        queryClient.setQueryData<NotificationResponse>(
          ['notifications'],
          currentNotifications => {
            if (!currentNotifications) {
              return currentNotifications;
            }

            return {
              ...currentNotifications,
              meta: {
                ...currentNotifications.meta,
                unreadCount,
                unread_count: unreadCount,
              },
            };
          }
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const normalizeType = (type: string) => type.trim().toLowerCase();

  const getAdditionalData = (notification: Notification): AdditionalData => {
    return notification.additionalData ?? notification.additional_data ?? {};
  };

  const getCreatedAt = (notification: Notification) => {
    return notification.createdAt ?? notification.created_at ?? '';
  };

  const getActionUrl = (notification: Notification) => {
    return notification.actionUrl ?? notification.action_url ?? null;
  };

  const getAmount = (value?: string | number | null) => {
    if (value === undefined || value === null || value === '') {
      return 0;
    }

    return value;
  };

  const getTripAmount = (trip?: Partial<TripData>) => {
    return getAmount(trip?.total_budget ?? trip?.totalBudget ?? trip?.budget);
  };

  const getTripIdFromUrl = (actionUrl?: string | null) => {
    if (!actionUrl) {
      return null;
    }

    const match = actionUrl.match(/\/trips\/(\d+)/i);
    return match ? Number(match[1]) : null;
  };

  const getQuotedTripName = (message: string) => {
    const match = message.match(/'([^']+)'/);
    return match?.[1]?.trim() || null;
  };

  const normalizeTripName = (name?: string | null) => {
    return name?.trim().replace(/\s+/g, ' ').toLowerCase() ?? '';
  };

  const getTripsFromResponse = (tripsResponse: any): TripLookupItem[] => {
    if (Array.isArray(tripsResponse?.data)) {
      return tripsResponse.data;
    }

    const data = tripsResponse?.data ?? {};
    const currentTrips = data.currentTrips ?? data.current_trips ?? [];
    const pastTrips = data.pastTrips ?? data.past_trips ?? [];

    return [...currentTrips, ...pastTrips];
  };

  const findTripByName = async (tripName: string | null) => {
    if (!tripName) {
      return null;
    }

    try {
      const tripResponses = await Promise.allSettled([
        queryClient.fetchQuery({
          queryKey: ['trips'],
          queryFn: () => api.trip.getAllTrips(),
        }),
        queryClient.fetchQuery({
          queryKey: ['upcomingTrips'],
          queryFn: () => api.trip.getUpcomingTrips(),
        }),
      ]);
      const normalizedName = normalizeTripName(tripName);
      const trips = tripResponses.flatMap(response =>
        response.status === 'fulfilled' ? getTripsFromResponse(response.value) : []
      );

      return trips.find(
        trip => normalizeTripName(trip.name) === normalizedName
      ) ?? null;
    } catch (error) {
      console.error('Failed to resolve notification trip:', error);
      return null;
    }
  };

  const resolveTripFromNotification = async (notification: Notification) => {
    const additionalData = getAdditionalData(notification);
    const directTrip = additionalData.trip;

    if (directTrip?.id) {
      return directTrip;
    }

    const tripIdFromUrl = getTripIdFromUrl(getActionUrl(notification));
    if (tripIdFromUrl) {
      return { id: tripIdFromUrl, name: getQuotedTripName(notification.message) ?? '' };
    }

    return findTripByName(getQuotedTripName(notification.message));
  };

  const showMissingDetailsMessage = () => {
    showSnackBar('Trip details are not available for this notification', 'error');
  };

  const navigateToAddTrip = () => {
    const currentRouteNames = rawNavigation.getState?.()?.routeNames ?? [];
    const parentNavigation = rawNavigation.getParent?.();
    const parentRouteNames = parentNavigation?.getState?.()?.routeNames ?? [];

    if (currentRouteNames.includes('addTrip')) {
      rawNavigation.navigate('addTrip');
      return;
    }

    if (parentRouteNames.includes('addTrip')) {
      parentNavigation.navigate('addTrip');
      return;
    }

    rawNavigation.navigate(PAGES.home.name, { screen: 'addTrip' });
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markAsReadMutation.mutateAsync(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    const type = normalizeType(notification.type);
    const additionalData = getAdditionalData(notification);
    const trip = await resolveTripFromNotification(notification);

    switch (type) {
      case 'tripupdate':
      case 'trip_update':
      case 'activity_member_added':
        if (trip?.id) {
          navigation.navigate(PAGES.tripDetails, { tripId: trip.id });
        } else {
          showMissingDetailsMessage();
        }
        break;

      case 'tripinvitation':
      case 'trip_invitation':
      case 'member_added':
        if (trip?.id) {
          navigation.navigate(PAGES.acceptRejectTrip, {
            tripId: trip.id,
            amount: getTripAmount(trip),
          });
        } else {
          showMissingDetailsMessage();
        }
        break;

      case 'paymentrequest':
      case 'payment_request':
      case 'fund_requested':
      case 'fund_payment':
        if (trip?.id) {
          const payment = additionalData.payment;
          navigation.navigate(PAGES.payTrip, {
            tripId: trip.id,
            amount: getAmount(payment?.amount ?? getTripAmount(trip)),
            fundRequestId: payment?.fundRequestId ?? payment?.fund_request_id ?? payment?.id,
          });
        } else {
          showMissingDetailsMessage();
        }
        break;

      case 'welcome':
        navigateToAddTrip();
        break;

      default:
        if (trip?.id) {
          navigation.navigate(PAGES.tripDetails, { tripId: trip.id });
        } else {
          showSnackBar('No action is available for this notification', 'error');
        }
    }
  };

  if (isLoading) {
    return (
      <GeneralLayout title="Notifications">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </GeneralLayout>
    );
  }

  if (error) {
    return (
      <GeneralLayout title="Notifications">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Failed to load notifications</Text>
          <ButtonComponent title="Retry" variant="text" onPress={() => { refetch(); }} />
        </View>
      </GeneralLayout>
    );
  }

  return (
    <GeneralLayout title="Notifications">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => { refetch(); }}
            colors={['#059669']} // Using the same green color as the ActivityIndicator
            tintColor="#059669"
          />
        }
      >
        {notificationsData?.data.length ? (
          notificationsData.data.map((notification) => (
            <NotificationCard
              key={notification.id}
              initial={notification.initiator?.initial || notification.title[0]}
              color={notification.initiator?.avatarColor ?? notification.initiator?.avatar_color ?? ''}
              date={getCreatedAt(notification)}
              isRead={notification.read}
              message={notification.message}
              onPress={() => handleNotificationPress(notification)}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center mt-32">
            <Text className="text-gray-500">No notifications yet</Text>
          </View>
        )}
      </ScrollView>

      <View className="mb-6">
        <ButtonComponent
          title="Refresh"
          variant="text"
          onPress={() => { refetch(); }}
        />
      </View>
    </GeneralLayout>
  );
}
