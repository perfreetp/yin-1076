import type { TreatmentOverview, PhaseInfo, TimelineNode, TaskItem } from '@/types/ivf';
import { formatDate } from '@/utils/date';

// 疗程总览数据
export const treatmentOverview: TreatmentOverview = {
  currentPhase: 'stimulation',
  phaseName: '促排卵阶段',
  startDate: '2026-05-01',
  daysInTreatment: 46,
  totalProgress: 45,
  nextKeyDate: '2026-06-20',
  nextKeyEvent: '取卵手术',
  pendingTasks: 3,
  completedTasks: 12,
};

// 疗程阶段信息
export const phaseList: PhaseInfo[] = [
  {
    id: 'phase-1',
    phase: 'initial',
    name: '初诊阶段',
    description: '初次就诊，建立病历档案，医生评估身体状况，制定治疗方案',
    startDate: '2026-05-01',
    endDate: '2026-05-07',
    status: 'completed',
    progress: 100,
    color: '#FF9EC2',
    tips: [
      '携带过往检查报告',
      '夫妻双方同往',
      '空腹就诊',
      '准备好身份证、结婚证'
    ]
  },
  {
    id: 'phase-2',
    phase: 'examination',
    name: '检查阶段',
    description: '完善各项术前检查，包括血液、B超、染色体等检查项目',
    startDate: '2026-05-08',
    endDate: '2026-05-20',
    status: 'completed',
    progress: 100,
    color: '#4A90D9',
    tips: [
      '部分检查需空腹',
      '请避开月经期',
      '检查前3天避免同房',
      '保持规律作息'
    ]
  },
  {
    id: 'phase-3',
    phase: 'stimulation',
    name: '促排卵阶段',
    description: '使用促排卵药物，定期监测卵泡发育情况',
    startDate: '2026-05-21',
    endDate: '2026-06-19',
    status: 'current',
    progress: 65,
    color: '#FAAD14',
    tips: [
      '每天固定时间用药',
      '记得注射部位轮换',
      '避免剧烈运动',
      '多吃高蛋白食物'
    ]
  },
  {
    id: 'phase-4',
    phase: 'retrieval',
    name: '取卵阶段',
    description: '卵泡成熟后进行取卵手术，同时男方取精',
    startDate: '2026-06-20',
    endDate: '2026-06-22',
    status: 'upcoming',
    progress: 0,
    color: '#FF6B9D',
    tips: [
      '手术前一晚12点后禁食禁水',
      '手术当天穿宽松衣物',
      '术后需留院观察2小时',
      '术后避免剧烈运动'
    ]
  },
  {
    id: 'phase-5',
    phase: 'transfer',
    name: '移植阶段',
    description: '胚胎培养完成后，选择优质胚胎移植到子宫内',
    startDate: '2026-06-25',
    endDate: '2026-06-27',
    status: 'upcoming',
    progress: 0,
    color: '#52C41A',
    tips: [
      '移植前需要憋尿',
      '移植后卧床休息2小时',
      '避免剧烈运动和重体力劳动',
      '保持轻松愉快的心情'
    ]
  },
  {
    id: 'phase-6',
    phase: 'pregnancy',
    name: '验孕阶段',
    description: '移植后14天进行验孕检查，确认是否成功怀孕',
    startDate: '2026-07-09',
    endDate: '2026-07-15',
    status: 'upcoming',
    progress: 0,
    color: '#722ED1',
    tips: [
      '保持规律作息',
      '按医嘱继续用药',
      '不要过早测试',
      '保持平和心态'
    ]
  }
];

