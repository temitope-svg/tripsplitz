import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SelectInputProps {
  data: Array<{ label: string; value: string }>;
  labelField: string;
  valueField: string;
  onChange: (item: any) => void;
  value?: string;
  placeholder?: string;
  search?: boolean;
  disabled?: boolean;
  dropdownType?: 'item';
  testIDPrefix?: string;
}

export function SelectInputContainer({
  data,
  labelField,
  valueField,
  onChange,
  value,
  placeholder,
  search = false,
  disabled = false,
  testIDPrefix,
}: SelectInputProps) {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedItem = data.find(item => item[valueField] === value);

  const filteredData = search
    ? data.filter(item =>
        item[labelField].toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  return (
    <View className="w-full">
      <TouchableOpacity
        testID={testIDPrefix ? `input-${testIDPrefix}` : undefined}
        onPress={() => !disabled && setVisible(true)}
        className="flex-row items-center justify-between p-3" >
        <Text className={`${!selectedItem ? 'text-gray-400' : 'text-gray-700'}`}>
          {selectedItem ? selectedItem[labelField] : placeholder}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-[20%] bg-white dark:bg-gray-900 rounded-t-3xl">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-semibold text-black dark:text-white">Select {placeholder}</Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {search && (
                <View className="mt-4">
                  <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search..."
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </View>
              )}
            </View>

            <FlatList
              data={filteredData}
              keyExtractor={(item) => item[valueField]}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  testID={testIDPrefix ? `select-${testIDPrefix}-option-${index}` : undefined}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                  className={`p-4 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center
                    ${item[valueField] === value ? 'bg-green-50 dark:bg-green-900' : ''}`}>
                  <Text className={`text-base ${
                    item[valueField] === value ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {item[labelField]}
                  </Text>
                  {item[valueField] === value && (
                    <Icon name="check" size={20} color="#15803d" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
} 
