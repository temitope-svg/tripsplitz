import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface YearSelectorProps {
  selectedYear?: number;
  onYearSelect?: (year: number) => void;
  years?: number[];
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear: propSelectedYear,
  onYearSelect,
  years: propYears
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(propSelectedYear || currentYear);
  const [showOtherYears, setShowOtherYears] = useState(false);

  // Generate years array: current year and 3 previous years
  const years = propYears || [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3
  ];

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    onYearSelect?.(year);
  };

  const YearItem = ({ year }: { year: number }) => (
    <TouchableOpacity onPress={() => handleYearSelect(year)}>
      <View className="items-center mx-2">
        <Text
          className={`text-xs mb-1 ${selectedYear === year ? 'text-[#B91C1C] dark:text-white' : 'text-gray-700 dark:text-[#878F96]'
            }`}>
          {year}
        </Text>
        <View
          className={`w-10 h-[1.1px] ${selectedYear === year ? 'bg-[#B91C1C] dark:bg-white' : 'bg-gray-300'
            }`}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-row items-center mx-auto mt-4 justify-center relative">



      {years.map(year => (
        <YearItem key={year} year={year} />
      ))}
      <TouchableOpacity onPress={() => setShowOtherYears(!showOtherYears)}>
        <View className="items-center rounded-full border border-gray-500 h-6 w-6 justify-center">
          <Text className="text-base text-gray-500">+</Text>
        </View>
      </TouchableOpacity>

      {showOtherYears && (
        <View className='bg-white absolute bottom-8 right-0 p-2 rounded-lg shadow-lg'>

          {
            [currentYear - 6, currentYear - 5, currentYear - 4,].map((year) => (
              <TouchableOpacity key={year} className='p-2' onPress={() => {
                handleYearSelect(year)
                setShowOtherYears(false)
              }}>
                <Text className={`text-sm ${selectedYear === year ? 'text-[#B91C1C] dark:text-white' : 'text-gray-700 dark:text-[#878F96]'
                  }`}>{year}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      )}
    </View>
  );
};

export default YearSelector;
