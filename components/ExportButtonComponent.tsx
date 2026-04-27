import React, { useState } from "react";
import { TouchableOpacity, useColorScheme, Text, View, Modal, KeyboardAvoidingView, Platform, Animated, ActivityIndicator } from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import ButtonComponent from "./ButtonComponent";
import { useMutation } from "@tanstack/react-query";
import { handleApiError } from "../utils/error.util";
import useNotify from "../hooks/useNotify";

export default function ExportButtonComponent({ variant = 'icon', exportAPI, disabled = false }: {
    variant?: "icon" | "button" | "text",
    exportAPI?: (format: string) => Promise<any>,
    disabled?: boolean
}) {
    const [showExportTypes, setShowExportTypes] = useState(false);
    const [exportingFormat, setExportingFormat] = useState<string | null>(null);
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const colorScheme = useColorScheme();
    const { showSnackBar } = useNotify();
    const exportMutation = useMutation({
        mutationFn: (format: string) => exportAPI!(format.toLowerCase()),
        onSuccess: () => {
            console.log("Export successful");
            setExportingFormat(null);
        },
        onError: () => {
            setExportingFormat(null);
        }
    });

    const exportTypes = [
        { name: "PDF" },
        { name: "Excel" },
        { name: "Jpeg" }
    ];

    const toggleDropdown = () => {
        setShowExportTypes(!showExportTypes);
        Animated.spring(animatedValue, {
            toValue: showExportTypes ? 0 : 1,
            useNativeDriver: true,
            tension: 40,
            friction: 7
        }).start();
    };

    const handleExport = async (type: string) => {
        try {
            console.log(`Exporting as ${type}`);
            setExportingFormat(type);
            await exportMutation.mutateAsync(type);
            showSnackBar("Export successful, Please check your email", "success");
            setShowExportTypes(false);
        } catch (error) {
            handleApiError(error, showSnackBar, {
                defaultMessage: "Failed to export activities"
            });
            setExportingFormat(null);
            setShowExportTypes(false);
        }
    };

    if (variant === "icon") {
        return (
            <View>
                <TouchableOpacity
                    className="flex-row gap-x-3 items-center justify-center"
                    onPress={toggleDropdown}
                    disabled={exportMutation.isPending || disabled}
                >
                    <Text className="text-black dark:text-white text-base font-semibold">Export</Text>
                    <View className="w-12 h-12 bg-[#047857] rounded-full items-center justify-center">
                        {exportMutation.isPending ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Fontisto
                                name="share"
                                size={14}
                                color={colorScheme === 'dark' ? '#FFF' : '#FFF'}
                            />
                        )}
                    </View>
                </TouchableOpacity>

                {showExportTypes && (
                    <Animated.View
                        className="flex-col items-end gap-y-2 justify-center absolute right-6 top-14 z-50"
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
                        {exportTypes.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row gap-x-3 items-center justify-center bg-[#047857] rounded-full px-4 py-2"
                                onPress={() => handleExport(type.name)}
                                disabled={exportMutation.isPending}
                            >
                                {exportingFormat === type.name ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text className="text-white font-semibold">{type.name}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                )}
            </View>
        );
    }

    if (variant === "text") {
        return (
            <TouchableOpacity
                className="flex-1"
                onPress={() => setShowExportTypes(true)}
                disabled={exportMutation.isPending || disabled}
            >
                <Text className="text-center text-gray-700 dark:text-gray-300 font-medium py-4">
                    {exportMutation.isPending ? "Exporting..." : "Export"}
                </Text>

                <Modal
                    visible={showExportTypes}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowExportTypes(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1"
                    >
                        <View className="flex-1 bg-black/50 justify-end">
                            <View className="bg-white dark:bg-[#292C33] rounded-t-3xl p-6">
                                <Text className="text-2xl font-semibold mb-8 text-black dark:text-white">
                                    Export
                                </Text>

                                <View className="flex-row justify-center gap-4 mb-8">
                                    {exportTypes.map((type, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className="bg-[#047857] rounded-2xl px-6 py-3"
                                            onPress={() => handleExport(type.name)}
                                            disabled={exportMutation.isPending}
                                        >
                                            {exportingFormat === type.name ? (
                                                <ActivityIndicator size="small" color="#FFFFFF" />
                                            ) : (
                                                <Text className="text-white font-semibold text-base">
                                                    {type.name}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <ButtonComponent
                                    title="Done"
                                    onPress={() => setShowExportTypes(false)}
                                    variant="primary"
                                    className=""
                                    disabled={exportMutation.isPending}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <TouchableOpacity
                className="flex-1 py-4 mr-2"
                onPress={() => setShowExportTypes(true)}
                disabled={exportMutation.isPending || disabled}
            >
                <Text className="text-center text-[#00875A] font-semibold">
                    {exportMutation.isPending ? "Exporting..." : "Export"}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={showExportTypes}
                transparent
                animationType="slide"
                onRequestClose={() => setShowExportTypes(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-white dark:bg-[#292C33] rounded-t-3xl p-6">
                            <Text className="text-2xl font-semibold mb-8 text-black dark:text-white">
                                Export
                            </Text>

                            <View className="flex-row justify-center gap-4 mb-8">
                                {exportTypes.map((type, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        className="bg-[#047857] rounded-2xl px-6 py-3"
                                        onPress={() => handleExport(type.name)}
                                        disabled={exportMutation.isPending}
                                    >
                                        {exportingFormat === type.name ? (
                                            <ActivityIndicator size="small" color="#FFFFFF" />
                                        ) : (
                                            <Text className="text-white font-semibold text-base">
                                                {type.name}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <ButtonComponent
                                title="Done"
                                onPress={() => setShowExportTypes(false)}
                                variant="primary"
                                className=""
                                disabled={exportMutation.isPending}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}       