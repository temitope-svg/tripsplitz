import { Field, FieldProps, useFormikContext } from 'formik';
import { CustomInputProps } from './formik-input';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import { TextInput } from 'react-native';
import { useState } from 'react';
import { ArrowDown2 } from 'iconsax-react-native';

const CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '¥', code: 'JPY' },
  // Add more currencies as needed
];

interface CurrencyInputProps extends CustomInputProps {
  currencyFieldName?: string;
}

export default function FormikCurrencyInput({ 
  name, 
  currencyFieldName = 'currency',
  ...rest 
}: CurrencyInputProps) {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const formik = useFormikContext();
  const selectedCurrency = formik.values[currencyFieldName] || 'USD';
  const currencySymbol = CURRENCIES.find(c => c.code === selectedCurrency)?.symbol || '$';

  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters
    const number = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = number.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts[1];
    
    // Format with 2 decimal places
    if (parts.length === 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return number;
  };

  const handleCurrencySelect = (currencyCode: string) => {
    formik.setFieldValue(currencyFieldName, currencyCode);
    setShowCurrencyModal(false);
  };

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => (
        <View className='w-full '>
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => !rest.disabled && !rest.config?.disableCurrency && setShowCurrencyModal(true)}
              className="border rounded-xl h-full border-gray-300 flex-row items-center px-3 dark:bg-[#54585C] "
            >
              <Text className="text-lg mr-1 text-black dark:text-white">{currencySymbol}</Text>
              <ArrowDown2 size={16} color="#878F96" />
            </TouchableOpacity>
            <View className={`flex-1 ml-2 border w-full rounded-xl ${
              meta.touched && meta.error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 overflow-hidden'
            }`}>
              <TextInput
                {...rest}
                testID={`input-${name}`}
                value={field.value}
                onChangeText={text => {
                  const formattedValue = formatCurrency(text);
                  form.setFieldValue(name, formattedValue);
                }}
                onBlur={() => {
                  form.setFieldTouched(name);
                  field.onBlur(name);
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
                className="px-3 py-3 text-black dark:text-white dark:bg-[#54585C] rounded-xl"
                editable={!rest.disabled}
              />
            </View>
          </View>

          <Modal
            visible={showCurrencyModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCurrencyModal(false)}
          >
            <View className="flex-1 justify-end">
              <TouchableOpacity 
                className="flex-1 bg-black/50"
                onPress={() => setShowCurrencyModal(false)}
              />
              <View className="bg-white dark:bg-[#292C33] rounded-t-3xl p-4">
                <Text className="text-lg font-semibold mb-4 text-center text-black dark:text-white  ">
                  Select Currency
                </Text>
                {CURRENCIES.map((currency) => (
                  <TouchableOpacity
                    key={currency.code}
                    onPress={() => handleCurrencySelect(currency.code)}
                    className={`p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-600
                      ${selectedCurrency === currency.code ? 'bg-green-50 dark:bg-[#54585C]' : ''}`}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-lg mr-2 text-black dark:text-white">{currency.symbol}</Text>
                      <Text className="text-lg text-black dark:text-white">{currency.code}</Text>
                    </View>
                    {selectedCurrency === currency.code && (
                        <Text className="text-green-600 dark:text-white">✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>


        </View>
      )}
    </Field>
  );
} 