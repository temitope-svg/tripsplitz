import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../utils/types';
import GeneralLayout from '../layouts/GeneralLayout';

interface LanguageOptionProps {
  language: string;
  isSelected: boolean;
  onSelect: (language: string) => void;
}

const LanguageOption = ({
  language,
  isSelected,
  onSelect,
}: LanguageOptionProps) => (
  <TouchableOpacity
    onPress={() => onSelect(language)}
    className={`flex-row items-center p-4 rounded-lg ${
      isSelected ? 'bg-gray-200 dark:bg-gray-700' : ''
    }`}>
    <Text className={`text-lg ${isSelected ? 'font-semibold' : ''} text-black dark:text-white`}>
      {language}
    </Text>
    {isSelected && (
      <View className="bg-[#DEFFDD] dark:bg-[#1E3A29] px-2 py-1 rounded-xl ml-4">
        <Text className="text-green-800 dark:text-green-400 text-sm">Selected</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function Language() {
  const navigation = useNavigation<NavigationProps>();
  const [selectedLanguage, setSelectedLanguage] = useState(
    'English US (EN - US)',
  );

  const languages = [
    'English US (EN - US)',
    'English UK (EN - UK)',
    'Chinese (中文)',
    'French (FR)',
    'German (DE)',
  ];

  const handleSaveSelection = () => {
    console.log('Saving selected language:', selectedLanguage);
    navigation.goBack();
  };

  return (
    <GeneralLayout title="App Language">
      <View className="flex-1">
        <Text className="font-semibold text-xl pt-10 pb-5 text-black dark:text-white">
          Select language
        </Text>
        {languages.map(language => (
          <LanguageOption
            key={language}
            language={language}
            isSelected={selectedLanguage === language}
            onSelect={setSelectedLanguage}
          />
        ))}
      </View>
      <View className="pb-6 mt-auto">
        <TouchableOpacity
          onPress={handleSaveSelection}
          className="bg-green-700 py-4 rounded-2xl">
          <Text className="text-white text-center font-semibold text-lg">
            Save Selection
          </Text>
        </TouchableOpacity>
      </View>
    </GeneralLayout>
  );
}
