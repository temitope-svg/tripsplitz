import {View, Text, ScrollView} from 'react-native';
import React from 'react';

const TableHeader = ({title}: {title: string}) => (
  <View className="w-28 px-3 py-4">
    <Text className="font-bold text-sm">{title}</Text>
  </View>
);

const TableCell = ({value}: {value: number}) => (
  <View className="w-28 px-3 py-4">
    <Text className="text-sm">${value}</Text>
  </View>
);

const TableNameCell = ({name}: {name: string}) => (
  <View className="w-28 px-3 py-4">
    <Text className="text-sm">{name}</Text>
  </View>
);

export default function Settlement() {
  const headers = [
    'Buddy Names',
    'Crispy Yam Fries',
    'Chicken wings',
    'Truffles Fries',
    'Cajun Chicken Caesar',
    'Picnic',
    'The Louvre Museum',
    'Eiffel Tower',
    'Avenue des Champs-Élysées',
    'Crêpe',
    'Croissant and Pain au Chocolat',
    'Flight',
    'Hotel',
    'Total Expense',
  ];

  const data = [
    {
      name: 'Shade',
      expenses: [15, 25, 18, 22, 45, 35, 42, 30, 12, 15, 850, 400],
      total: 1509,
    },
    {
      name: 'Tayo',
      expenses: [12, 20, 15, 25, 40, 32, 38, 28, 10, 12, 850, 400],
      total: 1482,
    },
    {
      name: 'Philip',
      expenses: [18, 28, 20, 24, 42, 38, 45, 32, 15, 18, 850, 400],
      total: 1530,
    },
    {
      name: 'Peace',
      expenses: [14, 22, 16, 20, 38, 30, 36, 25, 8, 10, 850, 400],
      total: 1469,
    },
    {
      name: 'Chris',
      expenses: [16, 24, 19, 23, 44, 34, 40, 29, 11, 14, 850, 400],
      total: 1504,
    },
    {
      name: 'Grace',
      expenses: [13, 21, 17, 21, 39, 31, 37, 26, 9, 11, 850, 400],
      total: 1475,
    },
    {
      name: 'Victor',
      expenses: [17, 26, 21, 26, 46, 36, 43, 31, 13, 16, 850, 400],
      total: 1525,
    },
    {
      name: 'Sofie',
      expenses: [15, 23, 18, 24, 43, 33, 39, 28, 10, 13, 850, 400],
      total: 1496,
    },
  ];

  return (
    <ScrollView className="pt-16 px-4">
      <View className="flex-row gap-x-5">
        <View>
          <Text>Trip Budget</Text>
          <Text className="font-semibold">$4,000</Text>
        </View>
        <View>
          <Text>Contributed</Text>
          <Text className="font-semibold">$3,600</Text>
        </View>
        <View>
          <Text>Expense</Text>
          <Text className="font-semibold">$3,454</Text>
        </View>
      </View>

      <Text className="pt-5 text-xl font-semibold">Activities</Text>

      <ScrollView horizontal className="mt-4">
        <ScrollView>
          {/* Header Row */}
          <View className="flex-row bg-[#F7F6FE]">
            {headers.map((header, index) => (
              <TableHeader key={index} title={header} />
            ))}
          </View>

          {/* Data Rows */}
          {data.map((person, rowIndex) => (
            <View
              key={rowIndex}
              className={`flex-row ${
                rowIndex % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-white'
              }`}>
              <TableNameCell name={person.name} />
              {person.expenses.map((expense, expenseIndex) => (
                <TableCell key={expenseIndex} value={expense} />
              ))}
              <TableCell value={person.total} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </ScrollView>
  );
}
