import { Field, FieldProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { TextInput, View } from 'react-native';

export default function FormikTextArea({ ...props }: CustomInputProps) {
    return (
        <Field name={props.name}>
            {({ field, form, meta }: FieldProps) => (
                <View>
                    <TextInput
                        {...props}
                        value={field.value}
                        onChangeText={text => form.setFieldValue(props.name, text)}
                        onBlur={() => {
                            form.setFieldTouched(props.name);
                            field.onBlur(props.name);
                        }}
                        multiline
                        numberOfLines={4}
                        className={`p-3 border rounded-lg ${
                            meta.touched && meta.error 
                            ? 'border-red-500' 
                            : 'border-gray-300'
                        } ${props.className}`}
                        textAlignVertical="top"
                    />
                    {meta.touched && meta.error && (
                        <Text className="text-red-500 text-sm mt-1">{meta.error}</Text>
                    )}
                </View>
            )}
        </Field>
    );
} 