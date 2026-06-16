import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import type { FamilyMember, AbnormalFlag, QuestionCard, ExpenseRecord } from '@/types/ivf';
import { familyMembers as defaultMembers } from '@/data/health';
import { expenseRecords as defaultExpenses } from '@/data/medical';
import { abnormalFlags as defaultAbnormal, questionCards as defaultQuestions } from '@/data/health';
import { storage } from '@/utils/storage';
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
  { id: 'view_progress', name: '查看疗程进度', desc: '可以查看整体疗程进度和时间线', sensitive: false },
  { id: 'receive_reminder', name: '接收提醒通知', desc: '重要检查和用药提醒会同步发送', sensitive: false },
  { id: 'view_report', name: '查看检查报告', desc: '可以查看所有检查报告和单据', sensitive: true },
  { id: 'view_expense', name: '查看费用记录', desc: '可以查看所有费用花销记录', sensitive: true },
  { id: 'view_abnormal', name: '查看异常标记', desc: '可以查看异常情况和医生建议', sensitive: true },
  { id: 'view_question', name: '查看问题回复', desc: '可以查看向医生的提问和回复', sensitive: true }
];

const todayTasks = [
  { id: '1', title: '促排卵针注射', time: '08:00', status: 'pending' },
  { id: '2', title: 'B超卵泡监测', time: '10:00', status: 'completed' },
  { id: '3', title: '补充蛋白质饮食', time: '12:00', status: 'pending' }
];

