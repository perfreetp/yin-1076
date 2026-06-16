import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { TaskItem } from '@/types/ivf';
import styles from './index.module.scss';

interface TaskItemProps {
  task: TaskItem;
  onComplete?: (id: string) => void;
  showAction?: boolean;
}

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

const TaskItemComponent: React.FC<TaskItemProps> = ({ task, onComplete, showAction = true }) => {
  const handleComplete = () => {
    if (task.status === 'pending' && onComplete) {
      onComplete(task.id);
      Taro.showToast({ title: '已完成', icon: 'success' });
    }
  };

  return (
    <View 
      className={classnames(
        styles.taskItem,
        task.status === 'completed' && styles.completed,
        task.status === 'overdue' && styles.overdue
      )}
    >
      <View className={styles.taskIcon} style={{ background: `${typeColors[task.type]}20` }}>
        <Text style={{ color: typeColors[task.type] }}>
          {task.type === 'examination' && '🔬'}
          {task.type === 'medication' && '💊'}
          {task.type === 'injection' && '💉'}
          {task.type === 'visit' && '🏥'}
          {task.type === 'reminder' && '⏰'}
        </Text>
      </View>
      
      <View className={styles.taskContent}>
        <View className={styles.taskHeader}>
          <View className={styles.taskType} style={{ background: `${typeColors[task.type]}20`, color: typeColors[task.type] }}>
            {typeLabels[task.type]}
          </View>
          {task.time && (
            <Text className={styles.taskTime}>{task.time}</Text>
          )}
        </View>
        <Text className={styles.taskTitle}>{task.title}</Text>
        {task.description && (
          <Text className={styles.taskDesc}>{task.description}</Text>
        )}
      </View>
      
      {showAction && task.status === 'pending' && (
        <Button 
          className={styles.completeBtn}
          onClick={handleComplete}
        >
          完成
        </Button>
      )}
      
      {showAction && task.status === 'completed' && (
        <View className={styles.completedBadge}>✓</View>
      )}
    </View>
  );
};

export default TaskItemComponent;
