import { Base } from './request.util';
import axios from 'axios';
import { setConfig } from './request.util';

interface DeviceRegistrationPayload {
  device_token: string;
  device_id: string;
  device_type: 'ios' | 'android';
  device_name: string;
}


export const registerDevice = async (payload: DeviceRegistrationPayload) => {
  const response = await axios.post(
    `${Base.apiUrl()}/devices/register`,
    payload,
    setConfig()
  );
  return response.data;
};


