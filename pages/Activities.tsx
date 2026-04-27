import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import GeneralLayout from '../layouts/GeneralLayout';
import useAppNavigation from '../hooks/useAppNavigation';
import { PAGES } from '../utils/pages';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useLoadingAnimation } from '../components/LoadingAnimation';
import ExportButtonComponent from '../components/ExportButtonComponent';
import ShareButtonComponent from '../components/ShareButtonComponent';
import SortByDropdown from '../components/SortByDropdown';

interface Participant {
  initial: string;
  color: string;
  name: string;
}

interface ActivityItemProps {
  id: number;
  title: string;
  participants: Participant[];
  amount: string;
  formattedAmount: string;
  date: string;
}

const ParticipantCircle: React.FC<Participant> = ({ initial, color }) => (
  <View
    className="w-6 h-6 rounded-full items-center justify-center -mr-2"
    style={{ backgroundColor: color }}
  >
    <Text className="text-xs text-white">{initial}</Text>
  </View>
);

const ActivityItem: React.FC<ActivityItemProps> = ({ id, title, participants, formattedAmount, date }) => {
  const displayParticipants = participants.slice(0, 1);
  const remainingCount = participants.length - 1;
  const othersText = remainingCount > 0 ? ` and ${remainingCount} others` : '';
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(PAGES.activity, { activity: id })}
      className="flex-row justify-between p-4 rounded-2xl bg-white dark:bg-transparent border border-[#DDE2E5] dark:border-[#878F96] mb-3"
    >
      <View className="flex-1">
        <Text className="text-base font-semibold mb-2 text-black dark:text-white">{title}</Text>
        <View className="flex-row">
          {participants.map((participant, index) => (
            <ParticipantCircle
              key={index}
              name={participant.name}
              initial={participant.initial}
              color={participant.color}
            />
          ))}
          <Text className="text-sm text-gray-600 dark:text-gray-400 ml-4">
            {displayParticipants.map(p => p.name.split(' ')[0]).join(', ')}
            {othersText}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-base font-semibold mb-2 text-black dark:text-white">{formattedAmount}</Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Activities() {
  const { showAnimation, hideAnimation } = useLoadingAnimation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => api.activity.getUserActivities(),
    onSettled: () => {
      hideAnimation();
    },
  });

  React.useEffect(() => {
    if (isLoading) {
      showAnimation();
    }
  }, [isLoading, showAnimation]);

  React.useEffect(() => {
    if (activities) {
      setFilteredActivities(activities);
    }
  }, [activities]);

  const handleCategorySelect = (category: string) => {
    if (category) {
      const sortedActivities = [...(activities || [])].sort((a, b) => {
        if (a.category === category && b.category !== category) return -1;
        if (a.category !== category && b.category === category) return 1;
        return 0;
      });
      
      setFilteredActivities(sortedActivities);
      setSelectedCategory(category);
    } else {
      setFilteredActivities(activities || []);
      setSelectedCategory('');
    }
  };

  return (
    <GeneralLayout title="Activities">
      <View className="flex-1">
        <View className="flex-row mb-6">
          <SortByDropdown
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <TouchableOpacity 
            className="bg-white dark:bg-transparent border border-[#DDE2E5] dark:border-gray-600 px-4 py-2 rounded-xl"
            onPress={() => handleCategorySelect('')}
          >
            <Text className="text-black dark:text-white">All</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mb-6 relative z-50">
          <Text className="text-xl font-semibold text-black dark:text-white">
            {filteredActivities?.length || 0} Activities
          </Text>
          <ExportButtonComponent
            exportAPI={api.user.exportActivities}
            disabled={filteredActivities?.length == 0}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className='mt-4'>
          {filteredActivities?.map((activity) => (
            <ActivityItem
              key={activity.id}
              id={activity.id}
              title={activity.name}
              participants={activity.participants.map(p => ({
                initial: p.initials,
                name: p.name,
                color: getRandomColor()
              }))}
              amount={activity.cost}
              formattedAmount={activity.formatted_cost}
              date={activity.date}
            />
          ))}
        </ScrollView>

        <View className="flex-row mt-4">
          <TouchableOpacity
            className="flex-1 py-4 mr-2"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-center text-[#00875A] font-semibold">Close</Text>
          </TouchableOpacity>
          <ShareButtonComponent
            variant="button"
            title="Share Activities"
            message="Check out these activities!"
            url="/activities"
            disabled={filteredActivities?.length == 0}
          />
        </View>
      </View>
    </GeneralLayout>
  );
} 
