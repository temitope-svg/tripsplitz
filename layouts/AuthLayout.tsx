import React from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";

export default function AuthLayout({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-[#292C33]"
        >
            <ScrollView
                testID="auth-scroll-view"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                className="p-6"
            >
                <View className="items-center mt-10">
                    <Image 
                      source={require('../assets/Icon.png')} 
                      className="w-20 h-20 tint-black dark:tint-white" 
                    />
                    <Text className="text-2xl font-bold mt-4 text-black dark:text-white">
                        {title}
                    </Text>
                </View>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}