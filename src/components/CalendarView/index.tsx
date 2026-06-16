import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import type { CalendarEvent } from '@/types/ivf';
import { getMonthDays, getMonthName, getWeekDayName, formatDate, isToday } from '@/utils/date';
import styles from './index.module.scss';

interface CalendarViewProps {
  events?: CalendarEvent[];
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
}

const typeColors: Record<string, string> = {
  examination: '#4A90D9',
  medication: '#52C41A',
  injection: '#FF6B9D',
  visit: '#FAAD14',
  reminder: '#722ED1'
};

const CalendarView: React.FC<CalendarViewProps> = ({ events = [], selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date);
    return events.filter(e => e.date === dateStr);
  };
  
  const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const dateStr = formatDate(date);
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
    if (onDateSelect) {
      onDateSelect(formatDate(new Date()));
    }
  };
  
  const isSelectedDate = (date: Date, isCurrentMonth: boolean): boolean => {
    if (!isCurrentMonth || !selectedDate) return false;
    return formatDate(date) === selectedDate;
  };

  return (
    <View className={styles.calendarView}>
      <View className={styles.calendarHeader}>
        <Button className={styles.navBtn} onClick={handlePrevMonth}>
          ‹
        </Button>
        <Text className={styles.monthTitle}>
          {year}年{getMonthName(month)}
        </Text>
        <Button className={styles.navBtn} onClick={handleNextMonth}>
          ›
        </Button>
      </View>
      
      <Button className={styles.todayBtn} onClick={handleToday}>
        今天
      </Button>
      
      <View className={styles.weekDays}>
        {weekDays.map((day, index) => (
          <View 
            key={day} 
            className={`${styles.weekDay} ${index === 0 || index === 6 ? styles.weekend : ''}`}
          >
            {day}
          </View>
        ))}
      </View>
      
      <View className={styles.daysGrid}>
        {days.map(({ date, isCurrentMonth }, index) => {
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(formatDate(date));
          const isSelected = isSelectedDate(date, isCurrentMonth);
          const dayOfWeek = index % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          return (
            <View 
              key={index}
              className={classnames(
                styles.dayCell,
                !isCurrentMonth && styles.otherMonth,
                isTodayDate && styles.today,
                isSelected && styles.selected,
                isWeekend && styles.weekendDay
              )}
              onClick={() => handleDateClick(date, isCurrentMonth)}
            >
              <Text className={styles.dayNumber}>{date.getDate()}</Text>
              
              {dayEvents.length > 0 && (
                <View className={styles.eventDots}>
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <View 
                      key={i}
                      className={styles.eventDot}
                      style={{ background: typeColors[event.type] }}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CalendarView;
