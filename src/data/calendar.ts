import type { CalendarEvent } from '@/types/ivf';

// 6月份日历事件
export const juneEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    date: '2026-06-10',
    title: 'B超卵泡监测',
    type: 'examination',
    phase: 'stimulation',
    status: 'pending'
  },
  {
    id: 'evt-2',
    date: '2026-06-12',
    title: '注射果纳芬 150IU',
    type: 'injection',
    phase: 'stimulation',
    status: 'completed'
  },
  {
    id: 'evt-3',
    date: '2026-06-13',
    title: 'B超卵泡监测',
    type: 'examination',
    phase: 'stimulation',
    status: 'completed'
  },
  {
    id: 'evt-4',
    date: '2026-06-14',
    title: '注射果纳芬 150IU',
    type: 'injection',
    phase: 'stimulation',
    status: 'completed'
  },
  {
    id: 'evt-5',
    date: '2026-06-15',
    title: '注射果纳芬 150IU',
    type: 'injection',
    phase: 'stimulation',
    status: 'completed'
  },
  {
    id: 'evt-6',
    date: '2026-06-16',
    title: 'B超卵泡监测',
    type: 'examination',
    phase: 'stimulation',
    status: 'pending'
  },
  {
    id: 'evt-7',
    date: '2026-06-16',
    title: '注射果纳芬 150IU',
    type: 'injection',
    phase: 'stimulation',
    status: 'pending'
  },
  {
    id: 'evt-8',
    date: '2026-06-17',
    title: 'B超卵泡监测',
    type: 'examination',
    phase: 'stimulation',
    status: 'pending'
  },
  {
    id: 'evt-9',
    date: '2026-06-17',
    title: '注射果纳芬 150IU',
    type: 'injection',
    phase: 'stimulation',
    status: 'pending'
  },
  {
    id: 'evt-10',
    date: '2026-06-18',
    title: '打夜针 (HCG)',
    type: 'injection',
    phase: 'stimulation',
    status: 'pending'
  },
  {
    id: 'evt-11',
    date: '2026-06-20',
    title: '取卵手术',
    type: 'visit',
    phase: 'retrieval',
    status: 'pending'
  },
  {
    id: 'evt-12',
    date: '2026-06-22',
    title: '胚胎培养情况确认',
    type: 'visit',
    phase: 'retrieval',
    status: 'pending'
  },
  {
    id: 'evt-13',
    date: '2026-06-25',
    title: '胚胎移植手术',
    type: 'visit',
    phase: 'transfer',
    status: 'pending'
  },
  {
    id: 'evt-14',
    date: '2026-06-26',
    title: '术后复查',
    type: 'examination',
    phase: 'transfer',
    status: 'pending'
  }
];

// 所有日历事件
export const calendarEvents: CalendarEvent[] = [
  ...juneEvents,
  {
    id: 'evt-15',
    date: '2026-07-09',
    title: '抽血验孕',
    type: 'examination',
    phase: 'pregnancy',
    status: 'pending'
  }
];

// 获取指定日期的事件
export const getEventsByDate = (date: string): CalendarEvent[] => {
  return calendarEvents.filter(event => event.date === date);
};

// 获取指定月份的事件
export const getEventsByMonth = (year: number, month: number): CalendarEvent[] => {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  return calendarEvents.filter(event => event.date.startsWith(monthStr));
};
