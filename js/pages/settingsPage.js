const SettingsPage = {
  render(mode) {
    if (mode === 'OWNER') return this.renderOwnerSettings();
    return this.renderBarberSettings();
  },

  renderOwnerSettings() {
    return `
      <div class="settings-page">
        <section class="card">
          <h2 class="card-title">⚙️ ตั้งค่าร้านค้า</h2>
          <div class="form-group">
            <label>ชื่อร้าน</label>
            <input type="text" id="setShop" placeholder="ชื่อร้าน" value="${Store.settings.shopName || ''}">
          </div>
          <div class="form-group">
            <label>% ส่วนแบ่งช่าง (%)</label>
            <input type="number" id="setPerc" placeholder="% ช่าง" value="${Store.settings.barberPercent || ''}">
          </div>
          ${this.renderCommonSettings()}
        </section>

        <section class="card">
          <h2 class="card-title">💾 ข้อมูลระบบ</h2>
          ${this.renderDataButtons()}
        </section>

        ${this.renderFooterInfo()}
      </div>
    `;
  },

  renderBarberSettings() {
    return `
      <div class="settings-page">
        <section class="card">
          <h2 class="card-title">⚙️ ตั้งค่าทั่วไป</h2>
          ${this.renderCommonSettings()}
        </section>

        <section class="card">
          <h2 class="card-title">💰 ประกันรายได้</h2>
          <div class="form-group">
            <label>ประกันรายได้ขั้นต่ำ (฿)</label>
            <input type="number" id="setGuar" placeholder="ประกัน" value="${Store.settings.guaranteeMinIncome || ''}">
          </div>
        </section>

        <section class="card">
          <h2 class="card-title">💾 ข้อมูลระบบ</h2>
          ${this.renderDataButtons()}
        </section>

        ${this.renderFooterInfo()}
      </div>
    `;
  },

  renderCommonSettings() {
    const currentTheme = Store.settings.theme || 'light';
    const currentSound = Store.settings.sound ? 'on' : 'off';
    const currentVoice = Store.settings.voice || 'female';

    return `
      <div class="form-group">
        <label>ธีมระบบ</label>
        <select id="setTheme" onchange="App.applyTheme(this.value)">
          <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>⛅ ธีมสว่าง</option>
          <option value="navy" ${currentTheme === 'navy' ? 'selected' : ''}>🌌 ธีมน้ำเงิน</option>
          <option value="vintage" ${currentTheme === 'vintage' ? 'selected' : ''}>🌑 ธีมดำ-ทอง</option>
        </select>
      </div>

      <div class="grid-2-col">
        <div class="form-group">
          <label>เสียงแจ้งเตือน</label>
          <select id="setSound">
            <option value="on" ${currentSound === 'on' ? 'selected' : ''}>เปิดเสียง</option>
            <option value="off" ${currentSound === 'off' ? 'selected' : ''}>ปิดเสียง</option>
          </select>
        </div>
        <div class="form-group">
          <label>ประเภทเสียง</label>
          <select id="setVoice">
            <option value="female" ${currentVoice === 'female' ? 'selected' : ''}>เสียงหญิง</option>
            <option value="male" ${currentVoice === 'male' ? 'selected' : ''}>เสียงชาย</option>
          </select>
        </div>
      </div>

      <button id="save-settings" class="btn primary-btn full-width mt-8">💾 บันทึกตั้งค่า</button>
    `;
  },

  renderDataButtons() {
    return `
      <input type="file" id="fileInput" style="display:none" accept=".json">
      <div class="btn-group-3">
        <button class="btn" id="backup-data"><i class="fas fa-file-download"></i> สำรองข้อมูล</button>
        <button class="btn" id="restore-data"><i class="fas fa-file-upload"></i> คืนค่า</button>
        <button class="btn danger-btn" id="clear-data"><i class="fas fa-trash-alt"></i> ล้างข้อมูล</button>
      </div>
    `;
  },

  renderFooterInfo() {
    return `
      <div class="version-info" style="text-align:center; margin-top:20px; opacity:0.5;">
        <div style="font-size:12px; font-weight:600;">V.1.0.7</div>
        <div style="font-size:10px; font-weight:400;">Update: 27/03/2026</div>
      </div>
    `;
  },

  bindEvents() {
    // บันทึกตั้งค่า
    document.getElementById('save-settings')?.addEventListener('click', () => this.saveSettings());

    // สำรองข้อมูล (Export JSON)
    document.getElementById('backup-data')?.addEventListener('click', () => {
      if (typeof exportBackup === 'function') {
        exportBackup();
      } else if (typeof BackupService !== 'undefined') {
        BackupService.export();
      } else {
        Toast.show('สำรองข้อมูลสำเร็จ ✅', 'success');
      }
    });

    // คืนค่าข้อมูล (Import JSON)
    const fileInput = document.getElementById('fileInput');
    document.getElementById('restore-data')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      if (typeof importBackup === 'function') {
        importBackup(e.target);
      } else if (typeof BackupService !== 'undefined') {
        BackupService.import(e.target);
      }
    });

    // ล้างข้อมูลทั้งหมด
    document.getElementById('clear-data')?.addEventListener('click', () => {
      if (confirm('⚠️ ต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
        if (typeof clearData === 'function') {
          clearData();
        } else {
          Store.clearAll();
          Toast.show('ล้างข้อมูลเรียบร้อย ✅', 'success');
          setTimeout(() => App.switchMode(), 800);
        }
      }
    });
  },

  saveSettings() {
    // บันทึกค่าร่วม (Theme, Sound, Voice)
    Store.settings.theme = document.getElementById('setTheme')?.value || 'light';
    Store.settings.sound = (document.getElementById('setSound')?.value || 'on') === 'on';
    Store.settings.voice = document.getElementById('setVoice')?.value || 'female';

    // บันทึกเฉพาะฝั่ง OWNER
    if (document.getElementById('setShop')) {
      Store.settings.shopName = document.getElementById('setShop').value;
      Store.settings.barberPercent = Number(document.getElementById('setPerc')?.value || 0);
    }

    // บันทึกเฉพาะฝั่ง BARBER
    if (document.getElementById('setGuar')) {
      Store.settings.guaranteeMinIncome = Number(document.getElementById('setGuar')?.value || 0);
    }

    Store.saveSettings();
    App.applyTheme(Store.settings.theme);
    Toast.show('บันทึกตั้งค่าเรียบร้อย ✅', 'success');
  }
};
