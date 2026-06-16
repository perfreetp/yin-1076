import React, { useState, useMemo, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { FamilyMember } from '@/types/ivf';
import { familyMembers } from '@/data/health';
import { formatDate, getRelativeDate } from '@/utils/date';
import styles from './index.module.scss';

interface ActivityRecord {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  actionType: string;
  time: string;
}

const mockActivities: ActivityRecord[] = [
  {
    id: 'act-1',
    memberId: 'fm-1',
    memberName: '张先生',
    action: '查看了今日日程',
    actionType: '查看',
    time: '2026-06-15 14:30'
  },
  {
    id: 'act-2',
    memberId: 'fm-1',
    memberName: '张先生',
    action: '收到了用药提醒',
    actionType: '提醒',
    time: '2026-06-15 08:00'
  },
  {
    id: 'act-3',
    memberId: 'fm-1',
    memberName: '张先生',
    action: '查看了B超检查报告',
    actionType: '查看',
    time: '2026-06-13 16:20'
  },
  {
    id: 'act-4',
    memberId: 'fm-1',
    memberName: '张先生',
    action: '加入了疗程共享',
    actionType: '系统',
    time: '2026-05-01 10:00'
  }
];

const filterOptions = [
  { value: 'all', label: '全部' },
  { value: '查看', label: '查看' },
  { value: '提醒', label: '提醒' },
  { value: '系统', label: '系统' }
];

const permissionOptions = [
  { id: 'view_progress', name: '查看疗程进度', desc: '可以查看整体疗程进度和时间线' },
  { id: 'receive_reminder', name: '接收提醒通知', desc: '重要检查和用药提醒会同步发送' },
  { id: 'view_report', name: '查看检查报告', desc: '可以查看所有检查报告和单据' },
  { id: 'view_expense', name: '查看费用记录', desc: '可以查看所有费用花销记录' }
];

const FamilySharePage: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>(familyMembers);
  const [activities, setActivities] = useState<ActivityRecord[]>(mockActivities);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [shareCode] = useState(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    view_progress: true,
    receive_reminder: true,
    view_report: true,
    view_expense: false
  });

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activities;
    return activities.filter(a => a.actionType === activeFilter);
  }, [activities, activeFilter]);

  const handleAddMember = useCallback(() => {
    Taro.showActionSheet({
      itemList: ['通过共享码邀请', '通过微信分享'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showModal({
            title: '共享码',
            content: `请让家属在App中输入共享码：${shareCode}`,
            showCancel: false
          });
        } else {
          Taro.showToast({ title: '已复制分享链接', icon: 'success' });
        }
      }
    });
  }, [shareCode]);

  const handleCopyCode = useCallback(() => {
    Taro.setClipboardData({
      data: shareCode,
      success: () => {
        Taro.showToast({ title: '共享码已复制', icon: 'success' });
      }
    });
  }, [shareCode]);

  const handleShareCode = useCallback(() => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' });
  }, []);

  const handleEditMember = useCallback((member: FamilyMember) => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
  }, []);

  const handleRemoveMember = useCallback((member: FamilyMember) => {
    Taro.showModal({
      title: '确认移除',
      content: `确定要移除${member.name}吗？移除后将无法再查看您的疗程信息。`,
      success: (res) => {
        if (res.confirm) {
          setMembers(prev => prev.filter(m => m.id !== member.id));
          Taro.showToast({ title: '已移除', icon: 'success' });
        }
      }
    });
  }, []);

  const togglePermission = useCallback((permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
    Taro.showToast({ title: '权限已更新', icon: 'success' });
  }, []);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.introCard}>
        <Text className={styles.introTitle}>👨‍👩‍👧 家属共享</Text>
        <Text className={styles.introDesc}>
          邀请家属一起参与疗程，让爱人实时了解您的治疗进度，一起面对，共同加油！
        </Text>
      </View>

      <View className={styles.membersSection}>
        <View className={styles.sectionTitle}>
          <Text>家属成员</Text>
          <View className={styles.addMemberBtn} onClick={handleAddMember}>
            <Text>+ 添加</Text>
          </View>
        </View>

        {members.length > 0 ? (
          <View className={styles.membersList}>
            {members.map((member) => (
              <View key={member.id} className={styles.memberItem}>
                <View className={styles.memberAvatar}>
                  {member.relation === '丈夫' ? '👨' : '👩'}
                </View>
                <View className={styles.memberInfo}>
                  <View className={styles.memberName}>
                    <Text>{member.name}</Text>
                    <View className={styles.memberRelation}>{member.relation}</View>
                  </View>
                  <Text className={styles.memberJoinDate}>
                    加入于 {member.joinDate}
                  </Text>
                  <View className={styles.memberPermissions}>
                    {member.permissions.slice(0, 3).map((p, i) => (
                      <View key={i} className={styles.permissionTag}>{p}</View>
                    ))}
                    {member.permissions.length > 3 && (
                      <View className={styles.permissionTag}>+{member.permissions.length - 3}</View>
                    )}
                  </View>
                </View>
                <View className={styles.memberActions}>
                  <View className={`${styles.actionBtn} ${styles.edit}`} onClick={() => handleEditMember(member)}>
                    编辑
                  </View>
                  <View className={`${styles.actionBtn} ${styles.remove}`} onClick={() => handleRemoveMember(member)}>
                    移除
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>👨‍👩‍👧</Text>
            <Text className={styles.emptyText}>暂无家属成员</Text>
            <Text className={styles.emptySubtext}>点击上方"添加"邀请家属加入</Text>
          </View>
        )}
      </View>

      <View className={styles.inviteSection}>
        <Text className={styles.sectionTitle}>邀请家属</Text>

        <View className={styles.shareCodeCard}>
          <Text className={styles.codeLabel}>您的专属共享码</Text>
          <Text className={styles.codeValue}>{shareCode}</Text>
          <Text className={styles.codeExpire}>24小时内有效</Text>
        </View>

        <View className={styles.inviteActions}>
          <View className={`${styles.inviteBtn} ${styles.secondary}`} onClick={handleCopyCode}>
            复制共享码
          </View>
          <View className={`${styles.inviteBtn} ${styles.primary}`} onClick={handleShareCode}>
            微信分享
          </View>
        </View>
      </View>

      <View className={styles.permissionSection}>
        <Text className={styles.sectionTitle}>共享权限设置</Text>

        <View className={styles.permissionList}>
          {permissionOptions.map((perm) => (
            <View key={perm.id} className={styles.permissionItem}>
              <View className={styles.permissionInfo}>
                <Text className={styles.permissionName}>{perm.name}</Text>
                <Text className={styles.permissionDesc}>{perm.desc}</Text>
              </View>
              <View
                className={`${styles.permissionSwitch} ${permissions[perm.id] ? styles.active : ''}`}
                onClick={() => togglePermission(perm.id)}
              />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.activitySection}>
        <Text className={styles.sectionTitle}>家属动态</Text>

        <View className={styles.filterTabs}>
          {filterOptions.map((option) => (
            <View
              key={option.value}
              className={`${styles.filterTab} ${activeFilter === option.value ? styles.active : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </View>
          ))}
        </View>

        {filteredActivities.length > 0 ? (
          <View className={styles.activityList}>
            {filteredActivities.map((activity) => (
              <View key={activity.id} className={styles.activityItem}>
                <View className={styles.activityAvatar}>
                  {activity.memberName.includes('先生') ? '👨' : '👩'}
                </View>
                <View className={styles.activityContent}>
                  <Text className={styles.activityText}>
                    <Text className={styles.memberName}>{activity.memberName}</Text>
                    <Text className={styles.actionType}> {activity.action}</Text>
                  </Text>
                  <Text className={styles.activityTime}>{getRelativeDate(activity.time)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无动态记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FamilySharePage;
