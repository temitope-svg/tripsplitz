import { View } from 'react-native';
import React from 'react';
import GeneralLayout from '../layouts/GeneralLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import BuddyItem from '../components/BuddyItem';



export default function UserStatement() {

  const { data: pastTripBuddiesData } = useQuery({
    queryKey: ['pastTripBuddies'],
    queryFn: () => api.user.getPastTripBuddies(),
  });

  const onBuddyPress = () => {
    console.log("Pressed buddy")
  }


  return (
    <GeneralLayout title="Buddies">
      <View>
        {
          pastTripBuddiesData?.data.map((buddy: any) => (
            <BuddyItem
              key={buddy.id}
              onPress={() => onBuddyPress(buddy.id)}
              mutualActivities={buddy.total_activities}
              mutualTrips={buddy.total_trips}
              {...buddy} />
          ))
        }
      </View>

    </GeneralLayout>
  );
}
