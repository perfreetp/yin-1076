import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Button, Textarea, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import type { QuestionCard } from '@/types/ivf';
import { questionCards as defaultQuestions } from '@/data/health';
import { storage } from '@/utils/storage';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

const categoryOptions = [
  { value: '用药相关', label: '用药相关' },
  { value: '检查相关', label: '检查相关' },
  { value: '手术相关', label: '手术相关' },
  { value: '日常注意事项', label: '日常注意' },
  { value: '饮食营养', label: '饮食营养' },
  { value: '心理情绪', label: '心理情绪' },
  { value: '其他问题', label: '其他' }
];

const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待回复' },
  { value: 'answered', label: '已回复' },
  { value: 'archived', label: '已归档' }
];

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: '待回复', class: 'pending' },
  answered: { label: '已回复', class: 'answered' },
  archived: { label: '已归档', class: 'archived' }
};

const QuestionAskPage: React.FC = () => {
  const today = formatDate(new Date());

  const [category, setCategory] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionCard[]>(() =>
    storage.getQuestions<QuestionCard[]>(defaultQuestions)
  );
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const refreshQuestions = useCallback(() => {
    setQuestions(storage.getQuestions<QuestionCard[]>(defaultQuestions));
  }, []);

  useDidShow(() => {
    refreshQuestions();
  });

  const stats = useMemo(() => {
    const pending = questions.filter(q => q.status === 'pending').length;
    const answered = questions.filter(q => q.status === 'answered').length;
    return { total: questions.length, pending, answered };
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (activeFilter === 'all') return questions;
    return questions.filter(q => q.status === activeFilter);
  }, [questions, activeFilter]);

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
    if (!category) {
      Taro.showToast({ title: '请选择问题分类', icon: 'none' });
      return;
    }
    if (!question.trim()) {
      Taro.showToast({ title: '请输入问题内容', icon: 'none' });
      return;
    }
    if (question.trim().length < 5) {
      Taro.showToast({ title: '问题描述至少5个字', icon: 'none' });
      return;
    }

    const newQuestion: QuestionCard = {
      id: `q-${Date.now()}`,
      question: question.trim(),
      createDate: today,
      status: 'pending',
      category,
      images: images.length > 0 ? [...images] : undefined
    };

    const updated = [newQuestion, ...questions];
    setQuestions(updated);
    storage.setQuestions(updated);

    Taro.showToast({ title: '提交成功，医生会尽快回复', icon: 'success' });

    setCategory('');
    setQuestion('');
    setImages([]);
  }, [category, question, today, images, questions]);

  const handlePreviewImage = useCallback((url: string, allImages: string[]) => {
    Taro.previewImage({
      urls: allImages,
      current: url
    });
  }, []);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>
          💡 提问小贴士
        </Text>
        <Text className={styles.tipsContent}>
          请尽量详细地描述您的问题，包括症状持续时间、用药情况等，以便医生给出更准确的回复。紧急情况请直接联系医院或就诊。
        </Text>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>向医生提问</Text>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>问题分类
          </Text>
          <View className={styles.categoryOptions}>
            {categoryOptions.map((option) => (
              <View
                key={option.value}
                className={`${styles.categoryOption} ${category === option.value ? styles.selected : ''}`}
                onClick={() => setCategory(option.value)}
              >
                {option.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>问题描述
          </Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请详细描述您的问题，例如：促排第5天，注射部位红肿发痒，需要处理吗？"
            value={question}
            onInput={(e) => setQuestion(e.detail.value)}
            maxlength={500}
          />
          <Text className={styles.charCount}>{question.length}/500</Text>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>相关照片（选填，最多3张）</Text>
          <View className={styles.uploadSection}>
            {images.map((img, index) => (
              <View key={index} className={styles.uploadItem}>
                <Image
                  className={styles.uploadImage}
                  src={img}
                  mode="aspectFill"
                  onClick={() => handlePreviewImage(img, images)}
                />
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

        <Button className={styles.submitBtn} onClick={handleSubmit}>
          提交问题
        </Button>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>
          历史问题（共{stats.total}条，待回复{stats.pending}条）
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

        {filteredQuestions.length > 0 ? (
          <View className={styles.questionList}>
            {filteredQuestions.map((q) => (
              <View key={q.id} className={styles.questionItem}>
                <View className={styles.questionHeader}>
                  <View className={styles.questionCategory}>{q.category}</View>
                  <View className={`${styles.questionStatus} ${styles[statusLabels[q.status].class]}`}>
                    {statusLabels[q.status].label}
                  </View>
                </View>
                <Text className={styles.questionContent}>{q.question}</Text>
                {q.images && q.images.length > 0 && (
                  <View className={styles.questionImages}>
                    {q.images.map((img, idx) => (
                      <Image
                        key={idx}
                        className={styles.questionImage}
                        src={img}
                        mode="aspectFill"
                        onClick={() => handlePreviewImage(img, q.images!)}
                      />
                    ))}
                  </View>
                )}
                <Text className={styles.questionDate}>{q.createDate}</Text>
                {q.answer && (
                  <View className={styles.answerSection}>
                    <Text className={styles.answerLabel}>
                      👨‍⚕️ 医生回复
                    </Text>
                    <Text className={styles.answerContent}>{q.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>❓</Text>
            <Text className={styles.emptyText}>暂无问题记录</Text>
            <Text className={styles.emptySubtext}>有任何疑问，随时向医生提问</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default QuestionAskPage;
