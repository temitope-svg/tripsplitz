import React from "react";
import { TouchableOpacity, View, Text, useColorScheme, Share as RNShare } from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import useNotify from "../hooks/useNotify";
import { handleApiError } from "../utils/error.util";
import { API_CONFIG } from "../utils/api.util";

export default function ShareButtonComponent({ variant = "icon", title, message, url, disabled = false }: {
    variant?: "icon" | "button",
    title: string,
    message: string,
    url?: string,
    disabled?: boolean
}) {
    const colorScheme = useColorScheme();
    const { showSnackBar } = useNotify();


    const handleShare = async () => {
        try {
            const shareUrl = url ? `${API_CONFIG.SHARE_URL}${url}` : '';

            const result = await RNShare.share({
                message: message + ' ' + shareUrl,
                url: shareUrl,
                title: title
            });

            if (result.action === RNShare.sharedAction) {
                console.log('Trip shared successfully');
            }
        } catch (error) {
            handleApiError(error, showSnackBar, {
                defaultMessage: 'Failed to share trip'
            });
        }
    };
    return (
        <TouchableOpacity
            className={`items-center ${variant === "button" ? "flex-1" : ""}`}
            onPress={handleShare}
            disabled={disabled}
        >
            {variant === "icon" ? (
                <View className="rounded-full w-10 h-10 justify-center items-center bg-green-900 dark:bg-[#54585C]">
                    <Fontisto
                        name="share"
                        size={14}
                        color={colorScheme === 'dark' ? '#FFF' : '#FFF'}
                    />
                    {/* <Text className="text-xs text-center text-black dark:text-white">Share</Text> */}
                </View>
            ) : (
                <View className="flex-1 bg-[#00875A] py-4 rounded-xl w-full ">
                    <Text className="text-center text-white font-semibold">Share</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}