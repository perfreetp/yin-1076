export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/calendar/index',
    'pages/medical/index',
    'pages/health/index',
    'pages/message/index',
    'pages/medication-detail/index',
    'pages/examination-detail/index',
    'pages/symptom-record/index',
    'pages/pregnancy-test/index',
    'pages/expense-record/index',
    'pages/document-upload/index',
    'pages/document-detail/index',
    'pages/question-ask/index',
    'pages/family-share/index',
    'pages/abnormal-flag/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF6B9D',
    navigationBarTitleText: 'IVF 疗程日历',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF5F7'
  },
  tabBar: {
    color: '#8C8C8C',
    selectedColor: '#FF6B9D',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/calendar/index',
        text: '日历'
      },
      {
        pagePath: 'pages/medical/index',
        text: '就诊'
      },
      {
        pagePath: 'pages/health/index',
        text: '记录'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      }
    ]
  }
})
