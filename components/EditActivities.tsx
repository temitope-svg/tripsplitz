import React from 'react';
import {View, Text} from 'react-native';
import {EditActivityCard} from './EditActivityCard';

const activities = [
  {
    title: 'Croissant and Pain au Chocolat',
    participants: ['S', 'P', 'T'],
    participantNames: 'Shade, Philip, Tayo and 5 others',
    amount: 2,
    date: 'Nov 25',
  },
  {
    title: 'Eiffel Tower Visit',
    participants: ['S', 'P', 'B'],
    participantNames: 'Shade, Philip, Ben and 3 others',
    amount: 45,
    date: 'Nov 26',
  },
  {
    title: 'Seine River Cruise',
    participants: ['T', 'P', 'S'],
    participantNames: 'Tayo, Philip, Shade and 4 others',
    amount: 30,
    date: 'Nov 26',
  },
  {
    title: 'Louvre Museum Tour',
    participants: ['B', 'S', 'T'],
    participantNames: 'Ben, Shade, Tayo and 2 others',
    amount: 25,
    date: 'Nov 27',
  },
  {
    title: 'Notre-Dame Cathedral',
    participants: ['P', 'T', 'B'],
    participantNames: 'Philip, Tayo, Ben and 3 others',
    amount: 15,
    date: 'Nov 27',
  },
  {
    title: 'Montmartre Walking Tour',
    participants: ['S', 'B', 'P'],
    participantNames: 'Shade, Ben, Philip and 4 others',
    amount: 20,
    date: 'Nov 28',
  },
  {
    title: 'Palace of Versailles',
    participants: ['T', 'S', 'P'],
    participantNames: 'Tayo, Shade, Philip and 6 others',
    amount: 40,
    date: 'Nov 28',
  },
  {
    title: 'Champs-Élysées Shopping',
    participants: ['B', 'P', 'T'],
    participantNames: 'Ben, Philip, Tayo and 3 others',
    amount: 150,
    date: 'Nov 29',
  },
  {
    title: 'Arc de Triomphe Visit',
    participants: ['S', 'T', 'B'],
    participantNames: 'Shade, Tayo, Ben and 2 others',
    amount: 12,
    date: 'Nov 29',
  },
  {
    title: 'French Wine Tasting',
    participants: ['P', 'S', 'T'],
    participantNames: 'Philip, Shade, Tayo and 4 others',
    amount: 35,
    date: 'Nov 29',
  },
  {
    title: 'Sacré-Cœur Basilica',
    participants: ['T', 'B', 'S'],
    participantNames: 'Tayo, Ben, Shade and 3 others',
    amount: 10,
    date: 'Nov 30',
  },
  {
    title: 'French Cooking Class',
    participants: ['B', 'P', 'S'],
    participantNames: 'Ben, Philip, Shade and 5 others',
    amount: 75,
    date: 'Nov 30',
  },
  {
    title: 'Farewell Dinner',
    participants: ['S', 'P', 'T', 'B'],
    participantNames: 'Shade, Philip, Tayo, Ben and 4 others',
    amount: 60,
    date: 'Nov 30',
  },
];

interface EditActivitiesSectionProps {
  onRemoveActivity: (index: number) => void;
}

export const EditActivitiesSection: React.FC<EditActivitiesSectionProps> = ({
  onRemoveActivity,
}) => {
  return (
    <View>
      <Text className="text-xl font-semibold pt-3 mb-4">Trip Activities</Text>
      {activities.map((activity, index) => (
        <EditActivityCard
          key={index}
          {...activity}
          onRemove={() => onRemoveActivity(index)}
        />
      ))}
    </View>
  );
};
