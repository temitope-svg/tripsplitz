import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  Animated,
} from 'react-native';
import { NavigationProps } from '../utils/types';
import GeneralLayout from '../layouts/GeneralLayout';
import { Share } from 'iconsax-react-native';
import {useRoute} from '@react-navigation/native'
import useAppNavigation from '../hooks/useAppNavigation';
import { getRandomColor } from '../utils/color.util';
import { PAGES } from '../utils/pages';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ExportButtonComponent from '../components/ExportButtonComponent';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { formatDate } from '../utils/date.util';


interface Participant {
  initial: string;
  color: string;
  name: string;
}

interface ActivityItemProps {
  id: string;
  title: string;
  participants: Participant[];
  amount: string;
  date: string;
}

interface RouteParams {
  activityName: string;
  activities: Activity[];
}

const ParticipantCircle: React.FC<Participant> = ({ initial, color }) => (
  <View 
    className="w-6 h-6 rounded-full items-center justify-center -mr-2"
    style={{ backgroundColor: color }}
  >
    <Text className="text-xs text-white">{initial}</Text>
  </View>
);

const ActivityItem: React.FC<ActivityItemProps> = ({ id, title, participants, amount, date }) => {
  const displayParticipants = participants.slice(0, 1);
  const remainingCount = participants.length - 1;
  const othersText = remainingCount > 0 ? ` and ${remainingCount} others` : '';

  const navigation = useAppNavigation();


  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate(PAGES.summaryActivity, { 
        activity: {
          id,
          name: title,
          cost: amount,
          date,
          participants,
          // You might want to add location and addedBy from your data
        }
      })}
      className="flex-row justify-between p-4 rounded-2xl bg-white dark:bg-[#54585C] border border-[#DDE2E5] mb-3"
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
          <Text className="text-sm text-gray-600 ml-4 text-black dark:text-white">
            {displayParticipants.map(p => p.name.split(' ')[0]).join(', ')}
            {othersText}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-base font-semibold mb-2 text-black dark:text-white">${amount}</Text>
        <Text className="text-sm text-gray-600 text-black dark:text-white">{formatDate(date, 'MMM Do')}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface CategoryDropdownProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: number) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, onSelectCategory }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const { data: categories } = useQuery({
    queryKey: ['activity-categories'],
    queryFn: () => api.trip.getActivityCategories(),
  });

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    Animated.spring(animatedValue, {
      toValue: showDropdown ? 0 : 1,
      useNativeDriver: true,
      tension: 40,
      friction: 7
    }).start();
  };

  return (
    <View>
      <TouchableOpacity 
        className="bg-[#F8F9FA] dark:bg-[#54585C] px-4 py-2 rounded-xl mr-3"
        onPress={toggleDropdown}
      >
        <Text className="text-black dark:text-white">
          {selectedCategory || 'Sort by'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          className="flex-1"
          activeOpacity={1}
          onPress={() => {
            setShowDropdown(false);
            animatedValue.setValue(0);
          }}
        >
          <Animated.View 
            className="absolute left-6 top-32 bg-white dark:bg-[#54585C] rounded-xl shadow-lg p-2"
            style={{
              opacity: animatedValue,
              transform: [{
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0]
                })
              }]
            }}
          >
            {categories?.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="px-4 py-2"
                onPress={() => {
                  onSelectCategory(category.id);
                  setShowDropdown(false);
                  animatedValue.setValue(0);
                }}
              >
                <Text className="text-black dark:text-white">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function ExpenseActivities() {
  const navigation = useAppNavigation();
  const route = useRoute();
  const { activityName, activities, categoryId } = route.params as RouteParams;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredActivities, setFilteredActivities] = useState(activities);

  const handleCategorySelect = (categoryId: number) => {
    if (categoryId) {
      const filtered = activities.filter(activity => activity.category_id === categoryId);
      setFilteredActivities(filtered);
      // Get category name from categories data
      const categoryName = categories?.data.find(cat => cat.id === categoryId)?.name || '';
      setSelectedCategory(categoryName);
    } else {
      setFilteredActivities(activities);
      setSelectedCategory('');
    }
  };

  const { data: categories } = useQuery({
    queryKey: ['activity-categories'],
    queryFn: () => api.trip.getActivityCategories(),
  });

  console.log("FFFFDDD: ", filteredActivities);

  return (
    <GeneralLayout title="Activities">
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-base font-semibold text-black dark:text-white">
            {activityName} Activities
          </Text>
          <ExportButtonComponent
            exportAPI={(format: string) => api.activity.exportActivityByCategory(categoryId, format)}
          />
        </View>

        {/* <View className="flex-row mb-6">
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <TouchableOpacity 
            className="bg-white border border-[#DDE2E5] px-4 py-2 rounded-xl"
            onPress={() => handleCategorySelect(0)}
          >
            <Text className="text-black dark:text-white">All</Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView showsVerticalScrollIndicator={false} className='mt-10'>
          {filteredActivities.map((activity, index) => (
            <ActivityItem
              key={index}
              id={activity.id}
              title={activity.name}
              participants={activity.participants.map(p => ({
                initial: p.initials,
                name: p.name,
                color: getRandomColor()
              }))}
              amount={activity.cost}
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
          <TouchableOpacity className="flex-1 bg-[#00875A] py-4 rounded-xl ml-2">
            <Text className="text-center text-white font-semibold">Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GeneralLayout>
  );
}
