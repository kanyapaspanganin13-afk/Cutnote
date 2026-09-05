const App = {
  // สถานะ: welcome=เลือกโหมด | record=บันทึก | report=รายงาน | account=บัญชี
  currentPage: 'welcome',
  userMode: null, // owner หรือ barber

  init() {
    Store.init();
    this.renderLayout();
  },

  renderLayout() {
    const app = document.getElementById('app');

    // 🔹 หน้าเลือกโหมด + ปุ่มการจัดการระบบ
    if (this.currentPage === 'welcome' || !this.userMode) {
      app.innerHTML = this.renderWelcomePage();
      this.bindWelcomeEvents();
      return;
    }

    // 🔹 หน้าหลัก — มีปุ่มกลับด้านบนสุด
    app.innerHTML = `
      <div class="app-card">
        <!-- ปุ่มกลับไปหน้าแรก -->
        <button class="back-btn" id="back-to-welcome">← กลับ</button>

        <h1 class="app-title">💈 BARBER SHOP</h1>

        <!-- แสดงเนื้อหาตามแท็บ -->
        <div id="page-record" class="page active">
          ${this.userMode === 'owner' ? OwnerRecords.render() : BarberRecords.render()}
        </div>
        <div id="page-report" class="page">
          ${ReportPage.render()}
        </div>
        <div id="page-account" class="page">
          ${AccountPage.render()}
        </div>
      </div>

      <!-- เมนูด้านล่าง -->
      <nav class="bottom-nav">
        <button class="nav-item active" data-page="record">
          <span class="nav-icon">✏️</span>
          <span>บันทึก</span>
        </button>
        <button class="nav-item" data-page="report">
          <span class="nav-icon">🕐</span>
          <span>รายงาน</span>
        </button>
        <button class="nav-item" data-page="account">
          <span class="nav-icon">💼</span>
          <span>บัญชี</span>
        </button>
      </nav>
    `;

    // ผูกอีเวนต์
    this.bindNavEvents();
    this.bindBackButton();
    // เรียก bindEvents ของหน้านั้นๆ
    if (this.userMode === 'owner') OwnerRecords.bindEvents();
    else BarberRecords.bindEvents();
  },

  // ===== หน้าเลือกโหมด + ปุ่มจัดการระบบ ✅ ปรับโครงสร้างปุ่มใหม่ =====
renderWelcomePage() {
    return `
      <div class="welcome-container">
        <!-- ด้านบนสุด: ชื่อแอป -->
        <h1 class="app-name">💈 BARBER SHOP</h1>
        <p class="welcome-subtitle">กรุณาเลือกโหมดการใช้งาน</p>

        <!-- แถวปุ่มจัดการระบบ 4 ปุ่ม -->
        <div class="system-buttons-row">
          <button class="system-btn" data-action="guarantee">
            <span class="system-icon">🛡️</span>
            <span>ประกันรายได้</span>
          </button>
          <button class="system-btn" data-action="holiday">
            <span class="system-icon">🏝️</span>
            <span>บันทึกวันหยุด</span>
          </button>
          <button class="system-btn" data-action="settings">
            <span class="system-icon">⚙️</span>
            <span>ตั้งค่าระบบ</span>
          </button>
          <button class="system-btn" data-action="closeShop">
            <span class="system-icon">📅</span>
            <span>ปิดร้าน</span>
          </button>
        </div>

        <!-- ปุ่มเลือกโหมด -->
        <div class="mode-buttons">
          <button class="mode-btn" data-mode="owner">
            <span class="mode-icon">👑</span>
            <div class="mode-info">
              <strong>เจ้าของร้าน</strong>
              <small>ดูแลข้อมูลทั้งหมด, ปิดร้าน, ดูรายงาน</small>
            </div>
          </button>
          <button class="mode-btn" data-mode="barber">
            <span class="mode-icon">✂️</span>
            <div class="mode-info">
              <strong>ช่างตัดผม</strong>
              <small>บันทึกงาน, ดูรายได้ส่วนตัว</small>
            </div>
          </button>
        </div>
      </div>
    `;
  },
  bindWelcomeEvents() {
    // เลือกโหมดการใช้งาน
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.userMode = mode;
        Store.setMode(mode);
        this.currentPage = 'record';
        this.renderLayout();
      });
    });

    // ปุ่มจัดการระบบ
    document.querySelectorAll('.system-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleSystemAction(action);
      });
    });
  },

  handleSystemAction(action) {
    switch(action) {
      case 'guarantee':
        Toast.show('เปิดหน้าประกันรายได้', 'info');
        break;
      case 'holiday':
        Toast.show('เปิดหน้าบันทึกวันหยุด', 'info');
        break;
      case 'settings':
        Toast.show('เปิดหน้าตั้งค่าระบบ', 'info');
        break;
      case 'closeShop':
        if (confirm('ต้องการปิดร้านและสรุปยอดวันนี้หรือไม่?')) {
          Toast.show('ปิดร้านเรียบร้อย ✅ สรุปยอดเรียบร้อย', 'success');
        }
        break;
    }
  },

  // ===== ปุ่มกลับไปหน้าเลือกโหมด =====
  bindBackButton() {
    document.getElementById('back-to-welcome')?.addEventListener('click', () => {
      this.userMode = null;
      this.currentPage = 'welcome';
      this.renderLayout();
    });
  },

  // ===== สลับแท็บด้านล่าง =====
  bindNavEvents() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pageName = e.currentTarget.dataset.page;
        this.switchTab(pageName);
      });
    });
  },

  switchTab(pageName) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === pageName));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageName}`).classList.add('active');
  }
};

// ===== หน้ารายงาน (สำรอง) =====
const ReportPage = {
  render() {
    return `
      <div style="padding:20px;">
        <h2 style="text-align:center; margin-bottom:20px;">📊 รายงาน</h2>
        <p style="text-align:center; color:#666;">ข้อมูลรายงานจะแสดงที่นี่</p>
      </div>
    `;
  }
};

// ===== หน้าบัญชี (สำรอง) =====
const AccountPage = {
  render() {
    return `
      <div style="padding:20px;">
        <h2 style="text-align:center; margin-bottom:20px;">💼 ข้อมูลการเงิน</h2>
        <p style="text-align:center; color:#666;">ข้อมูลบัญชีจะแสดงที่นี่</p>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
