import { Field, FieldProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { CheckboxComponent } from '../../../components';

export default function FormikCheckBox({ ...props }: CustomInputProps) {
    return (
        <Field name={props.name}>
            {({ field, form }: FieldProps) => (
                <CheckboxComponent
                    options={props.options}
                    onChange={(value) => {
                        if (field.value.includes(value)) {
                            form.setFieldValue(props.name, field.value.filter((item: any) => item != value));
                        }
                        else {
                            form.setFieldValue(props.name, [...field.value, value]);
                        }
                    }}
                    values={field.value}
                />
            )}
        </Field>
    );
} 