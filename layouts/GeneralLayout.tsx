import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

export default function GeneralLayout({ children, title, onBack }: { 
    children: React.ReactNode, 
    title: string, 
    onBack?: () => void 
}) {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();

    let onBackButton = onBack ? onBack : () => navigation.goBack();

    useEffect(() => {
        console.log("Color Scheme", colorScheme);
    }, [colorScheme]);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-[#292C33]"
        >
            <View className="bg-white dark:bg-[#292C33]">
                <View className="flex-row items-center p-6 mt-5">
                    <TouchableOpacity onPress={onBackButton}>
                        <ArrowLeft 
                            size={24} 
                            color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
                        />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold ml-4 text-black dark:text-white">
                        {title}
                    </Text>
                </View>
            </View>

            <ScrollView
                testID="general-scroll-view"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                className="px-6"
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}