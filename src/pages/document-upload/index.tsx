import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const DocumentUploadPage: React.FC = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>📄</Text>
        <Text className={styles.placeholderTitle}>单据上传</Text>
        <Text className={styles.placeholderDesc}>
          此页面将提供医院单据拍照归档功能，包括拍照上传、单据类型选择、医院信息录入、标签管理、历史单据查看等功能。
        </Text>
        <Button className={styles.backBtn} onClick={handleBack}>
          返回上一页
        </Button>
      </View>
    </View>
  );
};

export default DocumentUploadPage;
