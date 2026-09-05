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

    // 🔹 หน้าเลือกโหมด
    if (this.currentPage === 'welcome' || !this.userMode) {
      app.innerHTML = this.renderWelcomePage();
      this.bindWelcomeEvents();
      return;
    }

    // 🔹 หน้าหลักตามโหมดที่เลือก + สลับแท็บ
    app.innerHTML = `
      <div class="app-card">
        <h1 class="app-title">BARBER SHOP</h1>
        
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
    // เรียก bindEvents ของหน้านั้นๆ
    if (this.userMode === 'owner') OwnerRecords.bindEvents();
    else BarberRecords.bindEvents();
  },

  // ===== หน้าเลือกโหมด =====
  renderWelcomePage() {
    return `
      <div class="welcome-card">
        <h1 class="welcome-title">💈 BARBER SHOP</h1>
        <p class="welcome-subtitle">กรุณาเลือกโหมดการใช้งาน</p>
        <div class="mode-buttons">
          <button class="mode-btn" data-mode="owner">
            <span class="mode-icon">👑</span>
            <strong>เจ้าของร้าน</strong>
            <small>ดูแลข้อมูลทั้งหมด, ปิดร้าน, ดูรายงาน</small>
          </button>
          <button class="mode-btn" data-mode="barber">
            <span class="mode-icon">✂️</span>
            <strong>ช่างตัดผม</strong>
            <small>บันทึกงาน, ดูรายได้ส่วนตัว</small>
          </button>
        </div>
      </div>
    `;
  },

  bindWelcomeEvents() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.userMode = mode;
        Store.setMode(mode); // บันทึกโหมดลง Store
        this.currentPage = 'record';
        this.renderLayout(); // โหลดหน้าหลักทันที
      });
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
    // สลับสไตล์ปุ่มเมนู
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === pageName));
    // สลับแสดงหน้า
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
