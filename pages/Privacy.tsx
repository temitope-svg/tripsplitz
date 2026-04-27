import {View, Text} from 'react-native';
import React from 'react';
import GeneralLayout from '../layouts/GeneralLayout';

export default function Privacy() {
  return (
    <GeneralLayout title="Privacy Policy">
      <View>
        <Text className="font-semibold text-xl pt-5 text-black dark:text-white">Privacy Policy</Text>

        <Text className="pt-2 text-gray-600 dark:text-gray-400 leading-loose">
          At trivalo, accessible from trivalo.com, one of our main priorities is
          the privacy of our visitors. This Privacy Policy document contains
          types of information that is collected and recorded by trivalo and how
          we use it.
        </Text>
        <Text className="pt-3 text-gray-600 dark:text-gray-400">
          If you have additional questions or require more information about our
          Privacy Policy, do not hesitate to contact us.
        </Text>
        <Text className="pt-4 text-gray-600 dark:text-gray-400">
          This Privacy Policy applies only to our online activities and is valid
          for visitors to our website with regards to the information that they
          shared and/or collect in trivalo. This policy is not applicable to any
          information collected offline or via channels other than this website.
          Our Privacy Policy was created with the help of the Free Privacy
          Policy Generator.
        </Text>

        <Text className="font-semibold text-xl pt-5 text-black dark:text-white">
          Information We Collect
        </Text>

        <Text className="pt-4 text-gray-600 dark:text-gray-400">
          The personal information that you are asked to provide, and the
          reasons why you are asked to provide it, will be made clear to you at
          the point we ask you to provide your personal information..
        </Text>
      </View>
    </GeneralLayout>
  );
}
