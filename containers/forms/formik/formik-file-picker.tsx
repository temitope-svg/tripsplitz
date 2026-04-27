import { Field, FieldProps } from 'formik';
import { CustomInputProps } from './formik-input';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useState } from 'react';

export default function FormikFilePicker({ name, label, ...rest }: CustomInputProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleSelectImage = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    });

    if (result.assets && result.assets[0]) {
      const selectedImage = result.assets[0];
      setPreview(selectedImage.uri || null);
      setFieldValue(name, {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName,
      });
    }
  };

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => (
        <View>

          <View className="flex-row items-center">
            <TouchableOpacity
              testID={`input-${name}`}
              onPress={() => !rest.disabled && handleSelectImage(form.setFieldValue)}
              className="border border-gray-300 rounded-lg p-4 flex-row items-center">
              <Image
                source={require('../../../assets/camera.png')}
                className="w-6 h-5 mr-2"
              />
              <Text className="text-gray-600">
                {preview ? 'Change Image' : 'Upload Image'}
              </Text>
            </TouchableOpacity>

            {preview && (
              <View className="ml-4">
                <Image
                  source={{ uri: preview }}
                  className="w-16 h-16 rounded-lg"
                />
              </View>
            )}
          </View>
        </View>
      )}
    </Field>
  );
} 