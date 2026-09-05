const ModeSelect = {
  render() {
    const lastMode = Store.getLastMode();
    const autoHint = lastMode 
      ? `<p class="mode-hint">เคยใช้งาน: ${lastMode === 'OWNER' ? 'เจ้าของกิจการ' : 'ช่างตัดผม'}</p>` 
      : '';

    return `
      <div class="mode-select-container">
        <div class="mode-card-wrapper">
          <h1 class="app-title">✂️ Cutnote</h1>
          <p class="app-subtitle">ระบบจัดการร้านตัดผม</p>
          ${autoHint}
          
          <div class="mode-buttons">
            <button class="mode-btn owner-btn" data-mode="OWNER">
              <span class="mode-icon">👤</span>
              <span class="mode-name">เจ้าของกิจการ</span>
              <span class="mode-desc">ดูภาพรวมยอดขายทั้งร้าน</span>
            </button>

            <button class="mode-btn barber-btn" data-mode="BARBER">
              <span class="mode-icon">✂️</span>
              <span class="mode-name">ช่างตัดผม</span>
              <span class="mode-desc">จัดการรายได้ & เคลียร์เงิน</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.selectMode(mode);
      });
    });
  },

  selectMode(mode) {
    Store.setMode(mode);
    Toast.show(`เข้าสู่โหมด: ${mode === 'OWNER' ? 'เจ้าของกิจการ' : 'ช่างตัดผม'}`, 'success');
    App.route();
  }
};
