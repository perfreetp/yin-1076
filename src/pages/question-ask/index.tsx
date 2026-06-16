import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const QuestionAskPage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>❓</Text>
        <Text className={styles.placeholderTitle}>问题提问</Text>
        <Text className={styles.placeholderDesc}>
          此页面将提供问题提问功能，包括问题分类选择、问题内容输入、问题卡片生成、医生回复查看、历史问题管理等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default QuestionAskPage;
