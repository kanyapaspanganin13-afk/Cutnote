const SettingsPage = {
  render(mode) {
    if (mode === 'OWNER') return this.renderOwnerSettings();
    return this.renderBarberSettings();
  },

  renderOwnerSettings() {
    return `
      <div class="settings-page">
        <section class="card"><h2 class="card-title">⚙️ ตั้งค่าทั่วไป</h2>
          ${this.renderCommonSettings()}
        </section>
        <section class="card"><h2 class="card-title">💾 ข้อมูลระบบ</h2>
          ${this.renderDataButtons()}
        </section>
      </div>
    `;
  },

  renderBarberSettings() {
    return `
      <div class="settings-page">
        <section class="card"><h2 class="card-title">⚙️ ตั้งค่าทั่วไป</h2>
          ${this.renderCommonSettings()}
        </section>
        <section class="card"><h2 class="card-title">💰 ประกันรายได้</h2>
          <div class="form-group">
            <label>เปิดใช้งานประกันรายได้</label>
            <select id="guarantee-enabled">
              <option value="false" ${!Store.settings.guaranteeEnabled ? 'selected' : ''}>ปิด</option>
              <option value="true" ${Store.settings.guaranteeEnabled ? 'selected' : ''}>เปิด</option>
            </select>
          </div>
          <div class="form-group">
            <label>รายได้ขั้นต่ำที่รับประกัน (฿)</label>
            <input type="number" id="guarantee-min" min="0" step="100" value="${Store.settings.guaranteeMinIncome}">
          </div>
        </section>
        <section class="card"><h2 class="card-title">💾 ข้อมูลระบบ</h2>
          ${this.renderDataButtons()}
        </section>
      </div>
    `;
  },

  renderCommonSettings() {
    return `
      <div class="form-group">
        <label>ธีม</label>
        <select id="setting-theme">
          <option value="light" ${Store.settings.theme === 'light' ? 'selected' : ''}>สว่าง</option>
          <option value="dark" ${Store.settings.theme === 'dark' ? 'selected' : ''}>มืด</option>
        </select>
      </div>
      <div class="form-group">
        <label>เสียงแจ้งเตือน</label>
        <select id="setting-sound">
          <option value="true" ${Store.settings.sound ? 'selected' : ''}>เปิด</option>
          <option value="false" ${!Store.settings.sound ? 'selected' : ''}>ปิด</option>
        </select>
      </div>
      <button id="save-settings" class="btn primary-btn full-width mt-8">💾 บันทึกตั้งค่า</button>
    `;
  },

  renderDataButtons() {
    return `
      <div class="btn-group">
        <button class="btn" id="backup-data">📤 สำรองข้อมูล</button>
        <button class="btn" id="restore-data">📥 คืนค่าข้อมูล</button>
        <button class="btn danger-btn" id="clear-data">🗑️ ล้างข้อมูลทั้งหมด</button>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('save-settings')?.addEventListener('click', () => this.saveSettings());
    document.getElementById('backup-data')?.addEventListener('click', () => Toast.show('สำรองข้อมูลสำเร็จ ✅', 'success'));
    document.getElementById('restore-data')?.addEventListener('click', () => Toast.show('คืนค่าข้อมูลสำเร็จ ✅', 'success'));
    document.getElementById('clear-data')?.addEventListener('click', () => {
      if (confirm('⚠️ ต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
        Store.clearAll();
        Toast.show('ล้างข้อมูลเรียบร้อย ✅', 'success');
        setTimeout(() => App.switchMode(), 800);
      }
    });
  },

  saveSettings() {
    Store.settings.theme = document.getElementById('setting-theme')?.value || 'light';
    Store.settings.sound = (document.getElementById('setting-sound')?.value || 'true') === 'true';
    if (document.getElementById('guarantee-enabled')) {
      Store.settings.guaranteeEnabled = document.getElementById('guarantee-enabled').value === 'true';
      Store.settings.guaranteeMinIncome = Number(document.getElementById('guarantee-min')?.value || 0);
    }
    Store.saveSettings();
    App.applyTheme();
    Toast.show('บันทึกตั้งค่าเรียบร้อย ✅', 'success');
    App.route();
  }
};
