import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Button, Input, Textarea, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { ExpenseType, ExpenseRecord } from '@/types/ivf';
import { expenseRecords, expenseSummary } from '@/data/medical';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

const typeOptions: { value: ExpenseType; label: string; icon: string }[] = [
  { value: 'examination', label: '检查费', icon: '🔬' },
  { value: 'medication', label: '药费', icon: '💊' },
  { value: 'surgery', label: '手术费', icon: '🏥' },
  { value: 'injection', label: '注射费', icon: '💉' },
  { value: 'other', label: '其他', icon: '📝' }
];

const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'examination', label: '检查费' },
  { value: 'medication', label: '药费' },
  { value: 'surgery', label: '手术费' },
  { value: 'other', label: '其他' }
];

const ExpenseRecordPage: React.FC = () => {
  const today = formatDate(new Date());

  const [type, setType] = useState<ExpenseType | undefined>(undefined);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hospital, setHospital] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string[]>([]);
  const [records, setRecords] = useState<ExpenseRecord[]>(expenseRecords);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const totalSummary = useMemo(() => {
    const total = records.reduce((sum, r) => sum + r.amount, 0);
    const thisMonth = records
      .filter(r => r.date.startsWith(today.slice(0, 7)))
      .reduce((sum, r) => sum + r.amount, 0);
    const count = records.length;
    return { total, thisMonth, count };
  }, [records, today]);

  const filteredRecords = useMemo(() => {
    if (activeFilter === 'all') return records;
    return records.filter(r => r.type === activeFilter);
  }, [records, activeFilter]);

  const handleChooseImage = useCallback(() => {
    Taro.chooseImage({
      count: 1 - receiptImage.length,
      success: (res) => {
        setReceiptImage(prev => [...prev, ...res.tempFilePaths]);
      }
    });
  }, [receiptImage.length]);

  const handleRemoveImage = useCallback(() => {
    setReceiptImage([]);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!type) {
      Taro.showToast({ title: '请选择费用类型', icon: 'none' });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    if (!description.trim()) {
      Taro.showToast({ title: '请输入费用描述', icon: 'none' });
      return;
    }

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: today,
      type,
      amount: parseFloat(amount),
      description: description.trim(),
      hospital: hospital.trim() || undefined,
      receiptImage: receiptImage[0]
    };

    setRecords(prev => [newRecord, ...prev]);

    Taro.showToast({ title: '记录成功', icon: 'success' });

    setType(undefined);
    setAmount('');
    setDescription('');
    setHospital('');
    setReceiptImage([]);
  }, [type, amount, description, hospital, receiptImage, today]);

  const handlePreviewImage = useCallback((url: string) => {
    Taro.previewImage({
      urls: records.filter(r => r.receiptImage).map(r => r.receiptImage!),
      current: url
    });
  }, [records]);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>累计花费</Text>
        <Text className={styles.summaryAmount}>{totalSummary.total.toFixed(2)}</Text>
        <View className={styles.summaryStats}>
          <View className={styles.statItem}>
            <Text className={styles.statLabel}>本月花费</Text>
            <Text className={styles.statValue}>¥{totalSummary.thisMonth.toFixed(0)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statLabel}>记录条数</Text>
            <Text className={styles.statValue}>{totalSummary.count} 条</Text>
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>新增费用记录</Text>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>费用类型</Text>
          <View className={styles.typeOptions}>
            {typeOptions.map((option) => (
              <View
                key={option.value}
                className={`${styles.typeOption} ${type === option.value ? styles.selected : ''}`}
                onClick={() => setType(option.value)}
              >
                <Text className={styles.typeIcon}>{option.icon}</Text>
                <Text className={styles.typeLabel}>{option.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>金额（元）</Text>
          <Input
            className={`${styles.formInput} ${styles.amountInput}`}
            type="digit"
            placeholder="请输入金额"
            value={amount}
            onInput={(e) => setAmount(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>费用描述</Text>
          <Input
            className={styles.formInput}
            type="text"
            placeholder="例如：B超卵泡监测"
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>医院（选填）</Text>
          <Input
            className={styles.formInput}
            type="text"
            placeholder="请输入医院名称"
            value={hospital}
            onInput={(e) => setHospital(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>收据照片（选填）</Text>
          <View className={styles.uploadSection}>
            {receiptImage.map((img, index) => (
              <View key={index} className={styles.uploadItem}>
                <Image
                  className={styles.uploadImage}
                  src={img}
                  mode="aspectFill"
                  onClick={() => handlePreviewImage(img)}
                />
                <View className={styles.removeBtn} onClick={handleRemoveImage}>
                  ✕
                </View>
              </View>
            ))}
            {receiptImage.length === 0 && (
              <View className={styles.uploadBtn} onClick={handleChooseImage}>
                <Text className={styles.uploadIcon}>+</Text>
                <Text className={styles.uploadText}>上传收据</Text>
              </View>
            )}
          </View>
        </View>

        <Button className={styles.submitBtn} onClick={handleSubmit}>
          保存记录
        </Button>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>历史记录</Text>

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

        {filteredRecords.length > 0 ? (
          <View className={styles.historyList}>
            {filteredRecords.map((record) => (
              <View key={record.id} className={styles.historyItem}>
                <View className={styles.historyHeader}>
                  <Text className={styles.historyDate}>{record.date}</Text>
                  <View className={`${styles.typeBadge} ${record.type}`}>
                    {typeOptions.find(o => o.value === record.type)?.label}
                  </View>
                </View>
                <Text className={styles.historyDescription}>{record.description}</Text>
                <View className={styles.historyMeta}>
                  <Text className={styles.historyHospital}>{record.hospital || '-'}</Text>
                  <Text className={styles.historyAmount}>¥{record.amount.toFixed(2)}</Text>
                </View>
                {record.receiptImage && (
                  <Image
                    className={styles.historyReceipt}
                    src={record.receiptImage}
                    mode="aspectFill"
                    onClick={() => handlePreviewImage(record.receiptImage!)}
                  />
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💰</Text>
            <Text className={styles.emptyText}>暂无费用记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExpenseRecordPage;
