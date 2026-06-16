// 疗程阶段枚举
export type TreatmentPhase = 'initial' | 'examination' | 'stimulation' | 'retrieval' | 'transfer' | 'pregnancy';

// 任务类型
export type TaskType = 'examination' | 'medication' | 'injection' | 'visit' | 'reminder';

// 任务状态
export type TaskStatus = 'pending' | 'completed' | 'overdue' | 'cancelled';

// 情绪类型
export type MoodType = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'tired';

// 症状严重程度
export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

// 验孕结果
export type PregnancyResult = 'positive' | 'negative' | 'pending' | 'weak';

// 费用类型
export type ExpenseType = 'examination' | 'medication' | 'surgery' | 'injection' | 'other';

// 消息类型
export type MessageType = 'system' | 'reminder' | 'doctor' | 'family' | 'notice';

// 疗程阶段信息
export interface PhaseInfo {
  id: string;
  phase: TreatmentPhase;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'current' | 'completed' | 'upcoming';
  progress: number;
  color: string;
  tips: string[];
}

// 疗程时间线节点
export interface TimelineNode {
  id: string;
  date: string;
  title: string;
  description: string;
  phase: TreatmentPhase;
  status: 'completed' | 'current' | 'upcoming';
  isKeyNode: boolean;
}

// 任务项
export interface TaskItem {
  id: string;
  title: string;
  type: TaskType;
  date: string;
  time?: string;
  status: TaskStatus;
  description?: string;
  reminder?: boolean;
  phase?: TreatmentPhase;
}

// 用药信息
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  type: 'oral' | 'injection' | 'external';
  timeSlots: string[];
  instructions: string;
  sideEffects?: string[];
  checkInHistory: {
    date: string;
    time: string;
    completed: boolean;
  }[];
}

// 检查项目
export interface Examination {
  id: string;
  name: string;
  date: string;
  time?: string;
  hospital: string;
  department: string;
  status: 'pending' | 'completed' | 'cancelled';
  requirements?: string[];
  result?: string;
  note?: string;
}

// 症状记录
export interface SymptomRecord {
  id: string;
  date: string;
  symptoms: string[];
  severity: SymptomSeverity;
  note?: string;
  abnormalFlag?: boolean;
}

// 情绪记录
export interface MoodRecord {
  id: string;
  date: string;
  time: string;
  mood: MoodType;
  note?: string;
}

// 验孕记录
export interface PregnancyTest {
  id: string;
  date: string;
  result: PregnancyResult;
  hcgValue?: number;
  note?: string;
  imageUrl?: string;
  daysAfterTransfer: number;
}

// 费用记录
export interface ExpenseRecord {
  id: string;
  date: string;
  type: ExpenseType;
  amount: number;
  description: string;
  hospital?: string;
  receiptImage?: string;
}

// 医院单据
export interface MedicalDocument {
  id: string;
  uploadDate: string;
  type: string;
  title: string;
  hospital: string;
  date: string;
  imageUrl: string;
  note?: string;
  tags?: string[];
}

// 问题卡片
export interface QuestionCard {
  id: string;
  question: string;
  answer?: string;
  createDate: string;
  status: 'pending' | 'answered' | 'archived';
  category: string;
}

// 异常标记
export interface AbnormalFlag {
  id: string;
  createDate: string;
  type: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  notified: boolean;
  status: 'pending' | 'resolved' | 'monitoring';
  suggestion?: string;
}

// 身体指标
export interface BodyMetrics {
  date: string;
  temperature?: number;
  weight?: number;
  bloodPressure?: string;
  heartRate?: number;
}

// 家属信息
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
  permissions: string[];
  joinDate: string;
}

// 消息
export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

// 日历事件
export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: TaskType;
  phase?: TreatmentPhase;
  status: TaskStatus;
}

// 疗程总览数据
export interface TreatmentOverview {
  currentPhase: TreatmentPhase;
  phaseName: string;
  startDate: string;
  daysInTreatment: number;
  totalProgress: number;
  nextKeyDate: string;
  nextKeyEvent: string;
  pendingTasks: number;
  completedTasks: number;
}
