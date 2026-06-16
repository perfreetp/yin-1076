import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const SymptomRecordPage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>🤒</Text>
        <Text className={styles.placeholderTitle}>症状记录</Text>
        <Text className={styles.placeholderDesc}>
          此页面将提供症状记录功能，包括症状选择、严重程度评估、备注说明、异常标记等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default SymptomRecordPage;
