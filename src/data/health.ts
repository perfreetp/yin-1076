import type { SymptomRecord, MoodRecord, PregnancyTest, BodyMetrics, AbnormalFlag, FamilyMember, QuestionCard } from '@/types/ivf';

// 症状记录
export const symptomRecords: SymptomRecord[] = [
  {
    id: 'sym-1',
    date: '2026-06-15',
    symptoms: ['轻微腹胀', '注射部位红肿'],
    severity: 'mild',
    note: '注射部位有点痒，应该是正常反应',
    abnormalFlag: false
  },
  {
    id: 'sym-2',
    date: '2026-06-14',
    symptoms: ['头痛', '乏力'],
    severity: 'mild',
    note: '可能是睡眠不好，早点休息',
    abnormalFlag: false
  },
  {
    id: 'sym-3',
    date: '2026-06-13',
    symptoms: ['乳房胀痛', '情绪波动'],
    severity: 'mild',
    note: '药物副作用，正常现象',
    abnormalFlag: false
  },
  {
    id: 'sym-4',
    date: '2026-06-12',
    symptoms: ['恶心', '食欲不振'],
    severity: 'mild',
    note: '吃了点清淡的粥，好多了',
    abnormalFlag: false
  },
  {
    id: 'sym-5',
    date: '2026-06-10',
    symptoms: ['轻微腹胀'],
    severity: 'mild',
    note: '',
    abnormalFlag: false
  }
];

// 情绪记录
export const moodRecords: MoodRecord[] = [
  {
    id: 'mood-1',
    date: '2026-06-15',
    time: '20:00',
    mood: 'calm',
    note: '今天检查结果不错，卵泡发育正常，心情平稳'
  },
  {
    id: 'mood-2',
    date: '2026-06-14',
    time: '21:30',
    mood: 'anxious',
    note: '有点担心卵泡长得不够快，老公一直安慰我'
  },
  {
    id: 'mood-3',
    date: '2026-06-13',
    time: '19:00',
    mood: 'happy',
    note: '今天B超看到卵泡长大了，很开心！'
  },
  {
    id: 'mood-4',
    date: '2026-06-12',
    time: '22:00',
    mood: 'tired',
    note: '跑了一天医院，好累'
  },
  {
    id: 'mood-5',
    date: '2026-06-11',
    time: '20:30',
    mood: 'calm',
    note: '按部就班打针吃药，习惯了'
  },
  {
    id: 'mood-6',
    date: '2026-06-10',
    time: '21:00',
    mood: 'anxious',
    note: '刚开始促排，有点紧张'
  }
];

// 验孕记录
export const pregnancyTests: PregnancyTest[] = [
  {
    id: 'pt-1',
    date: '2026-05-01',
    result: 'negative',
    daysAfterTransfer: 0,
    note: '治疗前测试，确认未孕'
  }
];

// 身体指标
export const bodyMetrics: BodyMetrics[] = [
  { date: '2026-06-15', temperature: 36.5, weight: 52.5 },
  { date: '2026-06-14', temperature: 36.4, weight: 52.3 },
  { date: '2026-06-13', temperature: 36.6, weight: 52.4 },
  { date: '2026-06-12', temperature: 36.3, weight: 52.2 },
  { date: '2026-06-11', temperature: 36.5, weight: 52.1 },
  { date: '2026-06-10', temperature: 36.4, weight: 52.0 },
  { date: '2026-06-09', temperature: 36.2, weight: 51.9 },
  { date: '2026-06-08', temperature: 36.3, weight: 51.8 }
];

// 异常标记
export const abnormalFlags: AbnormalFlag[] = [
  {
    id: 'abn-1',
    createDate: '2026-06-12',
    type: '剧烈腹痛',
    description: '右侧小腹持续性疼痛，持续约30分钟',
    severity: 'moderate',
    notified: true,
    status: 'resolved',
    suggestion: '医生建议观察，如疼痛加剧或伴有发热需立即就诊。目前已缓解，考虑为卵巢增大引起的牵拉痛。'
  }
];

// 家属成员
export const familyMembers: FamilyMember[] = [
  {
    id: 'fm-1',
    name: '张先生',
    relation: '丈夫',
    permissions: ['查看疗程进度', '接收提醒', '查看检查报告', '查看费用记录'],
    joinDate: '2026-05-01'
  }
];

// 问题卡片
export const questionCards: QuestionCard[] = [
  {
    id: 'q-1',
    question: '促排期间可以同房吗？',
    answer: '促排早期可以同房，但当卵泡发育较大（直径>14mm）后，建议避免同房，以免卵巢扭转或提前排卵。具体请遵医嘱。',
    createDate: '2026-06-10',
    status: 'answered',
    category: '日常注意事项'
  },
  {
    id: 'q-2',
    question: '果纳芬注射部位红肿正常吗？',
    answer: '注射部位轻微红肿、瘙痒是常见的局部反应，一般无需特殊处理。可以轮换注射部位，注射后按压5分钟。如红肿范围扩大或出现发热，请及时就诊。',
    createDate: '2026-06-12',
    status: 'answered',
    category: '用药相关'
  },
  {
    id: 'q-3',
    question: '促排期间饮食上有什么需要注意的？',
    answer: '建议多吃高蛋白食物（鸡蛋、牛奶、鱼虾、豆制品等），多喝水，保持大便通畅。避免辛辣刺激、生冷食物，戒烟戒酒。可适量补充蛋白粉预防OHSS。',
    createDate: '2026-06-08',
    status: 'answered',
    category: '日常注意事项'
  },
  {
    id: 'q-4',
    question: '取卵手术疼吗？需要麻醉吗？',
    answer: '取卵手术一般采用静脉麻醉，手术过程中不会感到疼痛。术后可能会有轻微腹痛、腰酸，类似痛经的感觉，一般2-3天会缓解。手术时间约20-30分钟。',
    createDate: '2026-06-15',
    status: 'pending',
    category: '手术相关'
  },
  {
    id: 'q-5',
    question: '移植后需要卧床休息多久？',
    answer: '移植后一般建议卧床休息2小时，之后可以正常活动，但避免剧烈运动和重体力劳动。不需要长期卧床，长期卧床反而可能增加血栓风险。',
    createDate: '2026-06-14',
    status: 'pending',
    category: '手术相关'
  }
];

// 常见症状列表
export const commonSymptoms = [
  '腹胀', '腹痛', '乳房胀痛', '头痛', '恶心', '呕吐',
  '乏力', '头晕', '情绪波动', '失眠', '注射部位红肿',
  '阴道出血', '白带增多', '体温升高', '体重增加'
];

// 情绪选项
export const moodOptions = [
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'sad', label: '低落', emoji: '😢' },
  { value: 'angry', label: '烦躁', emoji: '😤' },
  { value: 'tired', label: '疲惫', emoji: '😴' }
];

// 异常情况类型
export const abnormalTypes = [
  '剧烈腹痛', '大量出血', '高热不退', '严重恶心呕吐',
  '呼吸困难', '尿量减少', '体重快速增加', '其他异常'
];
