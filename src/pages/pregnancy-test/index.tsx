import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Button, Input, Textarea, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { PregnancyResult } from '@/types/ivf';
import { pregnancyTests } from '@/data/health';
import { formatDate, daysBetween } from '@/utils/date';
import styles from './index.module.scss';

const resultOptions = [
  { value: 'positive' as PregnancyResult, label: '阳性', emoji: '🤰', color: '#722ED1' },
  { value: 'negative' as PregnancyResult, label: '阴性', emoji: '😔', color: '#8C8C8C' },
  { value: 'weak' as PregnancyResult, label: '弱阳性', emoji: '🤔', color: '#FAAD14' },
  { value: 'pending' as PregnancyResult, label: '待确认', emoji: '⏳', color: '#4A90D9' }
];

const PregnancyTestPage: React.FC = () => {
  const today = formatDate(new Date());
  const transferDate = '2026-06-25';
  
  const [result, setResult] = useState<PregnancyResult | undefined>(undefined);
  const [hcgValue, setHcgValue] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [records, setRecords] = useState(pregnancyTests);

  const daysToTest = useMemo(() => {
    const testDate = new Date(transferDate);
    testDate.setDate(testDate.getDate() + 14);
    return Math.max(0, daysBetween(today, formatDate(testDate)));
  }, [today, transferDate]);

  const daysAfterTransfer = useMemo(() => {
    return daysBetween(transferDate, today);
  }, [today, transferDate]);

  const handleChooseImage = useCallback(() => {
    Taro.chooseImage({
      count: 3 - images.length,
      success: (res) => {
        setImages(prev => [...prev, ...res.tempFilePaths]);
      }
    });
  }, [images.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!result) {
      Taro.showToast({ title: '请选择验孕结果', icon: 'none' });
      return;
    }

    const newRecord = {
      id: `pt-${Date.now()}`,
      date: today,
      result,
      hcgValue: hcgValue ? parseFloat(hcgValue) : undefined,
      note,
      imageUrl: images[0],
      daysAfterTransfer: Math.max(0, daysAfterTransfer)
    };

    setRecords(prev => [newRecord, ...prev]);
    
    Taro.showToast({ title: '记录成功', icon: 'success' });
    
    setResult(undefined);
    setHcgValue('');
    setNote('');
    setImages([]);
  }, [result, hcgValue, note, images, today, daysAfterTransfer]);

  const handlePreviewImage = useCallback((url: string) => {
    Taro.previewImage({
      urls: records.filter(r => r.imageUrl).map(r => r.imageUrl!),
      current: url
    });
  }, [records]);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.countdownCard}>
        <Text className={styles.countdownTitle}>距离移植后第14天验孕还有</Text>
        <Text className={styles.countdownDays}>{daysToTest}</Text>
        <Text className={styles.countdownSubtitle}>
          预计验孕日期：2026年07月09日
        </Text>
        {daysAfterTransfer > 0 && (
          <Text className={styles.daysAfterTransfer}>
            今天是移植后第 {daysAfterTransfer} 天
          </Text>
        )}
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>记录验孕结果</Text>
        
        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>验孕结果</Text>
          <View className={styles.resultOptions}>
            {resultOptions.map((option) => (
              <View
                key={option.value}
                className={`${styles.resultOption} ${result === option.value ? styles.selected : ''}`}
                onClick={() => setResult(option.value)}
              >
                <Text className={styles.resultEmoji}>{option.emoji}</Text>
                <Text className={styles.resultLabel}>{option.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>HCG 值（选填）</Text>
          <Input
            className={styles.formInput}
            type="digit"
            placeholder="请输入 HCG 数值"
            value={hcgValue}
            onInput={(e) => setHcgValue(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>照片（选填，最多3张）</Text>
          <View className={styles.uploadSection}>
            {images.map((img, index) => (
              <View key={index} className={styles.uploadItem}>
                <Image className={styles.uploadImage} src={img} mode="aspectFill" />
                <View className={styles.removeBtn} onClick={() => handleRemoveImage(index)}>
                  ✕
                </View>
              </View>
            ))}
            {images.length < 3 && (
              <View className={styles.uploadBtn} onClick={handleChooseImage}>
                <Text className={styles.uploadIcon}>+</Text>
                <Text className={styles.uploadText}>上传照片</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>备注（选填）</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="记录一下今天的感受或其他情况..."
            value={note}
            onInput={(e) => setNote(e.detail.value)}
            maxlength={200}
          />
        </View>

        <Button className={styles.submitBtn} onClick={handleSubmit}>
          保存记录
        </Button>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>历史记录</Text>
        {records.length > 0 ? (
          <View className={styles.historyList}>
            {records.map((record) => (
              <View key={record.id} className={styles.historyItem}>
                <View className={styles.historyHeader}>
                  <Text className={styles.historyDate}>{record.date}</Text>
                  <View className={`${styles.historyResult} ${styles[record.result]}`}>
                    {resultOptions.find(o => o.value === record.result)?.emoji}{' '}
                    {resultOptions.find(o => o.value === record.result)?.label}
                  </View>
                </View>
                <View className={styles.historyInfo}>
                  {record.hcgValue && (
                    <Text className={styles.infoItem}>
                      HCG: <Text className={styles.infoValue}>{record.hcgValue} mIU/mL</Text>
                    </Text>
                  )}
                  <Text className={styles.infoItem}>
                    移植后 <Text className={styles.infoValue}>第{record.daysAfterTransfer}天</Text>
                  </Text>
                </View>
                {record.note && (
                  <Text className={styles.historyNote}>{record.note}</Text>
                )}
                {record.imageUrl && (
                  <Image
                    className={styles.historyImage}
                    src={record.imageUrl}
                    mode="aspectFill"
                    onClick={() => handlePreviewImage(record.imageUrl!)}
                  />
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>暂无验孕记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PregnancyTestPage;
