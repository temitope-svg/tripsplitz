import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//Screens
import TripIcon from '../assets/icons/TripIcon';
import ActivityIcon from '../assets/icons/ActivityIcon';
import MessagesIcon from '../assets/icons/MessagesIcon';
import Home from '../pages/Home';
import Messages from '../pages/Messages';
import Profile from '../pages/Profile';
import ProfileIcon from '../assets/icons/ProfileIcon';
import {BottomTabParamList} from '../utils/types';
import HomeIcon from '../assets/icons/HomeIcon';
import {useColorScheme} from 'nativewind';
import AddNoTripActivity from '../pages/AddNoTripActivity';
import CreateTrip from '../pages/CreateTrip';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
  const {Navigator, Screen} = Tab;
  const {colorScheme} = useColorScheme();
  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: '#059669',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#292C33' : '#FFFFFF',
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 20,
        },
      }}>
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => <HomeIcon focused={focused} />,
        }}
      />
      <Screen
        name="addTrip"
        component={CreateTrip}
        options={{
          tabBarLabel: 'Add Trip',
          tabBarIcon: ({focused}) => <TripIcon focused={focused} />,
        }}
      />
      <Screen
        name="activity"
        component={AddNoTripActivity}
        options={{
          tabBarLabel: 'Add Activity',
          tabBarIcon: ({focused}) => <ActivityIcon focused={focused} />,
        }}
      />
      <Screen
        name="messages"
        component={Messages}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({focused}) => <MessagesIcon focused={focused} />,
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => <ProfileIcon focused={focused} />,
        }}
      />
    </Navigator>
  );
};

export default TabNavigator;
