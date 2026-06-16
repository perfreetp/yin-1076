import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { AbnormalFlag, SymptomSeverity } from '@/types/ivf';
import { abnormalFlags, abnormalTypes } from '@/data/health';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

const severityOptions: { value: SymptomSeverity; label: string; icon: string }[] = [
  { value: 'mild', label: '轻微', icon: '😊' },
  { value: 'moderate', label: '中度', icon: '😐' },
  { value: 'severe', label: '严重', icon: '😣' }
];

const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'monitoring', label: '观察中' },
  { value: 'resolved', label: '已解决' }
];

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: '待处理', class: 'pending' },
  monitoring: { label: '观察中', class: 'monitoring' },
  resolved: { label: '已解决', class: 'resolved' }
};

const AbnormalFlagPage: React.FC = () => {
  const today = formatDate(new Date());

  const [type, setType] = useState<string>('');
  const [severity, setSeverity] = useState<SymptomSeverity | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const [notifyDoctor, setNotifyDoctor] = useState<boolean>(true);
  const [flags, setFlags] = useState<AbnormalFlag[]>(abnormalFlags);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const stats = useMemo(() => {
    const pending = flags.filter(f => f.status === 'pending').length;
    const monitoring = flags.filter(f => f.status === 'monitoring').length;
    return { total: flags.length, pending, monitoring };
  }, [flags]);

  const filteredFlags = useMemo(() => {
    if (activeFilter === 'all') return flags;
    return flags.filter(f => f.status === activeFilter);
  }, [flags, activeFilter]);

  const handleEmergencyCall = useCallback(() => {
    Taro.showModal({
      title: '紧急联系',
      content: '确定要拨打医院急诊电话吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: '120',
            fail: () => {
              Taro.showToast({ title: '拨号失败', icon: 'none' });
            }
          });
        }
      }
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!type) {
      Taro.showToast({ title: '请选择异常类型', icon: 'none' });
      return;
    }
    if (!severity) {
      Taro.showToast({ title: '请选择严重程度', icon: 'none' });
      return;
    }
    if (!description.trim()) {
      Taro.showToast({ title: '请描述具体症状', icon: 'none' });
      return;
    }

    if (severity === 'severe') {
      Taro.showModal({
        title: '严重异常提醒',
        content: '您标记了严重异常，建议立即联系医生或前往医院就诊。是否立即拨打医院电话？',
        confirmText: '立即拨打',
        cancelText: '仅记录',
        success: (res) => {
          if (res.confirm) {
            Taro.makePhoneCall({ phoneNumber: '120' });
          }
        }
      });
    }

    const newFlag: AbnormalFlag = {
      id: `abn-${Date.now()}`,
      createDate: today,
      type,
      description: description.trim(),
      severity,
      notified: notifyDoctor,
      status: 'pending'
    };

    setFlags(prev => [newFlag, ...prev]);

    Taro.showToast({
      title: notifyDoctor ? '已提交，医生会尽快回复' : '记录成功',
      icon: 'success'
    });

    setType('');
    setSeverity(undefined);
    setDescription('');
    setNotifyDoctor(true);
  }, [type, severity, description, notifyDoctor, today]);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.warningCard}>
        <Text className={styles.warningTitle}>
          ⚠️ 重要提醒
        </Text>
        <Text className={styles.warningContent}>
          如遇到剧烈腹痛、大量出血、高热不退等紧急情况，请立即拨打医院急诊电话或前往就近医院就诊，不要等待！
        </Text>
        <View className={styles.emergencyBtn} onClick={handleEmergencyCall}>
          📞 紧急联系医院
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>标记异常情况</Text>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>异常类型
          </Text>
          <View className={styles.typeOptions}>
            {abnormalTypes.map((t) => (
              <View
                key={t}
                className={`${styles.typeOption} ${type === t ? styles.selected : ''}`}
                onClick={() => setType(t)}
              >
                {t}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>严重程度
          </Text>
          <View className={styles.severityOptions}>
            {severityOptions.map((option) => (
              <View
                key={option.value}
                className={`${styles.severityOption} ${severity === option.value ? styles.selected : ''} ${styles[option.value]}`}
                onClick={() => setSeverity(option.value)}
              >
                <Text className={styles.severityIcon}>{option.icon}</Text>
                <Text className={styles.severityLabel}>{option.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>症状描述
          </Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请详细描述您的症状，包括出现时间、持续时长、具体感受等..."
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            maxlength={300}
          />
          <Text className={styles.charCount}>{description.length}/300</Text>
        </View>

        <View className={styles.formGroup}>
          <View className={styles.notifyOption}>
            <View className={styles.notifyInfo}>
              <Text className={styles.notifyLabel}>通知医生</Text>
              <Text className={styles.notifyDesc}>开启后医生会收到您的异常提醒</Text>
            </View>
            <View
              className={`${styles.switch} ${notifyDoctor ? styles.active : ''}`}
              onClick={() => setNotifyDoctor(!notifyDoctor)}
            />
          </View>
        </View>

        <View className={styles.submitBtn} onClick={handleSubmit}>
          提交异常标记
        </View>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>
          历史记录（共{stats.total}条，待处理{stats.pending}条）
        </Text>

        <View className={styles.filterTabs}>
          {filterOptions.map((option) => (
            <View
              key={option.value}
              className={`${styles.filterTab} ${activeFilter === option.value ? styles.active : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </View>
          ))}
        </View>

        {filteredFlags.length > 0 ? (
          <View className={styles.flagList}>
            {filteredFlags.map((flag) => (
              <View key={flag.id} className={styles.flagItem}>
                <View className={styles.flagHeader}>
                  <View className={styles.flagType}>
                    {flag.severity === 'severe' ? '🚨' : flag.severity === 'moderate' ? '⚠️' : 'ℹ️'}
                    {flag.type}
                  </View>
                  <View className={`${styles.flagSeverity} ${styles[flag.severity]}`}>
                    {severityOptions.find(s => s.value === flag.severity)?.label}
                  </View>
                </View>
                <Text className={styles.flagDate}>{flag.createDate}</Text>
                <Text className={styles.flagDescription}>{flag.description}</Text>
                <View className={styles.flagStatus}>
                  <View className={`${styles.statusDot} ${styles[statusLabels[flag.status].class]}`} />
                  <Text className={`${styles.statusText} ${styles[statusLabels[flag.status].class]}`}>
                    {statusLabels[flag.status].label}
                  </Text>
                  {flag.notified && (
                    <Text style={{ fontSize: '20rpx', color: '#8C8C8C', marginLeft: 'auto' }}>
                      已通知医生
                    </Text>
                  )}
                </View>
                {flag.suggestion && (
                  <View className={styles.suggestionSection}>
                    <Text className={styles.suggestionLabel}>
                      👨‍⚕️ 医生建议
                    </Text>
                    <Text className={styles.suggestionContent}>{flag.suggestion}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>✅</Text>
            <Text className={styles.emptyText}>暂无异常记录</Text>
            <Text className={styles.emptySubtext}>一切顺利，继续保持！</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AbnormalFlagPage;
