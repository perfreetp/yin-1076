import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const ExpenseRecordPage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>💰</Text>
        <Text className={styles.placeholderTitle}>费用记录</Text>
        <Text className={styles.placeholderDesc}>
          此页面将提供费用记录功能，包括费用类型选择、金额录入、单据照片上传、费用统计图表、历史记录查看等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default ExpenseRecordPage;
