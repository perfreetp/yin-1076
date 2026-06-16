import type { Medication, Examination, ExpenseRecord, MedicalDocument } from '@/types/ivf';

// 用药列表
export const medications: Medication[] = [
  {
    id: 'med-1',
    name: '果纳芬 (重组人促卵泡激素)',
    dosage: '150IU',
    frequency: '每日1次',
    startDate: '2026-05-21',
    endDate: '2026-06-18',
    type: 'injection',
    timeSlots: ['08:00'],
    instructions: '腹部皮下注射，每次注射部位轮换，注射后按压5分钟。冷藏保存，使用前30分钟取出复温。',
    sideEffects: ['注射部位红肿', '轻微腹胀', '头痛', '恶心'],
    checkInHistory: [
      { date: '2026-06-15', time: '08:05', completed: true },
      { date: '2026-06-14', time: '08:10', completed: true },
      { date: '2026-06-13', time: '07:55', completed: true },
      { date: '2026-06-12', time: '08:00', completed: true },
      { date: '2026-06-11', time: '08:15', completed: true }
    ]
  },
  {
    id: 'med-2',
    name: '补佳乐 (戊酸雌二醇)',
    dosage: '2mg',
    frequency: '每日2次',
    startDate: '2026-05-21',
    endDate: '2026-07-09',
    type: 'oral',
    timeSlots: ['12:00', '20:00'],
    instructions: '饭后服用，整片吞服，不要咀嚼。如忘记服用，下次正常剂量即可，不要加倍。',
    sideEffects: ['乳房胀痛', '轻微恶心', '情绪波动', '头晕'],
    checkInHistory: [
      { date: '2026-06-15', time: '12:05', completed: true },
      { date: '2026-06-15', time: '20:00', completed: true },
      { date: '2026-06-14', time: '12:10', completed: true },
      { date: '2026-06-14', time: '19:55', completed: true },
      { date: '2026-06-13', time: '12:00', completed: true }
    ]
  },
  {
    id: 'med-3',
    name: '善存 (复合维生素)',
    dosage: '1片',
    frequency: '每日1次',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    type: 'oral',
    timeSlots: ['09:00'],
    instructions: '早餐后服用，补充叶酸及多种维生素，预防胎儿神经管缺陷。',
    sideEffects: ['尿液发黄（正常现象）', '轻微胃部不适'],
    checkInHistory: [
      { date: '2026-06-15', time: '09:00', completed: true },
      { date: '2026-06-14', time: '09:10', completed: true },
      { date: '2026-06-13', time: '08:55', completed: true }
    ]
  }
];

// 检查项目列表
export const examinations: Examination[] = [
  {
    id: 'exam-1',
    name: 'B超卵泡监测',
    date: '2026-06-16',
    time: '14:30',
    hospital: '北京大学第三医院',
    department: '生殖医学中心',
    status: 'pending',
    requirements: ['需要憋尿', '穿宽松衣物', '提前30分钟到院'],
    note: '监测卵泡发育情况，决定是否调整用药剂量'
  },
  {
    id: 'exam-2',
    name: 'B超卵泡监测',
    date: '2026-06-17',
    time: '09:00',
    hospital: '北京大学第三医院',
    department: '生殖医学中心',
    status: 'pending',
    requirements: ['需要憋尿', '穿宽松衣物'],
    note: '连续监测卵泡发育'
  },
  {
    id: 'exam-3',
    name: '取卵手术',
    date: '2026-06-20',
    time: '08:00',
    hospital: '北京大学第三医院',
    department: '生殖医学中心',
    status: 'pending',
    requirements: ['术前12小时禁食禁水', '穿宽松衣物', '携带身份证结婚证', '家属陪同'],
    note: '阴道B超引导下穿刺取卵，手术时间约30分钟'
  },
  {
    id: 'exam-4',
    name: '性激素六项检查',
    date: '2026-06-18',
    time: '07:30',
    hospital: '北京大学第三医院',
    department: '检验科',
    status: 'pending',
    requirements: ['空腹抽血', '早上9点前抽血'],
    note: '检查促排效果，决定取卵时间'
  },
  {
    id: 'exam-5',
    name: 'B超卵泡监测',
    date: '2026-06-13',
    time: '10:00',
    hospital: '北京大学第三医院',
    department: '生殖医学中心',
    status: 'completed',
    requirements: ['需要憋尿'],
    result: '左侧卵泡6个，最大16mm；右侧卵泡5个，最大15mm',
    note: '卵泡发育正常，继续当前用药剂量'
  },
  {
    id: 'exam-6',
    name: 'B超卵泡监测',
    date: '2026-06-10',
    time: '09:30',
    hospital: '北京大学第三医院',
    department: '生殖医学中心',
    status: 'completed',
    requirements: ['需要憋尿'],
    result: '左侧卵泡5个，最大12mm；右侧卵泡4个，最大11mm',
    note: '卵泡发育良好，继续促排'
  }
];

