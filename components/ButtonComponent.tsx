import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface ButtonProps {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'text';
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
    testID?: string;
}

export default function ButtonComponent({
    title,
    onPress,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    className = '',
    labelClassName = '',
    testID
}: ButtonProps) {

    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return `bg-green-700 ${disabled ? 'opacity-50 bg-gray-400 dark:bg-gray-600' : ''}`;
            case 'secondary':
                return `bg-white border border-gray-300 dark:border-gray-600 dark:bg-transparent ${
                    disabled ? 'opacity-50 border-gray-200 dark:border-gray-700' : ''
                }`;
            case 'text':
                return `bg-transparent ${disabled ? 'opacity-50' : ''}`;
            default:
                return `bg-green-700 ${disabled ? 'opacity-50 bg-gray-400 dark:bg-gray-600' : ''}`;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return `text-white text-base font-medium ${
                    disabled ? 'text-gray-300 dark:text-gray-400' : ''
                }`;
            case 'secondary':
                return `text-gray-700 text-base font-medium dark:text-white ${
                    disabled ? 'text-gray-400 dark:text-gray-500' : ''
                }`;
            case 'text':
                return `text-green-700 text-sm font-bold ${
                    disabled ? 'text-gray-400 dark:text-gray-500' : ''
                }`;
            default:
                return `text-white text-base font-medium ${
                    disabled ? 'text-gray-300 dark:text-gray-400' : ''
                }`;
        }
    };

    return (
        <TouchableOpacity
            testID={testID}
            onPress={onPress}
            disabled={disabled || isLoading}
            className={`
                ${variant !== 'text' ? 'py-3 rounded-lg' : 'py-2'} 
                ${getButtonStyle()} 
                ${className}
            `}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'secondary' ? '#059669' : '#FFFFFF'} />
            ) : (
                <Text className={`text-center ${getTextStyle()} ${labelClassName}`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
} 
