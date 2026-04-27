import { Formik, FormikHelpers, FormikValues } from 'formik';
import React, { ReactNode } from 'react';

type FormikFormProps<T> = {
  initialValues: T;
  children: ReactNode;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void;
  validationSchema?: any;
  innerRef?: any;
};

export default function FormikForm<T extends FormikValues>({
  initialValues,
  children,
  onSubmit,
  validationSchema,
  ...props
}: FormikFormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
      validateOnMount
      innerRef={props.innerRef}
      enableReinitialize
    >
      {() => (
        <>
          {children}
        </>
      )}
    </Formik>
  );
} 