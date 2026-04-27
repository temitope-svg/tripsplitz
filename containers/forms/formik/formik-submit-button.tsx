import React from 'react';
import { useFormikContext } from "formik";
import ButtonComponent from '../../../components/ButtonComponent';

interface FormikSubmitButtonProps<T> {
    title: string;
    valueType: T;
    className?: string;
    testID?: string;
}

function FormikSubmitButton<T>({ title, className = '', testID }: FormikSubmitButtonProps<T>) {
    const { handleSubmit, isSubmitting, isValid } = useFormikContext();

    return (
        <ButtonComponent
            testID={testID}
            title={title}
            disabled={!isValid}
            onPress={() => handleSubmit()}
            isLoading={isSubmitting}
            variant="primary"
            className={className}
        />
    );
}

export default FormikSubmitButton; 