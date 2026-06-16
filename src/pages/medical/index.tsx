import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { usePullDownRefresh, useDidShow } from '@tarojs/taro';
import MedicationCard from '@/components/MedicationCard';
import type { Medication, Examination, MedicalDocument, ExpenseRecord, ExpenseType } from '@/types/ivf';
import { 
  medications as defaultMedications, 
  examinations, 
  medicalDocuments as defaultDocuments, 
  expenseRecords as defaultExpenses
} from '@/data/medical';
import { storage } from '@/utils/storage';
import { getRelativeDate } from '@/utils/date';
import styles from './index.module.scss';

const tabs = [
  { id: 'medication', name: '用药' },
  { id: 'examination', name: '检查' },
  { id: 'document', name: '单据' },
  { id: 'expense', name: '费用' }
];

const typeLabels: Record<string, string> = {
  examination: '检查',
  medication: '药品',
  surgery: '手术',
  injection: '注射',
  other: '其他'
};

const typeIcons: Record<string, string> = {
  examination: '🔬',
  medication: '💊',
  surgery: '🏥',
  injection: '💉',
  other: '📄'
};

const typeColors: Record<string, string> = {
  examination: '#4A90D9',
  medication: '#52C41A',
  surgery: '#FF6B9D',
  injection: '#FAAD14',
  other: '#722ED1'
};

const MedicalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('medication');
  const [meds, setMeds] = useState<Medication[]>(() =>
    storage.getMedications<Medication[]>(defaultMedications)
  );
  const [exams, setExams] = useState<Examination[]>(examinations);
  const [docs, setDocs] = useState<MedicalDocument[]>(() =>
    storage.getDocuments<MedicalDocument[]>(defaultDocuments)
  );
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() =>
    storage.getExpenses<ExpenseRecord[]>(defaultExpenses)
  );

  const [expenseFilter, setExpenseFilter] = useState<ExpenseType | 'all'>('all');

  const refreshData = useCallback(() => {
    setMeds(storage.getMedications<Medication[]>(defaultMedications));
    setDocs(storage.getDocuments<MedicalDocument[]>(defaultDocuments));
    setExpenses(storage.getExpenses<ExpenseRecord[]>(defaultExpenses));
  }, []);

  const expenseSummary = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byType: Record<string, number> = {
      medication: 0,
      examination: 0,
      surgery: 0,
      injection: 0,
      other: 0
    };
    expenses.forEach(e => {
      if (byType[e.type] !== undefined) {
        byType[e.type] += e.amount;
      }
    });
    return { total, byType, count: expenses.length };
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (expenseFilter === 'all') return expenses;
    return expenses.filter(e => e.type === expenseFilter);
  }, [expenses, expenseFilter]);

  useDidShow(() => {
    refreshData();
  });

  usePullDownRefresh(() => {
    refreshData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 500);
  });

  const handleCheckIn = useCallback((id: string) => {
    setMeds(prev => {
      const updated = prev.map(med => {
        if (med.id === id) {
          const today = new Date().toISOString().split('T')[0];
          const now = new Date().toTimeString().slice(0, 5);
          return {
            ...med,
            checkInHistory: [
              ...med.checkInHistory,
              { date: today, time: now, completed: true }
            ]
          };
        }
        return med;
      });
      storage.setMedications(updated);
      return updated;
    });
    Taro.showToast({ title: '打卡成功', icon: 'success' });
  }, []);

  const handleAddMedication = useCallback(() => {
    Taro.navigateTo({ url: '/pages/medication-add/index' });
  }, []);

  const handleMedicationClick = useCallback((id: string) => {
    Taro.navigateTo({ url: `/pages/medication-detail/index?id=${id}` });
  }, []);
  
  const handleExaminationClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/examination-detail/index?id=${id}` });
  };
  
  const handleAddDocument = () => {
    Taro.navigateTo({ url: '/pages/document-upload/index' });
  };
  
  const handleDocumentClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/document-detail/index?id=${id}` });
  };
  
  const handleAddExpense = () => {
    Taro.navigateTo({ url: '/pages/expense-record/index' });
  };
  
  const handleViewAll = (type: string) => {
    if (type === 'expense') {
      Taro.navigateTo({ url: '/pages/expense-record/index' });
    }
  };

  const pendingExams = exams.filter(e => e.status === 'pending');
  const completedExams = exams.filter(e => e.status === 'completed');

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>就诊清单</Text>
        <Text className={styles.pageSubtitle}>用药、检查、单据、费用一站式管理</Text>
      </View>
      
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.id}
            className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </View>
        ))}
      </View>
      
      {activeTab === 'medication' && (
        <View className={styles.medicationsSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>当前用药</Text>
            <Button
              className={styles.addBtn}
              onClick={handleAddMedication}
            >
              + 添加
            </Button>
          </View>
          
          {meds.map(medication => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onCheckIn={handleCheckIn}
              onClick={handleMedicationClick}
            />
          ))}
        </View>
      )}
      
      {activeTab === 'examination' && (
        <View className={styles.examinationsSection}>
          {pendingExams.length > 0 && (
            <>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>待完成检查</Text>
                <Text className={styles.sectionAction}>{pendingExams.length} 项</Text>
              </View>
              <View className={styles.examList}>
                {pendingExams.map(exam => (
                  <View 
                    key={exam.id}
                    className={styles.examItem}
                    onClick={() => handleExaminationClick(exam.id)}
                  >
                    <View className={styles.examHeader}>
                      <View className={styles.examInfo}>
                        <Text className={styles.examName}>{exam.name}</Text>
                        <View className={styles.examMeta}>
                          <Text className={styles.examDate}>
                            {exam.time ? `${exam.date} ${exam.time}` : exam.date}
                          </Text>
                          <View className={`${styles.examStatus} ${exam.status}`}>
                            {exam.status === 'pending' ? '待完成' : '已完成'}
                          </View>
                        </View>
                        <Text className={styles.examHospital}>
                          {exam.hospital} · {exam.department}
                        </Text>
                      </View>
                    </View>
                    
                    {exam.requirements && exam.requirements.length > 0 && (
                      <View className={styles.examRequirements}>
                        <Text className={styles.requirementsLabel}>注意事项</Text>
                        <View className={styles.requirementTags}>
                          {exam.requirements.map((req, i) => (
                            <View key={i} className={styles.requirementTag}>{req}</View>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    {exam.note && (
                      <View className={styles.examNote}>
                        💡 {exam.note}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
          
          {completedExams.length > 0 && (
            <>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>已完成检查</Text>
                <Text className={styles.sectionAction}>{completedExams.length} 项</Text>
              </View>
              <View className={styles.examList}>
                {completedExams.map(exam => (
                  <View 
                    key={exam.id}
                    className={styles.examItem}
                    onClick={() => handleExaminationClick(exam.id)}
                  >
                    <View className={styles.examHeader}>
                      <View className={styles.examInfo}>
                        <Text className={styles.examName}>{exam.name}</Text>
                        <View className={styles.examMeta}>
                          <Text className={styles.examDate}>
                            {exam.time ? `${exam.date} ${exam.time}` : exam.date}
                          </Text>
                          <View className={`${styles.examStatus} ${exam.status}`}>
                            {exam.status === 'pending' ? '待完成' : '已完成'}
                          </View>
                        </View>
                        <Text className={styles.examHospital}>
                          {exam.hospital} · {exam.department}
                        </Text>
                      </View>
                    </View>
                    
                    {exam.result && (
                      <View className={styles.examResult}>
                        <Text className={styles.resultLabel}>检查结果</Text>
                        <Text className={styles.resultContent}>{exam.result}</Text>
                      </View>
                    )}
                    
                    {exam.note && (
                      <View className={styles.examNote}>
                        💡 {exam.note}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      )}
      
      {activeTab === 'document' && (
        <View className={styles.documentsSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>医院单据</Text>
            <View className={styles.headerActions}>
              <Text 
                className={styles.archiveLink}
                onClick={() => Taro.navigateTo({ url: '/pages/document-archive/index' })}
              >
                资料归档
              </Text>
              <Button 
                className={styles.addBtn}
                onClick={handleAddDocument}
              >
                + 上传
              </Button>
            </View>
          </View>
          
          <View className={styles.documentList}>
            <View 
              className={styles.addDocumentCard}
              onClick={handleAddDocument}
            >
              <Text className={styles.addIcon}>+</Text>
              <Text className={styles.addText}>上传单据</Text>
            </View>
            
            {docs.map(doc => (
              <View 
                key={doc.id}
                className={styles.documentItem}
                onClick={() => handleDocumentClick(doc.id)}
              >
                <View className={styles.documentImage}>
                  <Image 
                    className={styles.documentImg}
                    src={doc.imageUrl}
                    mode="aspectFill"
                    onError={(e) => console.error('[Medical] Image load error:', e)}
                  />
                </View>
                <Text className={styles.documentType}>{doc.type}</Text>
                <Text className={styles.documentTitle}>{doc.title}</Text>
                <Text className={styles.documentDate}>{doc.date}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {activeTab === 'expense' && (
        <View className={styles.expensesSection}>
          <View className={styles.expenseSummary}>
            <View className={styles.summaryHeader}>
              <Text className={styles.summaryLabel}>累计花费</Text>
              <Text className={styles.summaryAmount}>¥{expenseSummary.total.toLocaleString()}</Text>
            </View>
            <View className={styles.summaryBreakdown}>
              <View className={styles.breakdownItem}>
                <Text className={styles.breakdownValue}>¥{expenseSummary.byType.medication.toLocaleString()}</Text>
                <Text className={styles.breakdownLabel}>药品费</Text>
              </View>
              <View className={styles.breakdownItem}>
                <Text className={styles.breakdownValue}>¥{expenseSummary.byType.examination.toLocaleString()}</Text>
                <Text className={styles.breakdownLabel}>检查费</Text>
              </View>
              <View className={styles.breakdownItem}>
                <Text className={styles.breakdownValue}>¥{expenseSummary.byType.other.toLocaleString()}</Text>
                <Text className={styles.breakdownLabel}>其他</Text>
              </View>
            </View>
          </View>
          
          <View className={styles.expenseFilterTabs}>
            <View
              className={`${styles.filterTab} ${expenseFilter === 'all' ? styles.active : ''}`}
              onClick={() => setExpenseFilter('all')}
            >
              全部
            </View>
            {(['examination', 'medication', 'surgery', 'injection', 'other'] as ExpenseType[]).map(t => (
              <View
                key={t}
                className={`${styles.filterTab} ${expenseFilter === t ? styles.active : ''}`}
                onClick={() => setExpenseFilter(t)}
              >
                {typeLabels[t]}
              </View>
            ))}
          </View>

          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              费用明细（{filteredExpenses.length}条）
            </Text>
            <Button
              className={styles.addBtn}
              onClick={handleAddExpense}
            >
              + 记账
            </Button>
          </View>

          <View className={styles.expenseList}>
            {filteredExpenses.slice(0, 5).map(expense => (
              <View 
                key={expense.id}
                className={styles.expenseItem}
                onClick={() => handleAddExpense()}
              >
                <View 
                  className={styles.expenseIcon}
                  style={{ background: `${typeColors[expense.type]}20` }}
                >
                  {typeIcons[expense.type]}
                </View>
                <View className={styles.expenseContent}>
                  <View 
                    className={styles.expenseType}
                    style={{ 
                      background: `${typeColors[expense.type]}20`, 
                      color: typeColors[expense.type] 
                    }}
                  >
                    {typeLabels[expense.type]}
                  </View>
                  <Text className={styles.expenseDesc}>{expense.description}</Text>
                  <Text className={styles.expenseDate}>
                    {expense.hospital ? `${expense.hospital} · ` : ''}
                    {getRelativeDate(expense.date)}
                  </Text>
                </View>
                <Text className={styles.expenseAmount}>-¥{expense.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
          
          <Button 
            className={styles.viewAllBtn}
            onClick={() => handleViewAll('expense')}
          >
            查看全部费用记录
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default MedicalPage;
