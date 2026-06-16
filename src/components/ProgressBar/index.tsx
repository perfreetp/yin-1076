import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ProgressBarProps {
  progress: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#FF6B9D',
  showLabel = true,
  height = 16
}) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <View className={styles.progressBar}>
      <View 
        className={styles.progressTrack}
        style={{ height: `${height}rpx` }}
      >
        <View 
          className={styles.progressFill}
          style={{ 
            width: `${safeProgress}%`, 
            background: color,
            height: `${height}rpx`
          }}
        />
      </View>
      {showLabel && (
        <Text className={styles.progressLabel}>{safeProgress}%</Text>
      )}
    </View>
  );
};

export default ProgressBar;
