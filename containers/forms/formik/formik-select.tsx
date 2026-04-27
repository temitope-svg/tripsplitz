import { Field, FieldProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { SelectInputContainer } from '../../../components';
import { View, TouchableOpacity, Text } from 'react-native';

export default function FormikSelect({ ...props }: CustomInputProps) {
    return (
        <Field name={props.name}>
            {({ field, form }: FieldProps) => {
                if (props.config?.selectType == 'pill') {
                    return (
                        <View className="w-full flex-row flex-wrap gap-2">
                            {props.options?.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => form.setFieldValue(props.name, option.value)}
                                    className={`px-4 py-2 rounded-full border ${
                                        field.value === option.value 
                                        ? 'bg-primary border-primary' 
                                        : 'border-gray-300'
                                    }`}
                                >
                                    <Text className={field.value === option.value ? 'text-white' : 'text-gray-700'}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                }

                return (
                    <SelectInputContainer
                        dropdownType='item'
                        data={props.options!}
                        labelField="label"
                        valueField="value"
                        testIDPrefix={props.name}
                        onChange={item => {
                            form.setFieldValue(props.name, item.value);
                        }}
                        search={props.config?.isSearchable}
                        placeholder={props.label}
                        value={field.value}
                        disabled={props.disabled}
                    />
                )
            }}
        </Field>
    );
} 
