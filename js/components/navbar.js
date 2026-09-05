const Navbar = {
  render(mode, activeTab = 'records') {
    const modeLabel = mode === 'OWNER' ? '👤 เจ้าของกิจการ' : '✂️ ช่างตัดผม';
    const tabs = mode === 'OWNER'
      ? [{ key: 'records', label: 'บันทึก' }, { key: 'reports', label: 'รายงาน' }, { key: 'settings', label: 'ตั้งค่า' }]
      : [{ key: 'records', label: 'บันทึก' }, { key: 'reports', label: 'รายงาน' }, { key: 'account', label: 'บัญชี' }, { key: 'holidays', label: 'วันหยุด' }, { key: 'settings', label: 'ตั้งค่า' }];

    return `
      <nav class="navbar">
        <div class="navbar-top">
          <h1 class="navbar-title">✂️ Cutnote</h1>
          <span class="mode-badge">${modeLabel}</span>
          <button class="switch-mode-btn" title="เปลี่ยนโหมด">🔄</button>
        </div>
        <div class="navbar-tabs">
          ${tabs.map(t => `
            <button class="tab-btn ${activeTab === t.key ? 'active' : ''}" data-tab="${t.key}">
              ${t.label}
            </button>
          `).join('')}
        </div>
      </nav>
    `;
  },

  bindEvents() {
    document.querySelector('.switch-mode-btn')?.addEventListener('click', () => {
      App.switchMode();
    });
  }
};
