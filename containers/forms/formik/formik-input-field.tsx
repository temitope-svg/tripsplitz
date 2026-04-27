import { Field, FieldProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { KeyboardTypeOptions, Text, View, TextInput } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { useColorScheme } from 'nativewind';

export default function FormikInputField({ name, type, ...rest }: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();

  
  const iconColor = colorScheme === 'dark' ? '#DDE2E5' : '#878F96';


  let keyboardType: KeyboardTypeOptions = 'default';
  switch (type) {
    case "phone":
      keyboardType = "phone-pad";
      break;
    case "email":
      keyboardType = "email-address";
      break;
    case "number":
      keyboardType = "numeric";
      break;
  }

  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <View className="flex-1">
          <TextInput
            {...rest}
            testID={`input-${name}`}
            value={field.value}
            onChangeText={text => form.setFieldValue(name, text)}
            onBlur={() => {
              form.setFieldTouched(name);
              field.onBlur(name);
            }}
            secureTextEntry={type === 'password' && !showPassword}
            keyboardType={keyboardType}
            placeholder={rest.placeholder}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            editable={!rest.disabled}
            className={`text-black dark:text-white dark:placeholder:text-[#DDE2E5] ${
              type === 'password' ? 'pr-8' : ''
            }`}
          />
          {type === 'password' && (
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-0"
              style={{ top: '50%', transform: [{ translateY: -10 }] }}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              {showPassword ? (
                <Eye size={20} color={iconColor} variant="Bold" />
              ) : (
                <EyeSlash size={20} color={iconColor} variant="Bold" />
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </Field>
  );
} 
