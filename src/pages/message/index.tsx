import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import type { MessageType, Message } from '@/types/ivf';
import { messages, messageStats, messageTypeLabels, messageTypeColors } from '@/data/message';
import { formatDate, getRelativeDate } from '@/utils/date';
import styles from './index.module.scss';

const categoryTabs = [
  { id: 'all', label: '全部', icon: '📋' },
  { id: 'reminder', label: '提醒', icon: '⏰' },
  { id: 'system', label: '系统', icon: '🔔' },
  { id: 'doctor', label: '医生', icon: '👨‍⚕️' },
  { id: 'family', label: '家属', icon: '❤️' },
  { id: 'notice', label: '公告', icon: '📢' }
];

const MessagePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [messageList, setMessageList] = useState<Message[]>(messages);
  const [refreshing, setRefreshing] = useState(false);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleMarkRead = useCallback((messageId: string) => {
    setMessageList(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setMessageList(prev => 
      prev.map(msg => ({ ...msg, read: true }))
    );
  }, []);

  const filteredMessages = useMemo(() => {
    if (activeCategory === 'all') {
      return messageList;
    }
    return messageList.filter(msg => msg.type === activeCategory);
  }, [messageList, activeCategory]);

  const unreadCountByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    messageList.forEach(msg => {
      if (!msg.read) {
        counts.all = (counts.all || 0) + 1;
        counts[msg.type] = (counts[msg.type] || 0) + 1;
      }
    });
    return counts;
  }, [messageList]);

  const statData = [
    { icon: '⏰', label: '待办提醒', value: messageStats.reminder, color: '#FAAD14' },
    { icon: '👨‍⚕️', label: '医生消息', value: messageStats.doctor, color: '#52C41A' },
    { icon: '❤️', label: '家属消息', value: messageStats.family, color: '#FF6B9D' },
    { icon: '🔔', label: '系统通知', value: messageStats.system, color: '#4A90D9' }
  ];

  const getTypeIcon = (type: MessageType): string => {
    const icons: Record<MessageType, string> = {
      reminder: '⏰',
      system: '🔔',
      doctor: '👨‍⚕️',
      family: '❤️',
      notice: '📢'
    };
    return icons[type] || '📋';
  };

  const formatMessageDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = formatDate(date) === formatDate(today);
    
    if (isToday) {
      return dateStr.slice(11, 16);
    }
    
    const diffDays = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    
    return dateStr.slice(0, 10);
  };

  return (
    <ScrollView
      scrollY
      className={styles.pageContainer}
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handleRefresh}
    >
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>消息中心</Text>
        <Text className={styles.pageSubtitle}>
          {unreadCountByCategory.all > 0 
            ? `您有 ${unreadCountByCategory.all} 条未读消息` 
            : '暂无未读消息'}
        </Text>
      </View>

      <View className={styles.statCards}>
        {statData.map((stat) => (
          <View key={stat.label} className={styles.statCard}>
            <View
              className={styles.statIcon}
              style={{ background: `${stat.color}15` }}
            >
              <Text>{stat.icon}</Text>
            </View>
            <Text className={styles.statValue}>{stat.value}</Text>
            <Text className={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.categoryTabs}>
        {categoryTabs.map((tab) => (
          <View
            key={tab.id}
            className={classnames(
              styles.categoryTab,
              activeCategory === tab.id && styles.active
            )}
            onClick={() => handleCategoryChange(tab.id)}
          >
            <Text>{tab.icon}</Text>
            <Text>{tab.label}</Text>
            {unreadCountByCategory[tab.id] > 0 && (
              <View className={styles.unreadBadge}>
                <Text>{unreadCountByCategory[tab.id]}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.toolbar}>
        <Text className={styles.sectionTitle}>消息列表</Text>
        {unreadCountByCategory.all > 0 && (
          <Text className={styles.toolbarAction} onClick={handleMarkAllRead}>
            全部已读
          </Text>
        )}
      </View>

      {filteredMessages.length > 0 ? (
        <View className={styles.messageList}>
          {filteredMessages.map((message) => (
            <View
              key={message.id}
              className={classnames(
                styles.messageItem,
                !message.read && styles.unread
              )}
            >
              {!message.read && <View className={styles.unreadDot} />}
              
              <View className={styles.messageHeader}>
                <View
                  className={styles.messageTypeTag}
                  style={{
                    background: `${messageTypeColors[message.type]}15`,
                    color: messageTypeColors[message.type]
                  }}
                >
                  <Text>{getTypeIcon(message.type)}</Text>
                  <Text style={{ marginLeft: '8rpx' }}>{messageTypeLabels[message.type]}</Text>
                </View>
                <Text className={styles.messageDate}>
                  {formatMessageDate(message.date)}
                </Text>
              </View>
              
              <Text className={styles.messageTitle}>{message.title}</Text>
              <Text className={styles.messageContent}>{message.content}</Text>
              
              <View className={styles.messageAction}>
                {message.actionUrl ? (
                  <Text className={styles.actionText}>查看详情 →</Text>
                ) : (
                  <View />
                )}
                {!message.read ? (
                  <Text
                    className={styles.markReadBtn}
                    onClick={(e) => {
                      e.stopPropagation?.();
                      handleMarkRead(message.id);
                    }}
                  >
                    标记已读
                  </Text>
                ) : (
                  <View />
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>暂无消息</Text>
          <Text className={styles.emptySubtext}>
            有新消息时会在这里显示
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MessagePage;