const FamilySharePage: React.FC = () => {
  const today = formatDate(new Date());

  const [members, setMembers] = useState<FamilyMember[]>(defaultMembers);
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
    view_report: false,
    view_expense: false,
    view_abnormal: false,
    view_question: false
  });

  const [abnormalFlags, setAbnormalFlags] = useState<AbnormalFlag[]>(() =>
    storage.getAbnormalFlags<AbnormalFlag[]>(defaultAbnormal)
  );
  const [questions, setQuestions] = useState<QuestionCard[]>(() =>
    storage.getQuestions<QuestionCard[]>(defaultQuestions)
  );
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() =>
    storage.getExpenses<ExpenseRecord[]>(defaultExpenses)
  );

  const refreshData = useCallback(() => {
    setAbnormalFlags(storage.getAbnormalFlags<AbnormalFlag[]>(defaultAbnormal));
    setQuestions(storage.getQuestions<QuestionCard[]>(defaultQuestions));
    setExpenses(storage.getExpenses<ExpenseRecord[]>(defaultExpenses));
  }, []);

  useDidShow(() => {
    refreshData();
  });

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activities;
    return activities.filter(a => a.actionType === activeFilter);
  }, [activities, activeFilter]);

  const visibleAbnormal = useMemo(() => {
    if (permissions.view_abnormal) return abnormalFlags.slice(0, 2);
    return [];
  }, [abnormalFlags, permissions.view_abnormal]);

  const visibleQuestions = useMemo(() => {
    if (permissions.view_question) return questions.filter(q => q.answer).slice(0, 2);
    return [];
  }, [questions, permissions.view_question]);

  const expenseSummary = useMemo(() => {
    if (!permissions.view_expense) return null;
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const thisMonth = expenses.filter(e => e.date.startsWith(today.slice(0, 7))).reduce((sum, e) => sum + e.amount, 0);
    return { total, thisMonth };
  }, [expenses, permissions.view_expense, today]);

  const pendingTasks = todayTasks.filter(t => t.status === 'pending').length;

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
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.introCard}>
        <Text className={styles.introTitle}>👨‍👩‍👧 家属共享</Text>
        <Text className={styles.introDesc}>
          邀请家属一起参与疗程，让爱人实时了解您的治疗进度，一起面对，共同加油！
        </Text>
      </View>

      <View className={styles.companionSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>👀 陪诊视图</Text>
          <Text className={styles.sectionSubtitle}>家属端可看到的内容</Text>
        </View>

        <View className={styles.companionGrid}>
          <View
            className={`${styles.companionCard} ${styles.todayTaskCard}`}
            onClick={() => Taro.switchTab({ url: '/pages/calendar/index' })}
          >
            <View className={styles.cardHeader}>
              <Text className={styles.cardIcon}>📋</Text>
              <View className={styles.cardBadge}>{pendingTasks}</View>
            </View>
            <Text className={styles.cardTitle}>今日待办</Text>
            <Text className={styles.cardDesc}>
              {pendingTasks} 项待完成
            </Text>
          </View>

          <View
            className={`${styles.companionCard} ${styles.expenseCard} ${!permissions.view_expense ? styles.locked : ''}`}
            onClick={() => {
              if (permissions.view_expense) {
                Taro.navigateTo({ url: '/pages/expense-record/index' });
              }
            }}
          >
            <View className={styles.cardHeader}>
              <Text className={styles.cardIcon}>💰</Text>
            </View>
            <Text className={styles.cardTitle}>费用概览</Text>
            {permissions.view_expense && expenseSummary ? (
              <>
                <Text className={styles.cardAmount}>¥{expenseSummary.total.toFixed(0)}</Text>
                <Text className={styles.cardDesc}>本月 ¥{expenseSummary.thisMonth.toFixed(0)}</Text>
              </>
            ) : (
              <Text className={styles.cardLocked}>🔒 未授权</Text>
            )}
          </View>

          <View
            className={`${styles.companionCard} ${styles.abnormalCard} ${!permissions.view_abnormal ? styles.locked : ''}`}
            onClick={() => {
              if (permissions.view_abnormal) {
                Taro.navigateTo({ url: '/pages/abnormal-flag/index' });
              }
            }}
          >
            <View className={styles.cardHeader}>
              <Text className={styles.cardIcon}>⚠️</Text>
              {visibleAbnormal.length > 0 && (
                <View className={styles.cardWarnBadge}>{visibleAbnormal.length}</View>
              )}
            </View>
            <Text className={styles.cardTitle}>异常提醒</Text>
            {permissions.view_abnormal ? (
              <Text className={styles.cardDesc}>
                {visibleAbnormal.length > 0 ? `${visibleAbnormal.length} 条待关注` : '暂无异常'}
              </Text>
            ) : (
              <Text className={styles.cardLocked}>🔒 未授权</Text>
            )}
          </View>

          <View
            className={`${styles.companionCard} ${styles.questionCard} ${!permissions.view_question ? styles.locked : ''}`}
            onClick={() => {
              if (permissions.view_question) {
                Taro.navigateTo({ url: '/pages/question-ask/index' });
              }
            }}
          >
            <View className={styles.cardHeader}>
              <Text className={styles.cardIcon}>💬</Text>
            </View>
            <Text className={styles.cardTitle}>医生回复</Text>
            {permissions.view_question ? (
              <Text className={styles.cardDesc}>
                {visibleQuestions.length} 条新回复
              </Text>
            ) : (
              <Text className={styles.cardLocked}>🔒 未授权</Text>
            )}
          </View>
        </View>

        {visibleAbnormal.length > 0 && permissions.view_abnormal && (
          <View className={styles.recentAbnormal}>
            <Text className={styles.recentTitle}>最近异常</Text>
            {visibleAbnormal.map(flag => (
              <View key={flag.id} className={styles.abnormalMini}>
                <View className={styles.abnormalMiniHeader}>
                  <Text
                    className={`${styles.abnormalMiniType} ${styles[flag.severity]}`}
                  >
                    {flag.type}
                  </Text>
                  <Text className={styles.abnormalMiniDate}>
                    {getRelativeDate(flag.createDate)}
                  </Text>
                </View>
                <Text className={styles.abnormalMiniDesc} numberOfLines={2}>
                  {flag.description}
                </Text>
                {flag.suggestion && (
                  <View className={styles.abnormalMiniSuggestion}>
                    <Text className={styles.suggestionLabel}>医生建议：</Text>
                    <Text className={styles.suggestionText} numberOfLines={2}>
                      {flag.suggestion}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {visibleQuestions.length > 0 && permissions.view_question && (
          <View className={styles.recentQuestions}>
            <Text className={styles.recentTitle}>最近医生回复</Text>
            {visibleQuestions.map(q => (
              <View key={q.id} className={styles.questionMini}>
                <Text className={styles.questionMiniText} numberOfLines={1}>
                  Q: {q.question}
                </Text>
                <Text className={styles.answerMiniText} numberOfLines={2}>
                  A: {q.answer}
                </Text>
              </View>
            ))}
          </View>
        )}
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
        <Text className={styles.permissionTip}>
          关闭敏感内容后，家属侧将不再显示对应记录
        </Text>

        <View className={styles.permissionList}>
          {permissionOptions.map((perm) => (
            <View key={perm.id} className={styles.permissionItem}>
              <View className={styles.permissionInfo}>
                <View className={styles.permissionNameRow}>
                  <Text className={styles.permissionName}>{perm.name}</Text>
                  {perm.sensitive && (
                    <View className={styles.sensitiveTag}>敏感</View>
                  )}
                </View>
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
    </ScrollView>
  );
};

export default FamilySharePage;
