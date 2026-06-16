import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh } from '@tarojs/taro';
import Timeline from '@/components/Timeline';
import TaskItemComponent from '@/components/TaskItem';
import ProgressBar from '@/components/ProgressBar';
import type { TaskItem } from '@/types/ivf';
import { 
  treatmentOverview, 
  timelineNodes, 
  todayTasks, 
  phaseList, 
  contraindications,
  familyMembers
} from '@/data/treatment';
import { getRelativeDate, formatDate } from '@/utils/date';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(todayTasks);
  const [refreshing, setRefreshing] = useState(false);
  
  const currentPhase = phaseList.find(p => p.status === 'current');
  
  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });
  
  const handleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: 'completed' as const } : task
    ));
    console.log('[Home] Task completed:', id);
  }, []);
  
  const handleActionClick = (action: string) => {
    console.log('[Home] Action clicked:', action);
    switch (action) {
      case 'medication':
        Taro.switchTab({ url: '/pages/medical/index' });
        break;
      case 'symptom':
        Taro.navigateTo({ url: '/pages/symptom-record/index' });
        break;
      case 'pregnancy':
        Taro.navigateTo({ url: '/pages/pregnancy-test/index' });
        break;
      case 'question':
        Taro.navigateTo({ url: '/pages/question-ask/index' });
        break;
      case 'abnormal':
        Taro.navigateTo({ url: '/pages/abnormal-flag/index' });
        break;
      case 'document':
        Taro.navigateTo({ url: '/pages/document-upload/index' });
        break;
      case 'expense':
        Taro.navigateTo({ url: '/pages/expense-record/index' });
        break;
      case 'family':
        Taro.navigateTo({ url: '/pages/family-share/index' });
        break;
      default:
        break;
    }
  };
  
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  
  const quickActions = [
    { id: 'medication', icon: '💊', label: '用药打卡', color: '#52C41A' },
    { id: 'symptom', icon: '📝', label: '症状记录', color: '#FAAD14' },
    { id: 'pregnancy', icon: '🤰', label: '验孕记录', color: '#FF6B9D' },
    { id: 'question', icon: '❓', label: '问题提问', color: '#722ED1' },
    { id: 'abnormal', icon: '🚨', label: '异常标记', color: '#FF4D4F' },
    { id: 'document', icon: '📄', label: '单据上传', color: '#4A90D9' },
    { id: 'expense', icon: '💰', label: '费用记录', color: '#13C2C2' },
    { id: 'family', icon: '👨‍👩‍👧', label: '家属共享', color: '#EB2F96' }
  ];

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.greetingSection}>
        <Text className={styles.greeting}>早上好，李女士 🌸</Text>
        <Text className={styles.subGreeting}>今天是试管疗程的第 {treatmentOverview.daysInTreatment} 天</Text>
      </View>
      
      <View className={styles.overviewCard}>
        <View className={styles.overviewHeader}>
          <View className={styles.phaseInfo}>
            <View className={styles.phaseBadge}>当前阶段</View>
            <Text className={styles.phaseName}>{treatmentOverview.phaseName}</Text>
            <Text className={styles.daysText}>已进行 {treatmentOverview.daysInTreatment} 天</Text>
          </View>
          <View className={styles.nextEvent}>
            <Text className={styles.nextDate}>{getRelativeDate(treatmentOverview.nextKeyDate)}</Text>
            <Text className={styles.nextLabel}>下一关键节点</Text>
            <Text className={styles.nextEventText}>{treatmentOverview.nextKeyEvent}</Text>
          </View>
        </View>
        
        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>整体疗程进度</Text>
            <Text className={styles.progressValue}>{treatmentOverview.totalProgress}%</Text>
          </View>
          <ProgressBar 
            progress={treatmentOverview.totalProgress} 
            color="#fff" 
            showLabel={false}
            height={20}
          />
          
          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{treatmentOverview.completedTasks}</Text>
              <Text className={styles.statLabel}>已完成任务</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{treatmentOverview.pendingTasks}</Text>
              <Text className={styles.statLabel}>待完成任务</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{phaseList.filter(p => p.status === 'completed').length}/{phaseList.length}</Text>
              <Text className={styles.statLabel}>已完成阶段</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View className={styles.todayTasksCard}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>今日待办</Text>
          <Text className={styles.sectionAction}>{pendingCount} 项待完成</Text>
        </View>
        
        {pendingCount > 0 ? (
          <View className={styles.taskList}>
            {tasks.map(task => (
              <TaskItemComponent 
                key={task.id} 
                task={task} 
                onComplete={handleTaskComplete}
              />
            ))}
          </View>
        ) : (
          <View className="emptyState">
            <Text>🎉 今日任务已全部完成</Text>
          </View>
        )}
      </View>
      
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>快速操作</Text>
      </View>
      
      <View className={styles.quickActions}>
        {quickActions.map(action => (
          <View 
            key={action.id}
            className={styles.actionItem}
            onClick={() => handleActionClick(action.id)}
          >
            <View 
              className={styles.actionIcon}
              style={{ background: `${action.color}15` }}
            >
              {action.icon}
            </View>
            <Text className={styles.actionLabel}>{action.label}</Text>
          </View>
        ))}
      </View>
      
      <View className={styles.timelineCard}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>疗程时间线</Text>
          <Text 
            className={styles.sectionAction}
            onClick={() => Taro.switchTab({ url: '/pages/calendar/index' })}
          >
            查看全部
          </Text>
        </View>
        
        <Timeline nodes={timelineNodes} />
      </View>
      
      {currentPhase && (
        <View className={styles.tipsCard}>
          <View className={styles.tipsHeader}>
            <Text className={styles.tipsIcon}>💡</Text>
            <Text className={styles.tipsTitle}>{currentPhase.name}注意事项</Text>
          </View>
          <Text className={styles.tipText}>{currentPhase.description}</Text>
          <View className={styles.tipsList}>
            {currentPhase.tips.map((tip, index) => (
              <View key={index} className={styles.tipItem}>
                <View className={styles.tipDot} />
                <Text className={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {familyMembers.length > 0 && (
        <View className={styles.familyBanner}>
          <View className={styles.familyInfo}>
            <View className={styles.familyAvatar}>
              {familyMembers[0].name.charAt(0)}
            </View>
            <View className={styles.familyText}>
              <Text className={styles.familyName}>{familyMembers[0].name}</Text>
              <Text className={styles.familyStatus}>已与您共享疗程进度</Text>
            </View>
          </View>
          <Button 
            className={styles.shareBtn}
            onClick={() => handleActionClick('family')}
          >
            管理
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default HomePage;
