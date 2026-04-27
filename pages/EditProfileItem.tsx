import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamsList } from "../utils/types";
import FormikForm from '../containers/forms/formik/formik-form';
import FormikInput from '../containers/forms/formik/formik-input';
import FormikSubmitButton from '../containers/forms/formik/formik-submit-button';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import useNotify from '../hooks/useNotify';
import { handleApiError } from '../utils/error.util';
import { FormikHelpers } from "formik";
import { useAppDispatch } from '../store/hooks';
import { setLoggedInUser } from '../store/slices/user.slice';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';
import { storage } from '../utils/storage';

type EditProfileItemRouteProp = RouteProp<RootStackParamsList, 'editDisplayName'>;

interface EditProfileItemFormValues {
    [key: string]: string;
}

export default function EditProfileItem() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const route = useRoute<EditProfileItemRouteProp>();
    const { label, routeLabel, placeholder, name, defaultValue } = route.params as any;
    const { showSnackBar } = useNotify();
    const dispatch = useAppDispatch();
    const loggedInUser = useSelector((state: any) => state.user.loggedInUser);

    const validationSchema = Yup.object().shape({
        [name]: Yup.string().required(`${label} is required`),
    });

    const initialValues: EditProfileItemFormValues = {
        [name]: defaultValue || ''
    };

    const updateProfileMutation = useMutation({
        mutationFn: api.user.updateProfile
    });

    const handleSubmit = async (
        values: EditProfileItemFormValues,
        { setSubmitting }: FormikHelpers<EditProfileItemFormValues>
    ) => {
        try {
            const formData = new FormData();
            formData.append(name, values[name]);

            await updateProfileMutation.mutateAsync(formData);

            // Get fresh user data
            const userProfile = await api.user.getProfile();

            // Map profile fields to user structure
            const basicInfo = userProfile.data.basicInformation;

            const updatedUserData = {
                token: loggedInUser?.token,
                user: {
                    ...loggedInUser?.user,
                    name: basicInfo.displayName,
                    display_name: basicInfo.displayName,
                    phone: basicInfo.mobileNumber,
                    address: basicInfo.homeAddress,
                    city: basicInfo.city,
                    profile_image: basicInfo.profileImage,
                },
                device: loggedInUser?.device,
                expiresAt: loggedInUser?.expiresAt,
              };

            dispatch(setLoggedInUser(updatedUserData));
            await storage.setUserData(updatedUserData);
            
            showSnackBar('Profile updated successfully', 'success');
            navigation.goBack();
        } catch (error) {
            console.log('ERROR: ', error);
            handleApiError(error, showSnackBar, {
                defaultMessage: 'Failed to update profile'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-[#292C33] px-4 pt-16">
            <View className="flex-row items-center p-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft 
                            size={24} 
                            color={colorScheme == 'dark' ? '#FFFFFF' : '#000000'} 
                        />
                </TouchableOpacity>
                <Text className="font-semibold text-xl ml-4 text-black dark:text-white">
                    {routeLabel}
                </Text>
            </View>

            <FormikForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <View className="mt-12">
                    <FormikInput
                        name={name}
                        label={label}
                        placeholder={placeholder}
                    />

                    <View className="mt-16">
                        <FormikSubmitButton
                            title="Save Changes"
                            valueType={initialValues}
                            className="bg-primary"
                        />
                    </View>
                </View>
            </FormikForm>
        </View>
    );
}
