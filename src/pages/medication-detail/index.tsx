import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const MedicationDetailPage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>💊</Text>
        <Text className={styles.placeholderTitle}>用药详情</Text>
        <Text className={styles.placeholderDesc}>
          此页面将展示详细的用药信息，包括用药说明、注射指导、用药历史记录等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default MedicationDetailPage;
