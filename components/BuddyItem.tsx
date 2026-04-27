import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { getRandomColor } from "../utils/color.util";

export interface BuddyStats {
    name: string;
    profileImage: string | null;
    mutualTrips: number;
    mutualActivities: number;
    id: string;
}

interface BuddyItemProps extends BuddyStats {
    onPress?: () => void;
    isHostOrCoHost?: boolean;
}

export default function BuddyItem({
    name,
    profileImage,
    mutualTrips,
    mutualActivities,
    onPress,
    isHostOrCoHost
}: BuddyItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
        >
            <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    {profileImage ? (
                        <Image
                            source={{ uri: profileImage }}
                            className="w-full h-full"
                        />
                    ) : (
                        <View className="w-full h-full items-center justify-center" style={{ backgroundColor: getRandomColor() }}>
                            <Text className="text-lg text-white">{name[0]}</Text>
                        </View>
                    )}
                </View>
                <View className='flex-col justify-between'>
                    <Text className="text-sm text-black dark:text-white">{name}</Text>
                    {isHostOrCoHost && <View className='bg-[#A7F3D0] self-start p-1 rounded-lg' >
                        <Text className="text-gray-600 dark:text-gray-400 text-[8px]">View Stats</Text>
                    </View>}
                </View>

            </View>
            <View className="items-end">
                <Text className="text-gray-600 dark:text-gray-400 text-xs">{mutualTrips} Mutual Trips</Text>
                <Text className="text-gray-600 dark:text-gray-400 text-xs">{mutualActivities} Mutual Activities</Text>
            </View>
        </TouchableOpacity>
    );
}