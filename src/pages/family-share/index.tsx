import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const FamilySharePage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>👨‍👩‍👧</Text>
        <Text className={styles.placeholderTitle}>家属共享</Text>
        <Text className={styles.placeholderDesc}>
          此页面将提供家属共享功能，包括家属成员管理、权限设置、共享邀请、查看家属动态、消息互动等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default FamilySharePage;
