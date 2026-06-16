import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const AbnormalFlagPage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>⚠️</Text>
        <Text className={styles.placeholderTitle}>异常标记</Text>
        <Text className={styles.placeholderDesc}>
          此页面将提供异常情况一键标记功能，包括异常类型选择、严重程度评估、症状描述、自动通知医生、处理建议查看、异常历史记录等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default AbnormalFlagPage;