// 费用记录
export const expenseRecords: ExpenseRecord[] = [
  {
    id: 'exp-1',
    date: '2026-06-15',
    type: 'medication',
    amount: 3280,
    description: '果纳芬 150IU * 7支',
    hospital: '北京大学第三医院',
    receiptImage: 'https://picsum.photos/id/225/750/500'
  },
  {
    id: 'exp-2',
    date: '2026-06-13',
    type: 'examination',
    amount: 580,
    description: 'B超卵泡监测 * 3次',
    hospital: '北京大学第三医院',
    receiptImage: 'https://picsum.photos/id/230/750/500'
  },
  {
    id: 'exp-3',
    date: '2026-06-01',
    type: 'examination',
    amount: 2680,
    description: '术前全套检查（血液、B超、染色体等）',
    hospital: '北京大学第三医院',
    receiptImage: 'https://picsum.photos/id/250/750/500'
  },
  {
    id: 'exp-4',
    date: '2026-05-21',
    type: 'medication',
    amount: 4560,
    description: '促排卵药物（果纳芬、补佳乐等）',
    hospital: '北京大学第三医院',
    receiptImage: 'https://picsum.photos/id/582/750/500'
  },
  {
    id: 'exp-5',
    date: '2026-05-10',
    type: 'examination',
    amount: 1280,
    description: '性激素六项 + AMH检查',
    hospital: '北京大学第三医院',
    receiptImage: 'https://picsum.photos/id/598/750/500'
  },
  {
    id: 'exp-6',
    date: '2026-05-01',
    type: 'other',
    amount: 5000,
    description: '首次就诊建档费 + 初步检查',
    hospital: '北京大学第三医院',
    receiptImage: 'https://picsum.photos/id/1080/750/500'
  }
];

// 医院单据
export const medicalDocuments: MedicalDocument[] = [
  {
    id: 'doc-1',
    uploadDate: '2026-06-13',
    type: '检查报告',
    title: 'B超监测报告',
    hospital: '北京大学第三医院',
    date: '2026-06-13',
    imageUrl: 'https://picsum.photos/id/225/750/500',
    tags: ['B超', '卵泡监测', '促排期']
  },
  {
    id: 'doc-2',
    uploadDate: '2026-06-01',
    type: '检查报告',
    title: '染色体检查报告',
    hospital: '北京大学第三医院',
    date: '2026-05-28',
    imageUrl: 'https://picsum.photos/id/312/750/500',
    note: '夫妻双方染色体均正常',
    tags: ['染色体', '术前检查']
  },
  {
    id: 'doc-3',
    uploadDate: '2026-05-20',
    type: '检查报告',
    title: '性激素六项报告',
    hospital: '北京大学第三医院',
    date: '2026-05-18',
    imageUrl: 'https://picsum.photos/id/326/750/500',
    note: 'FSH: 6.8, LH: 5.2, E2: 45, PRL: 12.5, T: 0.5, P: 0.3',
    tags: ['激素', '血液检查']
  },
  {
    id: 'doc-4',
    uploadDate: '2026-05-15',
    type: '处方单',
    title: '促排卵药物处方',
    hospital: '北京大学第三医院',
    date: '2026-05-15',
    imageUrl: 'https://picsum.photos/id/401/750/500',
    tags: ['处方', '药物']
  },
  {
    id: 'doc-5',
    uploadDate: '2026-05-10',
    type: '检查报告',
    title: '精液分析报告',
    hospital: '北京大学第三医院',
    date: '2026-05-08',
    imageUrl: 'https://picsum.photos/id/431/750/500',
    note: '精子浓度: 68百万/ml，活力: 65%，正常形态: 4%',
    tags: ['男方检查', '精液']
  },
  {
    id: 'doc-6',
    uploadDate: '2026-05-01',
    type: '病历',
    title: '初诊病历记录',
    hospital: '北京大学第三医院',
    date: '2026-05-01',
    imageUrl: 'https://picsum.photos/id/570/750/500',
    note: '诊断：原发不孕，建议IVF助孕',
    tags: ['病历', '初诊']
  }
];

// 费用统计
export const expenseSummary = {
  total: 17380,
  byType: {
    examination: 4540,
    medication: 7840,
    surgery: 0,
    injection: 0,
    other: 5000
  },
  byMonth: [
    { month: '2026-05', amount: 9780 },
    { month: '2026-06', amount: 7600 }
  ]
};
