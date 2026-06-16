import Taro from '@tarojs/taro';

const STORAGE_PREFIX = 'ivf_calendar_';

const StorageKeys = {
  MEDICATIONS: 'medications',
  PREGNANCY_TESTS: 'pregnancy_tests',
  EXPENSES: 'expenses',
  QUESTIONS: 'questions',
  ABNORMAL_FLAGS: 'abnormal_flags',
  DOCUMENTS: 'documents',
  EVENTS: 'calendar_events'
} as const;

type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];

function getKey(key: StorageKey): string {
  return STORAGE_PREFIX + key;
}

function getStorageData<T>(key: StorageKey, defaultValue: T): T {
  try {
    const data = Taro.getStorageSync(getKey(key));
    if (data === '' || data === undefined || data === null) {
      return defaultValue;
    }
    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as T;
      } catch {
        return defaultValue;
      }
    }
    return data as T;
  } catch (e) {
    console.error('[Storage] getStorageData error:', key, e);
    return defaultValue;
  }
}

function setStorageData<T>(key: StorageKey, data: T): void {
  try {
    Taro.setStorageSync(getKey(key), JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] setStorageData error:', key, e);
  }
}

function mergeWithDefault<T extends Array<any>>(
  key: StorageKey,
  defaultData: T,
  idField: string = 'id'
): T {
  const stored = getStorageData<T>(key, [] as unknown as T);
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaultData;
  }
  const storedIds = new Set(stored.map(item => item[idField]));
  const merged = [...stored];
  defaultData.forEach(item => {
    if (!storedIds.has(item[idField])) {
      merged.push(item);
    }
  });
  return merged as T;
}

export const storage = {
  keys: StorageKeys,

  getMedications: <T>(defaultValue: T): T =>
    mergeWithDefault(StorageKeys.MEDICATIONS, defaultValue as any) as unknown as T,

  setMedications: <T>(data: T): void =>
    setStorageData(StorageKeys.MEDICATIONS, data),

  getPregnancyTests: <T>(defaultValue: T): T =>
    mergeWithDefault(StorageKeys.PREGNANCY_TESTS, defaultValue as any) as unknown as T,

  setPregnancyTests: <T>(data: T): void =>
    setStorageData(StorageKeys.PREGNANCY_TESTS, data),

  getExpenses: <T>(defaultValue: T): T =>
    mergeWithDefault(StorageKeys.EXPENSES, defaultValue as any) as unknown as T,

  setExpenses: <T>(data: T): void =>
    setStorageData(StorageKeys.EXPENSES, data),

  getQuestions: <T>(defaultValue: T): T =>
    mergeWithDefault(StorageKeys.QUESTIONS, defaultValue as any) as unknown as T,

  setQuestions: <T>(data: T): void =>
    setStorageData(StorageKeys.QUESTIONS, data),

  getAbnormalFlags: <T>(defaultValue: T): T =>
    mergeWithDefault(StorageKeys.ABNORMAL_FLAGS, defaultValue as any) as unknown as T,

  setAbnormalFlags: <T>(data: T): void =>
    setStorageData(StorageKeys.ABNORMAL_FLAGS, data),

  getDocuments: <T>(defaultValue: T): T =>
    mergeWithDefault(StorageKeys.DOCUMENTS, defaultValue as any) as unknown as T,

  setDocuments: <T>(data: T): void =>
    setStorageData(StorageKeys.DOCUMENTS, data),

  getEvents: <T>(defaultValue: T): T =>
    mergeWithDefault(StorageKeys.EVENTS, defaultValue as any) as unknown as T,

  setEvents: <T>(data: T): void =>
    setStorageData(StorageKeys.EVENTS, data),

  clearAll: (): void => {
    Object.values(StorageKeys).forEach(key => {
      try {
        Taro.removeStorageSync(getKey(key));
      } catch (e) {
        console.error('[Storage] clearAll error:', key, e);
      }
    });
  }
};

export default storage;
