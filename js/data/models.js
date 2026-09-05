const MODELS = {
  APP: {
    mode: null, // 'OWNER' | 'BARBER' | null
    lastMode: null,
    initialized: false
  },

  SETTINGS: {
    theme: 'light',
    sound: true,
    voiceGender: 'male',
    guaranteeMinIncome: 0,
    guaranteeEnabled: false
  },

  RECORD: {
    id: '',
    date: '',
    time: '',
    service: '',
    price: 0,
    customerType: 'regular', // 'new' | 'regular'
    paymentMethod: 'cash', // 'cash' | 'transfer'
    barber: '',
    createdAt: '',
    barberIncome: 0,
    shopIncome: 0,
    guaranteeApplied: false,
    guaranteeDifference: 0
  },

  SETTLEMENT: {
    id: '',
    date: '',
    previousBalance: 0,
    todayTotal: 0,
    totalToSettle: 0,
    clearedAmount: 0,
    remainingBalance: 0,
    clearedAt: null,
    note: ''
  },

  HOLIDAY: {
    id: '',
    date: '',
    status: 'pending', // 'pending' | 'approved' | 'taken'
    note: ''
  },

  DAILY_SUMMARY: {
    date: '',
    totalSales: 0,
    customerCount: 0,
    newCustomers: 0,
    regularCustomers: 0,
    cashTotal: 0,
    transferTotal: 0,
    barberTotal: 0,
    shopTotal: 0,
    guaranteeTotal: 0,
    guaranteeDiffTotal: 0
  }
};
