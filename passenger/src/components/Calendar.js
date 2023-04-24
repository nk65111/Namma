import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const isCurrentDay = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => (
        <Text key={day} style={styles.day}>
          {day}
        </Text>
      ))}

      {daysInMonth.map((day) => (
        <Text
          key={day}
          style={[
            styles.date,
            isCurrentDay(day) && styles.currentDay,
          ]}
        >
          {day}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  day: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    textAlign: 'center',
    margin: 5,
    padding: 5,
    borderRadius: 20,
    width: 30,
    height: 30,
  },
  currentDay: {
    backgroundColor: 'blue',
    color: 'white',
  },
});

export default Calendar;
