import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh } from '@tarojs/taro';
import CalendarView from '@/components/CalendarView';
import TaskItemComponent from '@/components/TaskItem';
import type { CalendarEvent } from '@/types/ivf';
import { calendarEvents, getEventsByDate } from '@/data/calendar';
import { formatDate, getRelativeDate } from '@/utils/date';
import styles from './index.module.scss';

const typeLabels: Record<string, string> = {
  examination: '检查',
  medication: '用药',
  injection: '注射',
  visit: '就诊',
  reminder: '提醒'
};

const typeColors: Record<string, string> = {
  examination: '#4A90D9',
  medication: '#52C41A',
  injection: '#FF6B9D',
  visit: '#FAAD14',
  reminder: '#722ED1'
};

const phaseOptions = [
  { id: 'all', name: '全部' },
  { id: 'initial', name: '初诊' },
  { id: 'examination', name: '检查' },
  { id: 'stimulation', name: '促排' },
  { id: 'retrieval', name: '取卵' },
  { id: 'transfer', name: '移植' },
  { id: 'pregnancy', name: '验孕' }
];

const CalendarPage: React.FC = () => {
  const today = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [activePhase, setActivePhase] = useState<string>('all');
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  
  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    console.log('[Calendar] Date selected:', date);
  };
  
  const handleEventComplete = (id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, status: 'completed' as const } : event
    ));
    Taro.showToast({ title: '已完成', icon: 'success' });
    console.log('[Calendar] Event completed:', id);
  };
  
  const selectedDateEvents = useMemo(() => {
    const dayEvents = events.filter(event => event.date === selectedDate);
    if (activePhase === 'all') return dayEvents;
    return dayEvents.filter(e => e.phase === activePhase);
  }, [selectedDate, activePhase, events]);
  
  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => e.date >= today && e.status === 'pending')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events, today]);
  
  const handlePhaseChange = (phase: string) => {
    setActivePhase(phase);
    console.log('[Calendar] Phase changed:', phase);
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'examination') {
      Taro.navigateTo({ url: '/pages/examination-detail/index' });
    } else if (event.type === 'medication' || event.type === 'injection') {
      Taro.navigateTo({ url: '/pages/medication-detail/index' });
    }
  };

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>日程日历</Text>
        <Text className={styles.pageSubtitle}>合理安排，安心度过每一步</Text>
      </View>
      
      <View className={styles.phaseTabs}>
        {phaseOptions.map(phase => (
          <View
            key={phase.id}
            className={`${styles.phaseTab} ${activePhase === phase.id ? styles.active : ''}`}
            onClick={() => handlePhaseChange(phase.id)}
          >
            {phase.name}
          </View>
        ))}
      </View>
      
      <View className={styles.calendarSection}>
        <CalendarView 
          events={events}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </View>
      
      <View className={styles.legendSection}>
        <Text className={styles.legendTitle}>日程图例</Text>
        <View className={styles.legendList}>
          {Object.entries(typeLabels).map(([type, label]) => (
            <View key={type} className={styles.legendItem}>
              <View 
                className={styles.legendDot}
                style={{ background: typeColors[type] }}
              />
              <Text className={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View className={styles.selectedDateSection}>
        <View className={styles.selectedDateHeader}>
          <Text className={styles.selectedDateTitle}>当日日程</Text>
          <Text className={styles.selectedDate}>
            {getRelativeDate(selectedDate)} · {selectedDate}
          </Text>
        </View>
        
        {selectedDateEvents.length > 0 ? (
          <View className={styles.eventsList}>
            {selectedDateEvents.map(event => (
              <View 
                key={event.id}
                className={styles.eventItem}
                onClick={() => handleEventClick(event)}
              >
                <View 
                  className={styles.eventIcon}
                  style={{ background: `${typeColors[event.type]}20` }}
                >
                  {event.type === 'examination' && '🔬'}
                  {event.type === 'medication' && '💊'}
                  {event.type === 'injection' && '💉'}
                  {event.type === 'visit' && '🏥'}
                  {event.type === 'reminder' && '⏰'}
                </View>
                <View className={styles.eventContent}>
                  <View 
                    className={styles.eventType}
                    style={{ 
                      background: `${typeColors[event.type]}20`, 
                      color: typeColors[event.type] 
                    }}
                  >
                    {typeLabels[event.type]}
                  </View>
                  <Text className={styles.eventTitle}>{event.title}</Text>
                  <Text className={styles.eventTime}>{selectedDate}</Text>
                </View>
                <View className={styles.eventAction}>
                  {event.status === 'pending' ? (
                    <Button 
                      className={styles.completeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventComplete(event.id);
                      }}
                    >
                      完成
                    </Button>
                  ) : (
                    <View className={styles.completedBadge}>✓</View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyEvents}>
            <Text className={styles.emptyIcon}>📅</Text>
            <Text className={styles.emptyText}>当日暂无安排</Text>
          </View>
        )}
      </View>
      
      <View className={styles.upcomingSection}>
        <View className={styles.selectedDateHeader}>
          <Text className={styles.selectedDateTitle}>近期安排</Text>
        </View>
        
        <View className={styles.upcomingList}>
          {upcomingEvents.map(event => {
            const dateObj = new Date(event.date);
            return (
              <View 
                key={event.id}
                className={styles.upcomingItem}
                onClick={() => handleDateSelect(event.date)}
              >
                <View className={styles.upcomingDate}>
                  <Text className={styles.upcomingDay}>{dateObj.getDate()}</Text>
                  <Text className={styles.upcomingMonth}>{dateObj.getMonth() + 1}月</Text>
                </View>
                <View className={styles.upcomingContent}>
                  <Text className={styles.upcomingTitle}>{event.title}</Text>
                  <Text className={styles.upcomingDesc}>
                    {typeLabels[event.type]} · {getRelativeDate(event.date)}
                  </Text>
                </View>
                <Text className={styles.upcomingArrow}>›</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default CalendarPage;
