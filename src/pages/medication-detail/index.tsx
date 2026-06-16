import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { medications } from '@/data/medical';
import { formatDate, daysBetween, getRelativeDate } from '@/utils/date';
import styles from './index.module.scss';

const typeLabels: Record<string, string> = {
  oral: '口服药',
  injection: '注射剂',
  external: '外用药'
};

const typeIcons: Record<string, string> = {
  oral: '💊',
  injection: '💉',
  external: '🧴'
};

const injectionSteps = [
  {
    title: '准备工作',
    desc: '洗手，准备好药物、注射器、酒精棉片。将药物从冰箱取出，放置30分钟复温。'
  },
  {
    title: '选择注射部位',
    desc: '腹部皮下注射（肚脐两侧3指外），每次轮换注射部位，避免在同一部位反复注射。'
  },
  {
    title: '消毒',
    desc: '用酒精棉片以注射点为中心，由内向外螺旋式消毒，消毒范围直径约5cm，待干。'
  },
  {
    title: '注射',
    desc: '轻轻捏起皮肤，针头与皮肤呈90度角快速刺入，回抽无血后缓慢推注药物。'
  },
  {
    title: '按压',
    desc: '注射完成后快速拔出针头，用干棉片按压注射部位5分钟，不要揉搓。'
  },
  {
    title: '处理废弃物',
    desc: '将用过的针头放入专用锐器盒，不要随意丢弃，避免刺伤。'
  }
];

const MedicationDetailPage: React.FC = () => {
  const router = useRouter();
  const medId = router.params.id;

  const [medication, setMedication] = useState(() => {
    return medications.find(m => m.id === medId) || medications[0];
  });

  const today = formatDate(new Date());

  const progressInfo = useMemo(() => {
    const totalDays = daysBetween(medication.startDate, medication.endDate) + 1;
    const daysPassed = daysBetween(medication.startDate, today);
    const completedDays = medication.checkInHistory.filter(h => h.completed).length;
    const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));
    
    return {
      totalDays,
      daysPassed: Math.max(0, Math.min(totalDays, daysPassed)),
      completedDays,
      progress,
      remainingDays: Math.max(0, totalDays - daysPassed)
    };
  }, [medication, today]);

  const todayCheckIns = useMemo(() => {
    return medication.timeSlots.map(time => {
      const record = medication.checkInHistory.find(
        h => h.date === today && h.time.startsWith(time.slice(0, 2))
      );
      return {
        time,
        completed: !!record,
        checkInTime: record?.time
      };
    });
  }, [medication, today]);

  const handleCheckIn = useCallback((timeSlot: string) => {
    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setMedication(prev => ({
      ...prev,
      checkInHistory: [
        ...prev.checkInHistory,
        { date: today, time: checkInTime, completed: true }
      ]
    }));
    
    Taro.showToast({ title: '打卡成功', icon: 'success' });
  }, [today]);

  const handleSetReminder = () => {
    Taro.showToast({ title: '提醒设置已保存', icon: 'success' });
  };

  const handleReportSideEffect = () => {
    Taro.navigateTo({ url: '/pages/symptom-record/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerCard}>
        <View className={styles.medicationType}>
          {typeIcons[medication.type]} {typeLabels[medication.type]}
        </View>
        <Text className={styles.medicationName}>{medication.name}</Text>
        <Text className={styles.medicationDosage}>{medication.dosage} · {medication.frequency}</Text>
        <View className={styles.medicationMeta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>📅</Text>
            <Text>{medication.startDate} ~ {medication.endDate}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>⏰</Text>
            <Text>{medication.timeSlots.join('、')}</Text>
          </View>
        </View>
      </View>

      <View className={styles.progressSection}>
        <Text className={styles.sectionTitle}>用药进度</Text>
        <View className={styles.progressInfo}>
          <Text className={styles.progressLabel}>
            已用 {progressInfo.daysPassed} 天，剩余 {progressInfo.remainingDays} 天
          </Text>
          <Text className={styles.progressValue}>{progressInfo.progress}%</Text>
        </View>
        <View className={styles.progressBar}>
          <View 
            className={styles.progressFill} 
            style={{ width: `${progressInfo.progress}%` }}
          />
        </View>
      </View>

      <View className={styles.timeSlotsSection}>
        <Text className={styles.sectionTitle}>今日用药时间</Text>
        <View className={styles.timeSlotsList}>
          {todayCheckIns.map((slot, index) => (
            <View key={index} className={styles.timeSlotItem}>
              <View className={styles.timeSlotInfo}>
                <Text className={styles.timeSlotTime}>{slot.time}</Text>
                <Text className={styles.timeSlotStatus}>
                  {slot.completed 
                    ? `已打卡 ${slot.checkInTime}` 
                    : '待用药'}
                </Text>
              </View>
              <Button
                className={`${styles.checkInBtn} ${slot.completed ? styles.completed : ''}`}
                onClick={() => !slot.completed && handleCheckIn(slot.time)}
                disabled={slot.completed}
              >
                {slot.completed ? '✓ 已完成' : '立即打卡'}
              </Button>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>最近打卡记录</Text>
        {medication.checkInHistory.length > 0 ? (
          <View className={styles.historyList}>
            {[...medication.checkInHistory].reverse().slice(0, 10).map((record, index) => (
              <View key={index} className={styles.historyItem}>
                <View>
                  <Text className={styles.historyDate}>{getRelativeDate(record.date)}</Text>
                  <Text className={styles.historyTime}>  {record.time}</Text>
                </View>
                <View className={`${styles.historyStatus} ${record.completed ? styles.completed : styles.missed}`}>
                  <Text>{record.completed ? '✓' : '✗'}</Text>
                  <Text>{record.completed ? '已完成' : '未完成'}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            暂无打卡记录
          </View>
        )}
      </View>

      <View className={styles.instructionsSection}>
        <Text className={styles.instructionsTitle}>💡 用药说明</Text>
        <Text className={styles.instructionsContent}>{medication.instructions}</Text>
      </View>

      {medication.sideEffects && medication.sideEffects.length > 0 && (
        <View className={styles.sideEffectsSection}>
          <Text className={styles.sectionTitle}>可能的副作用</Text>
          <View className={styles.sideEffectsList}>
            {medication.sideEffects.map((effect, index) => (
              <View key={index} className={styles.sideEffectTag}>
                <Text>{effect}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {medication.type === 'injection' && (
        <View className={styles.injectionGuideSection}>
          <Text className={styles.sectionTitle}>注射步骤指导</Text>
          <View className={styles.guideSteps}>
            {injectionSteps.map((step, index) => (
              <View key={index} className={styles.guideStep}>
                <View className={styles.stepNumber}>{index + 1}</View>
                <View className={styles.stepContent}>
                  <Text className={styles.stepTitle}>{step.title}</Text>
                  <Text className={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.footerActions}>
        <Button className={styles.secondaryBtn} onClick={handleReportSideEffect}>
          报告副作用
        </Button>
        <Button className={styles.primaryBtn} onClick={handleSetReminder}>
          设置提醒
        </Button>
      </View>
    </View>
  );
};

export default MedicationDetailPage;
