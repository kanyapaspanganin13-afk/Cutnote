/**
 * Storage Engine (Data Layer)
 * จัดการการอ่าน/เขียน LocalStorage และสร้างข้อมูลเริ่มต้น
 */

const STORAGE_KEY = 'BARBER_SYSTEM_DATA_V2';

const INITIAL_SCHEMA = {
  system: {
    currentMode: 'NONE', // 'OWNER' | 'BARBER' | 'NONE'
    theme: 'light',
    soundEnabled: true,
    voiceGender: 'female'
  },
  barberSettings: {
    commissionPercent: 60,
    guaranteedIncome: 500
  },
  customers: [],
  services: [
    { id: 'SRV_1', name: 'ตัดผมชาย', price: 150 },
    { id: 'SRV_2', name: 'สระไดร์', price: 100 },
    { id: 'SRV_3', name: 'โกนหนวด', price: 80 }
  ],
  transactions: [],
  clearances: [],
  dayStatus: []
};

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.saveAll(INITIAL_SCHEMA);
    }
  }

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || INITIAL_SCHEMA;
    } catch (e) {
      console.error('Error reading localStorage', e);
      return INITIAL_SCHEMA;
    }
  }

  saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  get(key) {
    const data = this.getAll();
    return data[key];
  }

  set(key, value) {
    const data = this.getAll();
    data[key] = value;
    this.saveAll(data);
  }

  // Helper Methods for specific data updates
  addTransaction(transaction) {
    const data = this.getAll();
    data.transactions.unshift(transaction);
    this.saveAll(data);
  }

  addClearance(clearanceRecord) {
    const data = this.getAll();
    data.clearances.unshift(clearanceRecord);
    this.saveAll(data);
  }

  updateCustomerVisit(phone, name, isRegular) {
    const data = this.getAll();
    let customer = data.customers.find(c => c.phone === phone);

    if (customer) {
      customer.visitCount += 1;
      customer.type = isRegular ? 'REGULAR' : customer.type;
      customer.lastVisit = new Date().toISOString();
    } else {
      customer = {
        id: 'CUST_' + Date.now(),
        name: name || 'ลูกค้า',
        phone: phone || '',
        type: isRegular ? 'REGULAR' : 'NEW',
        visitCount: 1,
        lastVisit: new Date().toISOString()
      };
      data.customers.push(customer);
    }

    this.saveAll(data);
    return customer;
  }

  resetAllData() {
    this.saveAll(INITIAL_SCHEMA);
  }

  importData(jsonData) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed && parsed.system && parsed.transactions) {
        this.saveAll(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid backup format', e);
      return false;
    }
  }
}

export const db = new StorageManager();
