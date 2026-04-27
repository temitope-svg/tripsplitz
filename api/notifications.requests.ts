import axios from 'axios';
import { Base, requestWrapper, setConfig } from './request.util';

export const getNotifications = async () => {
  const config = setConfig();
  return requestWrapper(
    axios.get(`${Base.apiUrl()}/notifications`, config)
  );
};

export const markNotificationsAsRead = async (notificationIds: number[]) => {
  const config = setConfig();
  return requestWrapper(
    axios.post(
      `${Base.apiUrl()}/notifications/mark-as-read`,
      { notificationIds: notificationIds },
      config
    )
  );
}; 