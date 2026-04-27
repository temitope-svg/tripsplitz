import { Field, FieldProps, FormikProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function FormikDatetimePicker({ ...props }: CustomInputProps) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { colorScheme } = useColorScheme();

    const handleSelections = (date: Date, form: FormikProps<any>) => {
        if (date) {
            form.setFieldValue(props.name, date.toISOString())
        }
        setDatePickerVisibility(false);
    }

    return (
        <Field name={props.name}>
            {({ field, form }: FieldProps) => (
                <View>
                    <TouchableOpacity
                        testID={`input-${props.name}`}
                        className='p-2'
                        onPress={() => !props.disabled && setDatePickerVisibility(true)}
                    >
                        <Text className='text-black dark:text-white'>
                            {field.value ? new Date(field.value).toLocaleString() : props.placeholder}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={(date) => handleSelections(date, form)}
                        onCancel={() => setDatePickerVisibility(false)}
                        isDarkModeEnabled={colorScheme == 'dark'}
                        disabled={props.disabled}
                    />
                </View>
            )}
        </Field>
    );
} 
