import { Field, FieldProps, FormikProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import DateRangePicker from "rn-select-date-range";


export default function FormikDateRangePicker({ ...props }: CustomInputProps) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const selectedDateContainerStyle = {
        height: 35,
        width: '100%' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderRadius: 8,
        backgroundColor: isDarkMode ? '#16A34A' : '#047857',
    };

    const selectedDateStyle = {
        fontWeight: '700' as const,
        color: '#FFFFFF',
    };

    const handleSelections = (date: any, form: FormikProps<any>) => {
        if (date) {
            form.setFieldValue('startDate', date.firstDate)
            form.setFieldValue('endDate', date.secondDate)
            form.setFieldValue('dates', `${date.firstDate} - ${date.secondDate}`)
        }
        setDatePickerVisibility(false);
    }

    return (
        <Field name={props.name}>
            {({ field, form }: FieldProps) => (
                <View className='  w-full'>
                    <TouchableOpacity testID={`input-${props.name}`} className='p-2' onPress={() => !props.disabled && setDatePickerVisibility((prev) => !prev)}>
                        <Text className='text-black dark:text-white'>
                            {field.value ? field.value : props.placeholder}
                        </Text>
                    </TouchableOpacity>
                    <View className={isDatePickerVisible ? 'block' : 'hidden'}>
                        <View className='rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-2'>
                            <DateRangePicker
                                onSelectDateRange={(range) => handleSelections(range, form)}
                                blockSingleDateSelection={true}
                                responseFormat="YYYY-MM-DD"
                                onConfirm={() => setDatePickerVisibility(false)}
                                selectedDateContainerStyle={selectedDateContainerStyle}
                                selectedDateStyle={selectedDateStyle}
                            />
                        </View>
                    </View>
                </View>
            )}
        </Field>
    );
} 
