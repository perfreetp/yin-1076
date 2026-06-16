import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const PregnancyTestPage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>🤰</Text>
        <Text className={styles.placeholderTitle}>验孕记录</Text>
        <Text className={styles.placeholderDesc}>
          此页面将提供验孕记录功能，包括验孕日期、结果选择、HCG值录入、照片上传、历史记录查看等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default PregnancyTestPage;
