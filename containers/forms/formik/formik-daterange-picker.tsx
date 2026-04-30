import { Field, FieldProps, FormikProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type PickerStep = 'start' | 'end' | null;

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export default function FormikDateRangePicker({ ...props }: CustomInputProps) {
    const [pickerStep, setPickerStep] = useState<PickerStep>(null);
    const [pendingStartDate, setPendingStartDate] = useState<Date | null>(null);
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const closePicker = () => {
        setPendingStartDate(null);
        setPickerStep(null);
    };

    const handleSelections = (date: Date, form: FormikProps<any>) => {
        if (pickerStep === 'start') {
            setPendingStartDate(date);
            setPickerStep('end');
            return;
        }

        if (date && pendingStartDate) {
            const start = pendingStartDate <= date ? pendingStartDate : date;
            const end = pendingStartDate <= date ? date : pendingStartDate;

            form.setFieldValue('startDate', formatDate(start));
            form.setFieldValue('endDate', formatDate(end));
            form.setFieldValue(props.name, `${formatDate(start)} - ${formatDate(end)}`);
        }

        closePicker();
    };

    return (
        <Field name={props.name}>
            {({ field, form }: FieldProps) => (
                <View className='w-full'>
                    <TouchableOpacity
                        testID={`input-${props.name}`}
                        className='p-2'
                        onPress={() => {
                            if (!props.disabled) {
                                setPendingStartDate(null);
                                setPickerStep('start');
                            }
                        }}
                    >
                        <Text className='text-black dark:text-white'>
                            {field.value || props.placeholder}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={pickerStep !== null}
                        mode='date'
                        onConfirm={(date) => handleSelections(date, form)}
                        onCancel={closePicker}
                        isDarkModeEnabled={isDarkMode}
                        disabled={props.disabled}
                    />
                </View>
            )}
        </Field>
    );
} 
