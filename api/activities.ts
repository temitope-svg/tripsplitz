export const handleActivityRequest = async (activityId: number, action: 'accept' | 'reject') => {
  const response = await request.post(`/activities/${activityId}/${action}`);
  return response.data;
}; 