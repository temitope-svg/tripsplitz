'use client';
import React, { FC } from 'react';
import { FieldInputProps, FieldMetaProps, FormikProps } from 'formik';
import FormikInputField from './formik-input-field';
import FormInputWrapper from '../form-input-wrapper';
import FormikSelect from './formik-select';
import FormikCheckBox from './formik-checkbox';
import FormikDatetimePicker from './formik-datetime-picker';
import FormikCurrencyInput from './formik-currency-input';
import FormikDateRangePicker from './formik-daterange-picker';
import FormikFilePicker from './formik-file-picker';

export interface CustomInputProps {
  name: string;
  type?:
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'datepicker'
  | 'timepicker'
  | 'phone'
  | 'checkbox'
  | 'select'
  | 'currency'
  | 'file'
  | 'address'
  | 'daterange';
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  field?: FieldInputProps<any>;
  form?: FormikProps<any>;
  meta?: FieldMetaProps<any>;
  options?: IInputOptions[];
  config?: ICustomInputConfigProps;
  icon?: React.JSX.Element;
  currencySymbol?: string;
  hide?: boolean;
}

interface IInputOptions {
  label: string;
  value: string;
}

interface ICustomInputConfigProps {
  selectType?: 'pill' | 'pill-multiple';
  isSearchable?: boolean;
  replaceName?: string;
  defaultAddress?: string;
  defaultCurrency?: string;
  disableCurrency?: boolean;
}

const FormikInput: FC<CustomInputProps> = ({ type = 'text', ...props }) => {
  switch (type) {
    case 'text':
    case 'number':
    case 'password':
    case 'email':
    case 'phone':
    case 'address':
      return (
        <FormInputWrapper input={props}>
          <FormikInputField type={type} {...props} />
        </FormInputWrapper>
      )

    case 'checkbox':
      return (
        <FormInputWrapper input={props}>
          <FormikCheckBox type={type} {...props} />
        </FormInputWrapper>
      )

    case 'select':
      return (
        <FormInputWrapper input={props}  withBackground={false}>
          <FormikSelect {...props} />
        </FormInputWrapper>
      )

    case 'datepicker':
      return (
        <FormInputWrapper input={props}>
          <FormikDatetimePicker {...props} />
        </FormInputWrapper>
      )

    case 'daterange':
      return (
        <FormInputWrapper input={props}>
          <FormikDateRangePicker {...props} />
        </FormInputWrapper>
      )

    case 'currency':
      return (
        <FormInputWrapper input={props} withBorder={false} withBackground={false}>
          <FormikCurrencyInput {...props} />
        </FormInputWrapper>
      )

    case 'file':
      return (
        <FormInputWrapper input={props} withBorder={false} withBackground={false}>
          <FormikFilePicker {...props} />
        </FormInputWrapper>
      )
  }
};

export default FormikInput; 