import type { Message } from '@/types/ivf';

// 消息列表
export const messages: Message[] = [
  {
    id: 'msg-1',
    type: 'reminder',
    title: '用药提醒',
    content: '请在 20:00 服用补佳乐 2mg，饭后服用',
    date: '2026-06-16 19:30',
    read: false,
    actionUrl: '/pages/medication-detail/index?id=med-2'
  },
  {
    id: 'msg-2',
    type: 'reminder',
    title: '检查提醒',
    content: '明天 14:30 有B超卵泡监测，请提前憋尿，准时到院',
    date: '2026-06-16 18:00',
    read: false,
    actionUrl: '/pages/examination-detail/index?id=exam-1'
  },
  {
    id: 'msg-3',
    type: 'system',
    title: '系统通知',
    content: '您的取卵手术已预约成功，时间为 2026-06-20 08:00，请提前做好准备',
    date: '2026-06-15 16:00',
    read: true
  },
  {
    id: 'msg-4',
    type: 'doctor',
    title: '医生回复',
    content: '李医生回复了您的问题："取卵手术疼吗？需要麻醉吗？"',
    date: '2026-06-15 14:30',
    read: true,
    actionUrl: '/pages/question-ask/index'
  },
  {
    id: 'msg-5',
    type: 'family',
    title: '家属消息',
    content: '张先生：老婆，我明天下午请假陪你去医院做检查 ❤️',
    date: '2026-06-15 12:00',
    read: true
  },
  {
    id: 'msg-6',
    type: 'reminder',
    title: '注射提醒',
    content: '请在 08:00 注射果纳芬 150IU，注意轮换注射部位',
    date: '2026-06-16 07:30',
    read: true,
    actionUrl: '/pages/medication-detail/index?id=med-1'
  },
  {
    id: 'msg-7',
    type: 'notice',
    title: '重要公告',
    content: '端午假期门诊安排：6月22日上午正常开诊，下午停诊，请合理安排就诊时间',
    date: '2026-06-14 09:00',
    read: true
  },
  {
    id: 'msg-8',
    type: 'reminder',
    title: '禁忌提示',
    content: '促排期间请避免剧烈运动，多吃高蛋白食物，保持规律作息',
    date: '2026-06-13 08:00',
    read: true
  },
  {
    id: 'msg-9',
    type: 'system',
    title: '报告已出',
    content: '您的B超检查报告已出，请在"就诊-检查报告"中查看',
    date: '2026-06-13 11:30',
    read: true,
    actionUrl: '/pages/examination-detail/index?id=exam-5'
  },
  {
    id: 'msg-10',
    type: 'reminder',
    title: '复诊提醒',
    content: '您的下次复诊时间为 2026-06-16，请准时就诊',
    date: '2026-06-12 17:00',
    read: true
  }
];

// 消息分类统计
export const messageStats = {
  all: 10,
  unread: 2,
  reminder: 5,
  system: 2,
  doctor: 1,
  family: 1,
  notice: 1
};

// 消息类型标签
export const messageTypeLabels: Record<string, string> = {
  reminder: '提醒',
  system: '系统',
  doctor: '医生',
  family: '家属',
  notice: '公告'
};

// 消息类型颜色
export const messageTypeColors: Record<string, string> = {
  reminder: '#FAAD14',
  system: '#4A90D9',
  doctor: '#52C41A',
  family: '#FF6B9D',
  notice: '#722ED1'
};
