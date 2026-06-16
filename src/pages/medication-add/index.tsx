import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import type { Medication } from '@/types/ivf';
import { medications } from '@/data/medical';
import { storage } from '@/utils/storage';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

const typeOptions = [
  { value: 'oral', label: '口服药', icon: '💊' },
  { value: 'injection', label: '注射剂', icon: '💉' },
  { value: 'external', label: '外用药', icon: '🧴' }
];

const frequencyOptions = [
  '每日1次',
  '每日2次',
  '每日3次',
  '隔日1次',
  '每周1次',
  '按需服用'
];

const MedicationAddPage: React.FC = () => {
  const router = useRouter();
  const editId = router.params.id;
  const today = formatDate(new Date());

  const isEdit = !!editId;

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [type, setType] = useState<'oral' | 'injection' | 'external'>('oral');
  const [frequency, setFrequency] = useState('每日1次');
  const [timeSlots, setTimeSlots] = useState<string[]>(['08:00']);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [sideEffectInput, setSideEffectInput] = useState('');
  const [sideEffects, setSideEffects] = useState<string[]>([]);

  useEffect(() => {
    if (editId) {
      const storedMeds = storage.getMedications<Medication[]>(medications);
      const med = storedMeds.find(m => m.id === editId);
      if (med) {
        setName(med.name);
        setDosage(med.dosage);
        setType(med.type);
        setFrequency(med.frequency);
        setTimeSlots(med.timeSlots);
        setStartDate(med.startDate);
        setEndDate(med.endDate);
        setInstructions(med.instructions);
        setSideEffects(med.sideEffects || []);
      }
    }
  }, [editId]);

  const handleAddTimeSlot = useCallback(() => {
    setTimeSlots(prev => [...prev, '']);
  }, []);

  const handleRemoveTimeSlot = useCallback((index: number) => {
    if (timeSlots.length <= 1) return;
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  }, [timeSlots.length]);

  const handleTimeSlotChange = useCallback((index: number, value: string) => {
    setTimeSlots(prev => prev.map((t, i) => i === index ? value : t));
  }, []);

  const handleAddSideEffect = useCallback(() => {
    if (!sideEffectInput.trim()) return;
    if (sideEffects.includes(sideEffectInput.trim())) {
      Taro.showToast({ title: '已添加该副作用', icon: 'none' });
      return;
    }
    setSideEffects(prev => [...prev, sideEffectInput.trim()]);
    setSideEffectInput('');
  }, [sideEffectInput, sideEffects]);

  const handleRemoveSideEffect = useCallback((effect: string) => {
    setSideEffects(prev => prev.filter(e => e !== effect));
  }, []);

  const handleStartDateChange = useCallback((e: any) => {
    setStartDate(e.detail.value);
  }, []);

  const handleEndDateChange = useCallback((e: any) => {
    setEndDate(e.detail.value);
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入药品名称', icon: 'none' });
      return;
    }
    if (!dosage.trim()) {
      Taro.showToast({ title: '请输入药品剂量', icon: 'none' });
      return;
    }
    if (!frequency) {
      Taro.showToast({ title: '请选择服用频率', icon: 'none' });
      return;
    }

    const validTimeSlots = timeSlots.filter(t => t.trim());
    if (validTimeSlots.length === 0) {
      Taro.showToast({ title: '请至少设置一个用药时间', icon: 'none' });
      return;
    }

    if (!startDate) {
      Taro.showToast({ title: '请选择开始日期', icon: 'none' });
      return;
    }

    const storedMeds = storage.getMedications<Medication[]>(medications);

    if (isEdit && editId) {
      const updatedMeds = storedMeds.map(med => {
        if (med.id === editId) {
          return {
            ...med,
            name: name.trim(),
            dosage: dosage.trim(),
            type,
            frequency,
            timeSlots: validTimeSlots,
            startDate,
            endDate: endDate || startDate,
            instructions: instructions.trim(),
            sideEffects: sideEffects.length > 0 ? sideEffects : undefined
          };
        }
        return med;
      });
      storage.setMedications(updatedMeds);
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      const newMed: Medication = {
        id: `med-${Date.now()}`,
        name: name.trim(),
        dosage: dosage.trim(),
        type,
        frequency,
        timeSlots: validTimeSlots,
        startDate,
        endDate: endDate || startDate,
        instructions: instructions.trim() || '请遵医嘱按时用药',
        sideEffects: sideEffects.length > 0 ? sideEffects : undefined,
        checkInHistory: []
      };
      storage.setMedications([newMed, ...storedMeds]);
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }

    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  }, [
    name, dosage, type, frequency, timeSlots,
    startDate, endDate, instructions, sideEffects,
    isEdit, editId
  ]);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          {isEdit ? '编辑用药' : '添加用药'}
        </Text>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>药品名称
          </Text>
          <Input
            className={styles.formInput}
            placeholder="例如：补佳乐、果纳芬"
            value={name}
            onInput={(e) => setName(e.detail.value)}
            maxlength={50}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>药品剂量
          </Text>
          <Input
            className={styles.formInput}
            placeholder="例如：2mg、150IU"
            value={dosage}
            onInput={(e) => setDosage(e.detail.value)}
            maxlength={30}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>药品类型
          </Text>
          <View className={styles.typeOptions}>
            {typeOptions.map((option) => (
              <View
                key={option.value}
                className={`${styles.typeOption} ${type === option.value ? styles.selected : ''}`}
                onClick={() => setType(option.value as any)}
              >
                <Text className={styles.typeIcon}>{option.icon}</Text>
                <Text className={styles.typeLabel}>{option.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>服用频率
          </Text>
          <View className={styles.frequencyOptions}>
            {frequencyOptions.map((freq) => (
              <View
                key={freq}
                className={`${styles.frequencyOption} ${frequency === freq ? styles.selected : ''}`}
                onClick={() => setFrequency(freq)}
              >
                {freq}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>用药时间
          </Text>
          <View className={styles.timeSlotsSection}>
            <View className={styles.timeSlotsList}>
              {timeSlots.map((time, index) => (
                <View key={index} className={styles.timeSlotItem}>
                  <Input
                    className={styles.timeInput}
                    type="text"
                    placeholder="例如：08:00"
                    value={time}
                    onInput={(e) => handleTimeSlotChange(index, e.detail.value)}
                    maxlength={5}
                  />
                  <View
                    className={styles.removeTimeBtn}
                    onClick={() => handleRemoveTimeSlot(index)}
                  >
                    ✕
                  </View>
                </View>
              ))}
            </View>
            <View className={styles.addTimeBtn} onClick={handleAddTimeSlot}>
              + 添加用药时间
            </View>
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>用药周期
          </Text>
          <View className={styles.dateRow}>
            <View className={styles.dateItem}>
              <Text className={styles.formLabel} style={{ fontSize: '24rpx' }}>开始日期</Text>
              <picker mode="date" value={startDate} onChange={handleStartDateChange}>
                <View className={styles.datePicker}>
                  {startDate ? (
                    <Text className={styles.dateValue}>{startDate}</Text>
                  ) : (
                    <Text className={styles.datePlaceholder}>请选择</Text>
                  )}
                </View>
              </picker>
            </View>
            <View className={styles.dateItem}>
              <Text className={styles.formLabel} style={{ fontSize: '24rpx' }}>结束日期</Text>
              <picker mode="date" value={endDate} onChange={handleEndDateChange}>
                <View className={styles.datePicker}>
                  {endDate ? (
                    <Text className={styles.dateValue}>{endDate}</Text>
                  ) : (
                    <Text className={styles.datePlaceholder}>请选择</Text>
                  )}
                </View>
              </picker>
            </View>
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>用药说明（选填）</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请填写用药注意事项、服用方法等说明"
            value={instructions}
            onInput={(e) => setInstructions(e.detail.value)}
            maxlength={200}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>可能的副作用（选填）</Text>
          <View className={styles.sideEffectsSection}>
            <View className={styles.sideEffectInput}>
              <Input
                className={styles.sideEffectField}
                placeholder="输入副作用名称"
                value={sideEffectInput}
                onInput={(e) => setSideEffectInput(e.detail.value)}
                onConfirm={handleAddSideEffect}
                maxlength={20}
              />
              <View className={styles.addSideEffectBtn} onClick={handleAddSideEffect}>
                +
              </View>
            </View>
            {sideEffects.length > 0 && (
              <View className={styles.sideEffectTags}>
                {sideEffects.map((effect, index) => (
                  <View key={index} className={styles.sideEffectTag}>
                    <Text>{effect}</Text>
                    <Text className={styles.removeTag} onClick={() => handleRemoveSideEffect(effect)}>✕</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View className={styles.submitBtn} onClick={handleSave}>
          {isEdit ? '保存修改' : '保存用药'}
        </View>
      </View>

      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>💡 温馨提示</Text>
        <Text className={styles.tipsContent}>
          请严格按照医嘱用药，不要自行增减剂量。如出现严重副作用或不适，请及时联系医生或前往医院就诊。
        </Text>
      </View>
    </View>
  );
};

export default MedicationAddPage;
