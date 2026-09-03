/**
 * Main Application Router
 * จัดการการสลับหน้า (Routing) และการเปลี่ยนโหมด (Owner / Barber)
 */

import { db } from './storage.js';
import * as BarberRecord from './barber/record.js';
import * as BarberAccount from './barber/account.js';
import * as BarberReport from './barber/report.js';
import * as BarberSettings from './settings/barber-settings.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.currentMode = localStorage.getItem('cutnote_mode') || null;
    this.currentView = 'record';
  }

  init() {
    // เช็กว่าเลือกโหมดไว้หรือยัง
    if (!this.currentMode) {
      this.showModeSelection();
    } else {
      this.setMode(this.currentMode);
    }

    this.bindEvents();
  }

  // หน้าเลือก Mode (Owner / Barber)
  showModeSelection() {
    document.body.className = 'view-mode-select';
    const header = document.getElementById('main-header');
    const nav = document.getElementById('bottom-nav');
    if (header) header.style.display = 'none';
    if (nav) nav.style.display = 'none';

    this.appContainer.innerHTML = `
      <div style="max-width: 400px; margin: 40px auto; text-align: center; padding: 20px;">
        <h2 style="margin-bottom: 8px;">CUTNOTE SYSTEM</h2>
        <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 24px;">เลือกระบบการใช้งาน</p>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <button id="select-owner" style="padding: 16px; background: #7e22ce; color: white; border: none; border-radius: 12px; font-weight: bold; font-size: 1rem; cursor: pointer;">
            👑 Owner Mode (เจ้าของร้าน)
          </button>
          
          <button id="select-barber" style="padding: 16px; background: #059669; color: white; border: none; border-radius: 12px; font-weight: bold; font-size: 1rem; cursor: pointer;">
            ✂️ Barber Mode (ช่างตัดผม)
          </button>
        </div>
      </div>
    `;

    document.getElementById('select-owner')?.addEventListener('click', () => this.setMode('OWNER'));
    document.getElementById('select-barber')?.addEventListener('click', () => this.setMode('BARBER'));
  }

  // ตั้งค่า Mode
  setMode(mode) {
    this.currentMode = mode;
    localStorage.setItem('cutnote_mode', mode);
    document.body.className = `mode-${mode.toLowerCase()}`;

    const header = document.getElementById('main-header');
    const nav = document.getElementById('bottom-nav');
    if (header) header.style.display = 'flex';
    if (nav) nav.style.display = 'flex';

    // โหลดหน้าแรกของโหมดนั้นๆ
    this.navigateTo('record');
  }

  // สลับหน้า (Router)
  navigateTo(viewName) {
    this.currentView = viewName;
    this.appContainer.innerHTML = '';

    // เรียก Render ตามหน้า
    if (this.currentMode === 'BARBER') {
      switch (viewName) {
        case 'record':
          BarberRecord.render(this.appContainer, this);
          break;
        case 'account':
          BarberAccount.render(this.appContainer, this);
          break;
        case 'report':
          BarberReport.render(this.appContainer, this);
          break;
        case 'settings':
          BarberSettings.render(this.appContainer, this);
          break;
        default:
          BarberRecord.render(this.appContainer, this);
      }
    }
  }

  bindEvents() {
    // ปุ่ม Setting บน Header
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.navigateTo('settings');
    });
  }
}

// เริ่มการทำงานระบบเมื่อโหลด DOM เสร็จ
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
