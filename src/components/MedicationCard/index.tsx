import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { Medication } from '@/types/ivf';
import styles from './index.module.scss';

interface MedicationCardProps {
  medication: Medication;
  onCheckIn?: (id: string) => void;
  onClick?: (id: string) => void;
}

const typeLabels: Record<string, string> = {
  oral: '口服',
  injection: '注射',
  external: '外用'
};

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onCheckIn, onClick }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayCheckIn = medication.checkInHistory.find(h => h.date === today);
  const isCheckedIn = todayCheckIn?.completed || false;
  const progress = Math.min(100, Math.round((medication.checkInHistory.filter(h => h.completed).length / (medication.timeSlots.length * 30)) * 100));

  const handleCheckIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCheckedIn && onCheckIn) {
      onCheckIn(medication.id);
      Taro.showToast({ title: '打卡成功', icon: 'success' });
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(medication.id);
    }
  };

  return (
    <View className={styles.medicationCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.medicationIcon}>
          {medication.type === 'oral' && '💊'}
          {medication.type === 'injection' && '💉'}
          {medication.type === 'external' && '🧴'}
        </View>
        <View className={styles.medicationInfo}>
          <View className={styles.medicationNameRow}>
            <Text className={styles.medicationName}>{medication.name}</Text>
            <View className={styles.typeTag}>{typeLabels[medication.type]}</View>
          </View>
          <Text className={styles.medicationDosage}>{medication.dosage} · {medication.frequency}</Text>
        </View>
      </View>
      
      <View className={styles.cardBody}>
        <View className={styles.timeSlots}>
          <Text className={styles.timeLabel}>今日时间：</Text>
          <View className={styles.timeList}>
            {medication.timeSlots.map((time, index) => (
              <View key={index} className={styles.timeChip}>
                {time}
              </View>
            ))}
          </View>
        </View>
        
        <View className={styles.progressRow}>
          <Text className={styles.progressLabel}>用药进度</Text>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progress}%` }} />
          </View>
          <Text className={styles.progressText}>{progress}%</Text>
        </View>
      </View>
      
      <View className={styles.cardFooter}>
        <Text className={styles.dateRange}>
          {medication.startDate} 至 {medication.endDate}
        </Text>
        
        <Button 
          className={`${styles.checkInBtn} ${isCheckedIn ? styles.checkedIn : ''}`}
          onClick={handleCheckIn}
          disabled={isCheckedIn}
        >
          {isCheckedIn ? '已打卡' : '立即打卡'}
        </Button>
      </View>
    </View>
  );
};

export default MedicationCard;
