const Store = {
  state: { ...MODELS.APP },
  settings: { ...MODELS.SETTINGS },
  records: [],
  settlements: [],
  holidays: [],

  KEYS: {
    STATE: 'cutnote_state',
    SETTINGS: 'cutnote_settings',
    RECORDS: 'cutnote_records',
    SETTLEMENTS: 'cutnote_settlements',
    HOLIDAYS: 'cutnote_holidays'
  },

  init() {
    this.loadAll();
    this.state.initialized = true;
    this.saveState();
  },

  loadAll() {
    try {
      const state = localStorage.getItem(this.KEYS.STATE);
      const settings = localStorage.getItem(this.KEYS.SETTINGS);
      const records = localStorage.getItem(this.KEYS.RECORDS);
      const settlements = localStorage.getItem(this.KEYS.SETTLEMENTS);
      const holidays = localStorage.getItem(this.KEYS.HOLIDAYS);

      if (state) this.state = { ...MODELS.APP, ...JSON.parse(state) };
      if (settings) this.settings = { ...MODELS.SETTINGS, ...JSON.parse(settings) };
      if (records) this.records = JSON.parse(records);
      if (settlements) this.settlements = JSON.parse(settlements);
      if (holidays) this.holidays = JSON.parse(holidays);
    } catch (e) {
      console.warn('โหลดข้อมูลไม่สำเร็จ:', e);
    }
  },

  saveState() {
    localStorage.setItem(this.KEYS.STATE, JSON.stringify(this.state));
  },

  saveSettings() {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(this.settings));
  },

  saveRecords() {
    localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(this.records));
  },

  saveSettlements() {
    localStorage.setItem(this.KEYS.SETTLEMENTS, JSON.stringify(this.settlements));
  },

  saveHolidays() {
    localStorage.setItem(this.KEYS.HOLIDAYS, JSON.stringify(this.holidays));
  },

  setMode(mode) {
    this.state.mode = mode;
    if (mode) this.state.lastMode = mode;
    this.saveState();
  },

  getMode() {
    return this.state.mode;
  },

  getLastMode() {
    return this.state.lastMode;
  },

  clearAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    this.state = { ...MODELS.APP };
    this.settings = { ...MODELS.SETTINGS };
    this.records = [];
    this.settlements = [];
    this.holidays = [];
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  },

  getToday() {
    return new Date().toISOString().slice(0, 10);
  },

  getNowTime() {
    return new Date().toTimeString().slice(0, 5);
  }
};
