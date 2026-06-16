// 日期处理工具函数

/**
 * 格式化日期为 YYYY-MM-DD
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 格式化时间为 HH:mm
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * 获取相对日期描述（今天、明天、后天、X天后）
 */
export const getRelativeDate = (dateStr: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === 2) return '后天';
  if (diffDays > 2 && diffDays <= 7) return `${diffDays}天后`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)}天前`;
  
  return formatDate(dateStr);
};

/**
 * 计算两个日期之间的天数差
 */
export const daysBetween = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 获取月份的第一天
 */
export const getMonthFirstDay = (year: number, month: number): Date => {
  return new Date(year, month, 1);
};

/**
 * 获取月份的最后一天
 */
export const getMonthLastDay = (year: number, month: number): Date => {
  return new Date(year, month + 1, 0);
};

/**
 * 获取月份的所有日期（含前后补全）
 */
export const getMonthDays = (year: number, month: number): { date: Date; isCurrentMonth: boolean }[] => {
  const firstDay = getMonthFirstDay(year, month);
  const lastDay = getMonthLastDay(year, month);
  const startDayOfWeek = firstDay.getDay();
  
  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  
  // 上月补全
  const prevMonthLastDay = getMonthLastDay(year, month - 1);
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
    days.push({ date: d, isCurrentMonth: false });
  }
  
  // 当月
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  
  // 下月补全（补齐6行）
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }
  
  return days;
};

/**
 * 获取星期几的中文名称
 */
export const getWeekDayName = (day: number): string => {
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  return names[day];
};

/**
 * 获取月份的中文名称
 */
export const getMonthName = (month: number): string => {
  const names = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return names[month];
};

/**
 * 判断是否是今天
 */
export const isToday = (dateStr: string): boolean => {
  return formatDate(new Date()) === formatDate(dateStr);
};

/**
 * 判断日期是否在某个范围内
 */
export const isDateInRange = (date: string, start: string, end: string): boolean => {
  const d = new Date(date).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return d >= s && d <= e;
};
