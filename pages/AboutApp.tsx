import React from "react";
import { View, Text, ScrollView } from "react-native";
import GeneralLayout from "../layouts/GeneralLayout";

export default function AboutApp() {
    return (
        <GeneralLayout title="About">
            <ScrollView className="flex-1">
                {/* App Title and Description */}
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">TripSplitz</Text>
                    <Text className="text-base text-gray-600 dark:text-gray-300 leading-6">
                        TripSplitz is your ultimate travel companion for organizing group trips and managing shared expenses effortlessly.
                    </Text>
                </View>

                {/* Key Features */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Features</Text>

                    <View className="gap-y-4">
                        <View>
                            <Text className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1">Trip Planning</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">Create and manage trips with multiple participants, set budgets, and organize activities.</Text>
                        </View>

                        <View>
                            <Text className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1">Expense Sharing</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">Split trip costs fairly among participants with automated calculations and tracking.</Text>
                        </View>

                        <View>
                            <Text className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1">Trip Invitations</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">Invite friends to join your trips with easy-to-use invitation management system.</Text>
                        </View>

                        <View>
                            <Text className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1">Real-time Updates</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">Stay informed with instant notifications about trip updates, payments, and activity changes.</Text>
                        </View>
                    </View>
                </View>

                {/* How It Works */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">How It Works</Text>

                    <View className="space-y-3">
                        <Text className="text-sm text-gray-600 dark:text-gray-400">1. Create a trip and set your budget</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">2. Invite friends as trip buddies</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">3. Add activities and assign costs</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">4. Track expenses and manage payments</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">5. Enjoy your trip worry-free!</Text>
                    </View>
                </View>

                {/* Version Info */}
                <View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">Version 1.0.0</Text>
                    <Text className="text-sm text-gray-400 dark:text-gray-500 text-center mt-1">©{new Date().getFullYear()} TripSplitz. All rights reserved.</Text>
                </View>
            </ScrollView>
        </GeneralLayout>
    );
}