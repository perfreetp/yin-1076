import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { storage } from '@/utils/storage';
import type { DocumentRecord, QuestionCard, AbnormalFlag } from '@/types/ivf';
import styles from './index.module.scss';

type DocType = 'all' | 'bill' | 'question' | 'abnormal';
type DateFilter = 'all' | 'month' | 'week' | 'today';

interface ArchiveItem {
  id: string;
  type: 'bill' | 'question' | 'abnormal';
  title: string;
  date: string;
  imageUrl: string;
  sourceId: string;
  sourceType: string;
}

export default function DocumentArchive() {
  const [docType, setDocType] = useState<DocType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [questions, setQuestions] = useState<QuestionCard[]>([]);
  const [abnormalFlags, setAbnormalFlags] = useState<AbnormalFlag[]>([]);

  const loadData = useCallback(() => {
    setDocuments(storage.getDocuments([]));
    setQuestions(storage.getQuestions([]));
    setAbnormalFlags(storage.getAbnormalFlags([]));
    Taro.stopPullDownRefresh();
  }, []);

  useDidShow(() => {
    loadData();
  });

  usePullDownRefresh(() => {
    loadData();
  });

  const typeLabels: Record<DocType, string> = {
    all: '全部',
    bill: '单据',
    question: '提问照片',
    abnormal: '异常照片',
  };

  const dateLabels: Record<DateFilter, string> = {
    all: '全部时间',
    month: '近一个月',
    week: '近一周',
    today: '今天',
  };

  const allItems = useMemo<ArchiveItem[]>(() => {
    const items: ArchiveItem[] = [];

    documents.forEach(doc => {
      items.push({
        id: `doc-${doc.id}`,
        type: 'bill',
        title: doc.title,
        date: doc.date,
        imageUrl: doc.imageUrl,
        sourceId: doc.id,
        sourceType: 'bill',
      });
    });

    questions.forEach(q => {
      if (q.images && q.images.length > 0) {
        q.images.forEach((img, idx) => {
          items.push({
            id: `q-${q.id}-${idx}`,
            type: 'question',
            title: q.question,
            date: q.createDate,
            imageUrl: img,
            sourceId: q.id,
            sourceType: 'question',
          });
        });
      }
    });

    abnormalFlags.forEach(a => {
      if (a.images && a.images.length > 0) {
        a.images.forEach((img, idx) => {
          items.push({
            id: `a-${a.id}-${idx}`,
            type: 'abnormal',
            title: a.type,
            date: a.createDate,
            imageUrl: img,
            sourceId: a.id,
            sourceType: 'abnormal',
          });
        });
      }
    });

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return items;
  }, [documents, questions, abnormalFlags]);

  const filteredItems = useMemo(() => {
    let result = [...allItems];

    if (docType !== 'all') {
      result = result.filter(item => item.type === docType);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      result = result.filter(item => {
        const itemDate = new Date(item.date).getTime();
        switch (dateFilter) {
          case 'today':
            return itemDate >= today;
          case 'week':
            return itemDate >= today - 7 * oneDay;
          case 'month':
            return itemDate >= today - 30 * oneDay;
          default:
            return true;
        }
      });
    }

    return result;
  }, [allItems, docType, dateFilter]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, ArchiveItem[]> = {};

    filteredItems.forEach(item => {
      const dateStr = item.date.split(' ')[0];
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(item);
    });

    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredItems]);

  const stats = useMemo(() => {
    const billCount = documents.length;
    const questionCount = questions.filter(q => q.images && q.images.length > 0).length;
    const abnormalCount = abnormalFlags.filter(a => a.images && a.images.length > 0).length;
    const totalImages = allItems.length;
    return { billCount, questionCount, abnormalCount, totalImages };
  }, [documents, questions, abnormalFlags, allItems]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const formatDateWithYear = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const handlePreview = useCallback((item: ArchiveItem) => {
    const imagesOfSameType = filteredItems.filter(i => i.type === item.type).map(i => i.imageUrl);
    const currentIndex = imagesOfSameType.indexOf(item.imageUrl);

    Taro.previewImage({
      current: currentIndex >= 0 ? item.imageUrl : item.imageUrl,
      urls: imagesOfSameType.length > 0 ? imagesOfSameType : [item.imageUrl],
    });
  }, [filteredItems]);

  const typeBadgeLabels: Record<string, string> = {
    bill: '单据',
    question: '提问',
    abnormal: '异常',
  };

  return (
    <View className={styles.pageContainer}>
      <ScrollView scrollY enhanced showScrollbar={false}>
        <View className={styles.filterTabs}>
          {(Object.keys(typeLabels) as DocType[]).map(type => (
            <View
              key={type}
              className={`${styles.filterTab} ${docType === type ? styles.active : ''}`}
              onClick={() => setDocType(type)}
            >
              {typeLabels[type]}
            </View>
          ))}
        </View>

        <View className={styles.dateFilter}>
          <Text className={styles.dateLabel}>时间:</Text>
          <View className={styles.dateOptions}>
            {(Object.keys(dateLabels) as DateFilter[]).map(d => (
              <View
                key={d}
                className={`${styles.dateOption} ${dateFilter === d ? styles.active : ''}`}
                onClick={() => setDateFilter(d)}
              >
                {dateLabels[d]}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statCount}>{stats.billCount}</Text>
              <Text className={styles.statLabel}>单据</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statCount}>{stats.questionCount}</Text>
              <Text className={styles.statLabel}>提问照片</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statCount}>{stats.abnormalCount}</Text>
              <Text className={styles.statLabel}>异常照片</Text>
            </View>
          </View>
        </View>

        {groupedItems.length > 0 ? (
          groupedItems.map(([date, items]) => (
            <View key={date} className={styles.dateGroup}>
              <View className={styles.dateGroupHeader}>
                <Text className={styles.dateGroupTitle}>{formatDateWithYear(date)}</Text>
                <Text className={styles.dateGroupCount}>{items.length} 张</Text>
              </View>
              <View className={styles.docGrid}>
                {items.map(item => (
                  <View
                    key={item.id}
                    className={styles.docItem}
                    onClick={() => handlePreview(item)}
                  >
                    <View className={`${styles.docBadge} ${styles[item.type]}`}>
                      {typeBadgeLabels[item.type]}
                    </View>
                    {item.imageUrl ? (
                      <Image
                        className={styles.docImage}
                        src={item.imageUrl}
                        mode="aspectFill"
                      />
                    ) : (
                      <View className={styles.docPlaceholder}>
                        <Text className={styles.docIcon}>📄</Text>
                        <Text className={styles.docTypeLabel}>{typeBadgeLabels[item.type]}</Text>
                      </View>
                    )}
                    <Text className={styles.docTitle}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📁</Text>
            <Text className={styles.emptyText}>暂无资料</Text>
            <Text className={styles.emptyHint}>
              上传单据、提问或记录异常时{'\n'}
              相关照片会自动归档到这里
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