// 疗程时间线
export const timelineNodes: TimelineNode[] = [
  {
    id: 'node-1',
    date: '2026-05-01',
    title: '初次就诊',
    description: '夫妻双方初次到院，建立病历，医生评估身体状况',
    phase: 'initial',
    status: 'completed',
    isKeyNode: true
  },
  {
    id: 'node-2',
    date: '2026-05-10',
    title: '性激素六项检查',
    description: '月经第2-3天抽血检查基础内分泌',
    phase: 'examination',
    status: 'completed',
    isKeyNode: false
  },
  {
    id: 'node-3',
    date: '2026-05-15',
    title: 'B超监测排卵',
    description: '阴道B超检查卵巢基础卵泡情况',
    phase: 'examination',
    status: 'completed',
    isKeyNode: false
  },
  {
    id: 'node-4',
    date: '2026-05-20',
    title: '检查报告解读',
    description: '医生解读所有检查报告，确定治疗方案',
    phase: 'examination',
    status: 'completed',
    isKeyNode: true
  },
  {
    id: 'node-5',
    date: '2026-05-21',
    title: '开始促排卵',
    description: '开始注射促排卵药物，启动促排周期',
    phase: 'stimulation',
    status: 'completed',
    isKeyNode: true
  },
  {
    id: 'node-6',
    date: '2026-06-10',
    title: '卵泡监测',
    description: 'B超监测卵泡发育情况，调整用药剂量',
    phase: 'stimulation',
    status: 'current',
    isKeyNode: false
  },
  {
    id: 'node-7',
    date: '2026-06-18',
    title: '打夜针',
    description: '卵泡成熟，注射HCG促使卵子最终成熟',
    phase: 'stimulation',
    status: 'upcoming',
    isKeyNode: true
  },
  {
    id: 'node-8',
    date: '2026-06-20',
    title: '取卵手术',
    description: '阴道B超引导下穿刺取卵',
    phase: 'retrieval',
    status: 'upcoming',
    isKeyNode: true
  },
  {
    id: 'node-9',
    date: '2026-06-25',
    title: '胚胎移植',
    description: '将培养好的胚胎移植入子宫',
    phase: 'transfer',
    status: 'upcoming',
    isKeyNode: true
  },
  {
    id: 'node-10',
    date: '2026-07-09',
    title: '抽血验孕',
    description: '移植后14天抽血检查HCG确认怀孕',
    phase: 'pregnancy',
    status: 'upcoming',
    isKeyNode: true
  }
];

// 今日待办任务
export const todayTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: '注射果纳芬 150IU',
    type: 'injection',
    date: formatDate(new Date()),
    time: '08:00',
    status: 'pending',
    description: '腹部皮下注射，注射后按压5分钟',
    reminder: true,
    phase: 'stimulation'
  },
  {
    id: 'task-2',
    title: '口服补佳乐 2mg',
    type: 'medication',
    date: formatDate(new Date()),
    time: '12:00',
    status: 'pending',
    description: '饭后服用，每日2次',
    reminder: true,
    phase: 'stimulation'
  },
  {
    id: 'task-3',
    title: 'B超卵泡监测',
    type: 'examination',
    date: formatDate(new Date()),
    time: '14:30',
    status: 'pending',
    description: '到院进行阴道B超检查，监测卵泡发育',
    reminder: true,
    phase: 'stimulation'
  },
  {
    id: 'task-4',
    title: '口服补佳乐 2mg',
    type: 'medication',
    date: formatDate(new Date()),
    time: '20:00',
    status: 'pending',
    description: '饭后服用，每日2次',
    reminder: true,
    phase: 'stimulation'
  }
];

// 禁忌事项
export const contraindications = [
  { id: 1, content: '避免剧烈运动和重体力劳动', type: 'exercise' },
  { id: 2, content: '禁止吸烟、饮酒', type: 'lifestyle' },
  { id: 3, content: '避免接触有毒有害物质', type: 'environment' },
  { id: 4, content: '保持规律作息，避免熬夜', type: 'lifestyle' },
  { id: 5, content: '饮食清淡，避免辛辣刺激食物', type: 'diet' },
  { id: 6, content: '禁止自行增减药物剂量', type: 'medication' }
];
