import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { medicalDocuments } from '@/data/medical';
import { formatDate, getRelativeDate } from '@/utils/date';
import styles from './index.module.scss';

const DocumentDetailPage: React.FC = () => {
  const router = useRouter();
  const docId = router.params.id;

  const document = useMemo(() => {
    return medicalDocuments.find(doc => doc.id === docId) || medicalDocuments[0];
  }, [docId]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handlePreviewImage = () => {
    Taro.previewImage({
      urls: [document.imageUrl],
      current: document.imageUrl
    });
  };

  const handleSaveImage = () => {
    Taro.showToast({ title: '已保存到相册', icon: 'success' });
  };

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' });
  };

  const handleEdit = () => {
    Taro.navigateTo({ url: `/pages/document-upload/index?id=${document.id}&mode=edit` });
  };

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这张单据吗？删除后无法恢复。',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '删除成功', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1000);
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.documentHeader}>
        <View className={styles.documentType}>{document.type}</View>
        <Text className={styles.documentTitle}>{document.title}</Text>
        <View className={styles.documentMeta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>🏥</Text>
            <Text>{document.hospital}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>📅</Text>
            <Text>{getRelativeDate(document.date)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.imageSection}>
        <Image
          className={styles.documentImage}
          src={document.imageUrl}
          mode="widthFix"
          onClick={handlePreviewImage}
        />
        <View className={styles.imageActions}>
          <Button className={styles.actionBtn} onClick={handlePreviewImage}>
            🔍 查看大图
          </Button>
          <Button className={styles.actionBtn} onClick={handleSaveImage}>
            💾 保存图片
          </Button>
          <Button className={styles.actionBtn} onClick={handleShare}>
            📤 分享
          </Button>
        </View>
      </View>

      <View className={styles.infoSection}>
        <Text className={styles.sectionTitle}>单据信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>单据类型</Text>
          <Text className={styles.infoValue}>{document.type}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>单据名称</Text>
          <Text className={styles.infoValue}>{document.title}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>就诊医院</Text>
          <Text className={styles.infoValue}>{document.hospital}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>单据日期</Text>
          <Text className={styles.infoValue}>{document.date}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>上传时间</Text>
          <Text className={styles.infoValue}>{document.uploadDate}</Text>
        </View>
      </View>

      {document.note && (
        <View className={styles.noteSection}>
          <Text className={styles.noteLabel}>💡 备注信息</Text>
          <Text className={styles.noteContent}>{document.note}</Text>
        </View>
      )}

      {document.tags && document.tags.length > 0 && (
        <View className={styles.tagsSection}>
          <Text className={styles.sectionTitle}>标签</Text>
          <View className={styles.tagsList}>
            {document.tags.map((tag, index) => (
              <View key={index} className={styles.tagItem}>
                <Text>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.footerActions}>
        <Button className={styles.secondaryBtn} onClick={handleEdit}>
          编辑
        </Button>
        <Button className={styles.primaryBtn} onClick={handleDelete}>
          删除
        </Button>
      </View>
    </View>
  );
};

export default DocumentDetailPage;
