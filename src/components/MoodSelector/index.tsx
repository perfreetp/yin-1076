import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { MoodType } from '@/types/ivf';
import styles from './index.module.scss';

interface MoodSelectorProps {
  selectedMood?: MoodType;
  onSelect?: (mood: MoodType) => void;
  size?: 'small' | 'large';
}

const moodOptions = [
  { value: 'happy' as MoodType, label: '开心', emoji: '😊', color: '#52C41A' },
  { value: 'calm' as MoodType, label: '平静', emoji: '😌', color: '#4A90D9' },
  { value: 'anxious' as MoodType, label: '焦虑', emoji: '😰', color: '#FAAD14' },
  { value: 'sad' as MoodType, label: '低落', emoji: '😢', color: '#722ED1' },
  { value: 'angry' as MoodType, label: '烦躁', emoji: '😤', color: '#FF4D4F' },
  { value: 'tired' as MoodType, label: '疲惫', emoji: '😴', color: '#8C8C8C' }
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  selectedMood, 
  onSelect,
  size = 'large'
}) => {
  const handleSelect = (mood: MoodType) => {
    if (onSelect) {
      onSelect(mood);
    }
  };

  return (
    <View className={`${styles.moodSelector} ${size === 'small' ? styles.small : ''}`}>
      {moodOptions.map((option) => (
        <View
          key={option.value}
          className={classnames(
            styles.moodItem,
            selectedMood === option.value && styles.selected
          )}
          style={{ 
            borderColor: selectedMood === option.value ? option.color : undefined,
            background: selectedMood === option.value ? `${option.color}15` : undefined
          }}
          onClick={() => handleSelect(option.value)}
        >
          <Text className={styles.moodEmoji}>{option.emoji}</Text>
          <Text 
            className={styles.moodLabel}
            style={{ color: selectedMood === option.value ? option.color : undefined }}
          >
            {option.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default MoodSelector;
