import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import MoodSelector from '@/components/MoodSelector';
import SymptomTag from '@/components/SymptomTag';
import type { MoodType, SymptomSeverity } from '@/types/ivf';
import {
  symptomRecords,
  moodRecords,
  pregnancyTests,
  bodyMetrics,
  abnormalFlags,
  questionCards,
  moodOptions
} from '@/data/health';
import { formatDate, getRelativeDate, daysBetween } from '@/utils/date';
import styles from './index.module.scss';

const quickActions = [
  { id: 'symptom', icon: '🤒', label: '记录症状', color: '#FF6B9D' },
  { id: 'mood', icon: '😊', label: '记录心情', color: '#52C41A' },
  { id: 'pregnancy', icon: '🤰', label: '验孕打卡', color: '#722ED1' },
  { id: 'metrics', icon: '📊', label: '记录指标', color: '#4A90D9' },
  { id: 'question', icon: '❓', label: '提问医生', color: '#FAAD14' },
  { id: 'abnormal', icon: '⚠️', label: '异常标记', color: '#FF4D4F' }
];

const HealthPage: React.FC = () => {
  const [todayMood, setTodayMood] = useState<MoodType | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  });

  const handleMoodSelect = useCallback((mood: MoodType) => {
    setTodayMood(mood);
  }, []);

  const getMoodEmoji = (mood: MoodType): string => {
    const option = moodOptions.find(o => o.value === mood);
    return option ? option.emoji : '😐';
  };

  const getMoodLabel = (mood: MoodType): string => {
    const option = moodOptions.find(o => o.value === mood);
    return option ? option.label : '未知';
  };

  const getSeverityClass = (severity: SymptomSeverity): string => {
    return severity;
  };

  const getLatestMetrics = () => {
    if (bodyMetrics.length === 0) return null;
    return bodyMetrics[0];
  };

  const getWeightChartData = () => {
    const last7 = bodyMetrics.slice(0, 7).reverse();
    const weights = last7.map(m => m.weight || 0);
    const minWeight = Math.min(...weights) - 0.5;
    const maxWeight = Math.max(...weights) + 0.5;
    const range = maxWeight - minWeight;
    
    return last7.map(m => ({
      date: m.date.slice(5),
      weight: m.weight || 0,
      height: range > 0 ? `${((m.weight || 0) - minWeight) / range * 100}%` : '50%'
    }));
  };

  const getDaysToPregnancyTest = () => {
    const transferDate = new Date('2026-06-25');
    const today = new Date();
    const testDate = new Date(transferDate);
    testDate.setDate(transferDate.getDate() + 14);
    return Math.max(0, daysBetween(formatDate(today), formatDate(testDate)));
  };

  const latestMetrics = getLatestMetrics();
  const weightChartData = getWeightChartData();
  const daysToTest = getDaysToPregnancyTest();

  return (
    <ScrollView
      scrollY
      className={styles.pageContainer}
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
      }}
    >
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>身体记录</Text>
        <Text className={styles.pageSubtitle}>记录每一天的变化，感受宝宝的到来</Text>
      </View>

      <View className={styles.quickActions}>
        {quickActions.map((action) => (
          <View key={action.id} className={styles.actionCard}>
            <View
              className={styles.actionIcon}
              style={{ background: `${action.color}15` }}
            >
              <Text>{action.icon}</Text>
            </View>
            <Text className={styles.actionLabel}>{action.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.moodCard}>
        <View className={styles.moodToday}>
          <Text className={styles.moodTodayLabel}>今日心情</Text>
          {todayMood ? (
            <View className={styles.moodTodayValue}>
              <Text className={styles.moodEmoji}>{getMoodEmoji(todayMood)}</Text>
              <Text className={styles.moodLabel}>{getMoodLabel(todayMood)}</Text>
            </View>
          ) : (
            <Text className={styles.moodTodayLabel}>点击下方记录心情</Text>
          )}
        </View>
        <MoodSelector selectedMood={todayMood} onSelect={handleMoodSelect} />

        <View className={styles.moodHistory}>
          <Text className={styles.moodHistoryTitle}>近7天心情</Text>
          <View className={styles.moodChart}>
            {moodRecords.slice(0, 7).reverse().map((record) => (
              <View key={record.id} className={styles.moodChartItem}>
                <Text className={styles.moodChartEmoji}>{getMoodEmoji(record.mood)}</Text>
                <Text className={styles.moodChartDay}>{getRelativeDate(record.date)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.symptomsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>症状记录</Text>
          <Text className={styles.sectionAction}>查看全部</Text>
        </View>
        <View className={styles.symptomsList}>
          {symptomRecords.slice(0, 3).map((record) => (
            <View key={record.id} className={styles.symptomItem}>
              <View className={styles.symptomHeader}>
                <Text className={styles.symptomDate}>{getRelativeDate(record.date)}</Text>
                <View className={classnames(styles.severityTag, styles[getSeverityClass(record.severity)])}>
                  {record.severity === 'mild' ? '轻微' : record.severity === 'moderate' ? '中度' : '严重'}
                </View>
              </View>
              <View className={styles.symptomTags}>
                {record.symptoms.map((symptom, index) => (
                  <SymptomTag key={index} symptom={symptom} selected severity={record.severity} />
                ))}
              </View>
              {record.note && (
                <Text className={styles.symptomNote}>{record.note}</Text>
              )}
            </View>
          ))}
        </View>
        <Button className={styles.secondaryBtn}>记录新症状</Button>
      </View>

      <View className={styles.metricsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>身体指标</Text>
          <Text className={styles.sectionAction}>记录</Text>
        </View>
        <View className={styles.metricsCard}>
          <View className={styles.metricsGrid}>
            <View className={styles.metricItem}>
              <View className={styles.metricIcon} style={{ background: 'rgba(255, 107, 157, 0.1)' }}>
                <Text>🌡️</Text>
              </View>
              <View className={styles.metricInfo}>
                <Text className={styles.metricLabel}>体温</Text>
                <Text className={styles.metricValue}>
                  {latestMetrics?.temperature?.toFixed(1) || '--'}
                  <Text className={styles.metricUnit}>℃</Text>
                </Text>
              </View>
            </View>
            <View className={styles.metricItem}>
              <View className={styles.metricIcon} style={{ background: 'rgba(74, 144, 217, 0.1)' }}>
                <Text>⚖️</Text>
              </View>
              <View className={styles.metricInfo}>
                <Text className={styles.metricLabel}>体重</Text>
                <Text className={styles.metricValue}>
                  {latestMetrics?.weight?.toFixed(1) || '--'}
                  <Text className={styles.metricUnit}>kg</Text>
                </Text>
              </View>
            </View>
            <View className={styles.metricItem}>
              <View className={styles.metricIcon} style={{ background: 'rgba(82, 196, 26, 0.1)' }}>
                <Text>❤️</Text>
              </View>
              <View className={styles.metricInfo}>
                <Text className={styles.metricLabel}>心率</Text>
                <Text className={styles.metricValue}>
                  {latestMetrics?.heartRate || '--'}
                  <Text className={styles.metricUnit}>次/分</Text>
                </Text>
              </View>
            </View>
            <View className={styles.metricItem}>
              <View className={styles.metricIcon} style={{ background: 'rgba(250, 173, 20, 0.1)' }}>
                <Text>🩺</Text>
              </View>
              <View className={styles.metricInfo}>
                <Text className={styles.metricLabel}>血压</Text>
                <Text className={styles.metricValue}>
                  {latestMetrics?.bloodPressure || '--'}
                </Text>
              </View>
            </View>
          </View>

          <View className={styles.metricsChart}>
            <Text className={styles.metricsChartTitle}>体重变化趋势</Text>
            <View className={styles.weightChart}>
              {weightChartData.map((item, index) => (
                <View key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <View
                    className={styles.weightBar}
                    style={{ height: item.height }}
                    data-weight={`${item.weight}kg`}
                  />
                  <Text className={styles.weightBarLabel}>{item.date}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.pregnancySection}>
        <View className={styles.pregnancyCard}>
          <View className={styles.pregnancyInfo}>
            <Text className={styles.pregnancyText}>距离第一次验孕还有</Text>
            <Text className={styles.pregnancyCountdown}>{daysToTest} 天</Text>
          </View>
          <Text className={styles.pregnancyNote}>
            预计验孕日期：2026年07月09日（移植后第14天）。请保持心情放松，注意休息，如有异常请及时联系医生。
          </Text>
          <Button className={styles.recordBtn}>记录验孕结果</Button>
        </View>

        {pregnancyTests.length > 0 && (
          <View style={{ marginTop: '24rpx' }}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>历史记录</Text>
            </View>
            {pregnancyTests.map((test) => (
              <View key={test.id} className={styles.symptomItem}>
                <View className={styles.symptomHeader}>
                  <Text className={styles.symptomDate}>{getRelativeDate(test.date)}</Text>
                  <View className={classnames(
                    styles.severityTag,
                    test.result === 'positive' ? styles.severe : test.result === 'negative' ? styles.moderate : styles.mild
                  )}>
                    {test.result === 'positive' ? '阳性' : test.result === 'negative' ? '阴性' : test.result === 'weak' ? '弱阳性' : '待确认'}
                  </View>
                </View>
                {test.hcgValue && (
                  <Text className={styles.symptomNote}>HCG 值：{test.hcgValue} mIU/mL</Text>
                )}
                {test.note && (
                  <Text className={styles.symptomNote} style={{ marginTop: '8rpx' }}>{test.note}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View className={styles.questionsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的问题</Text>
          <Text className={styles.sectionAction}>提问</Text>
        </View>
        <View className={styles.questionList}>
          {questionCards.slice(0, 3).map((question) => (
            <View key={question.id} className={styles.questionItem}>
              <View className={styles.questionHeader}>
                <View className={styles.questionCategory}>{question.category}</View>
                <View className={classnames(styles.questionStatus, styles[question.status])}>
                  {question.status === 'pending' ? '待回答' : question.status === 'answered' ? '已回答' : '已归档'}
                </View>
              </View>
              <Text className={styles.questionText}>{question.question}</Text>
              {question.answer && (
                <View className={styles.questionAnswer}>
                  <Text>{question.answer}</Text>
                </View>
              )}
              <Text className={styles.questionDate}>{question.createDate}</Text>
            </View>
          ))}
        </View>
      </View>

      {abnormalFlags.length > 0 && (
        <View className={styles.abnormalSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>异常情况</Text>
            <Text className={styles.sectionAction}>一键标记</Text>
          </View>
          {abnormalFlags.map((abnormal) => (
            <View
              key={abnormal.id}
              className={classnames(
                styles.abnormalCard,
                abnormal.status === 'resolved' && styles.resolved
              )}
            >
              <View className={styles.abnormalHeader}>
                <Text className={styles.abnormalType}>{abnormal.type}</Text>
                <View className={classnames(styles.abnormalSeverity, styles[abnormal.severity])}>
                  {abnormal.severity === 'mild' ? '轻微' : abnormal.severity === 'moderate' ? '中度' : '严重'}
                </View>
              </View>
              <Text className={styles.abnormalDesc}>{abnormal.description}</Text>
              {abnormal.suggestion && (
                <View className={styles.abnormalSuggestion}>
                  <Text className={styles.suggestionLabel}>医生建议</Text>
                  <Text className={styles.suggestionText}>{abnormal.suggestion}</Text>
                </View>
              )}
              <View className={styles.abnormalFooter}>
                <Text className={styles.abnormalDate}>{abnormal.createDate}</Text>
                <View className={classnames(styles.abnormalStatus, styles[abnormal.status])}>
                  {abnormal.status === 'pending' ? '待处理' : abnormal.status === 'resolved' ? '已解决' : '观察中'}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HealthPage;
