import { Text, View } from "react-native";
import { CustomInputProps } from "./formik/formik-input";
import React from "react";
import { useFormikContext } from "formik";

interface FormInputWrapperProps {
  input: CustomInputProps;
  children: React.ReactNode;
  withBorder?: boolean;
  withBackground?: boolean;
}

export default function FormInputWrapper({ input, children, withBorder = true, withBackground = true }: FormInputWrapperProps) {
    const formikContext = useFormikContext();

    return (
        <View className="my-2.5">
            {input.label && (
                <Text className="mb-2 text-sm dark:text-[#F8F9FA]">
                    {input.label}
                    {input.required && <Text className="text-red-500">*</Text>}
                </Text>
            )}

            <View className={`
                ${input.label ? 'flex-row justify-center ' : ''} 
                ${withBackground ? 'bg-[#F8F9FA] dark:bg-[#54585C]  px-2' : ''} 
                ${withBorder ? 'border border-[#DDE2E5] dark:border-[#878F96] rounded-md' : ''}
            `}>
                {input.icon && (
                    <View className="mr-2 justify-center">
                        {input.icon}
                    </View>
                )}
                <View className="flex-1 h-fit flex-row items-center">
                    {children}
                </View>
            </View>

            {formikContext.getFieldMeta(input.name) 
            && formikContext.getFieldMeta(input.name).touched 
            && formikContext.getFieldMeta(input.name).error && (
                <Text testID={`error-${input.name}`} className="text-red-600 text-xs mt-1">
                    {formikContext.getFieldMeta(input.name).error}
                </Text>
            )}
        </View>
    );
} 
