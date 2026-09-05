const App = {
  currentPage: 'record', // ค่าเริ่มต้น

  init() {
    Store.init();
    this.applyTheme();
    this.renderLayout();
    this.bindNavEvents();
  },

  renderLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-card">
        <h1 class="app-title">BARBER SHOP</h1>
        
        <!-- หน้า: บันทึก -->
        <div id="page-record" class="page active">
          ${this.renderRecordPage()}
        </div>

        <!-- หน้า: รายงาน -->
        <div id="page-report" class="page">
          ${this.renderReportPage()}
        </div>

        <!-- หน้า: บัญชี -->
        <div id="page-account" class="page">
          ${this.renderAccountPage()}
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
  },

  renderRecordPage() {
    return `
      <!-- แถวปุ่มบนสุด -->
      <div class="top-row">
        <button class="top-btn">
          <span class="icon-wrap">🛡️</span>
          <span>ประกันรายได้</span>
        </button>
        <button class="top-btn">
          <span class="icon-wrap">🏝️</span>
          <span>บันทึกวันหยุด</span>
        </button>
        <button class="top-btn">
          <span class="icon-wrap">⚙️</span>
          <span>ตั้งค่าระบบ</span>
        </button>
      </div>

      <!-- วันที่ + ประเภทลูกค้า -->
      <div class="two-col-row">
        <div class="input-box">
          <span>📅</span>
          <input type="date" value="${Store.getToday()}">
        </div>
        <div class="input-box">
          <span>🌿</span>
          <select>
            <option>ลูกค้าประจำ</option>
            <option>ลูกค้าใหม่</option>
          </select>
        </div>
      </div>

      <!-- เวลา เริ่ม - เสร็จ -->
      <div class="time-row">
        <div class="time-box">
          <span>เริ่ม</span>
          <input type="time">
        </div>
        <div class="time-box">
          <span>เสร็จ</span>
          <input type="time">
        </div>
      </div>

      <!-- เลือกบริการ 3 ช่อง -->
      <div class="service-row">
        <div class="service-select">
          <span>✂️</span>
          <select><option>ทรงผม</option></select>
        </div>
        <div class="service-select">
          <span>➕</span>
          <select><option>บริการ 1</option></select>
        </div>
        <div class="service-select">
          <span>➕</span>
          <select><option>บริการ 2</option></select>
        </div>
      </div>

      <!-- ราคา + ทิป -->
      <div class="price-row">
        <div class="price-box">
          <span class="b-icon">B</span>
          <span id="price-val">0</span>
        </div>
        <div class="tip-box">ทิปโอน</div>
      </div>

      <!-- ช่องทางชำระ -->
      <div class="pay-row">
        <button class="pay-btn">💵 เงินสด</button>
        <button class="pay-btn">🔄 แบ่ง</button>
        <button class="pay-btn">🗳️ ผสม</button>
      </div>

      <!-- ปุ่มบันทึก -->
      <button class="save-btn-main">🔒 บันทึกข้อมูล</button>
    `;
  },

  renderReportPage() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);
    const total = dayRecords.reduce((s, r) => s + Number(r.price), 0);

    return `
      <h2 style="text-align:center; margin-bottom:16px; font-size:1.05rem;">📊 รายงานประจำวัน</h2>
      <div class="info-card">
        <h3>วันที่ ${today}</h3>
        <div class="info-row"><span>จำนวนรายการ</span><strong>${dayRecords.length}</strong></div>
        <div class="info-row"><span>ยอดรวมทั้งหมด</span><strong>฿${total.toLocaleString()}</strong></div>
        <div class="info-row"><span>เงินสด</span><strong>฿${dayRecords.filter(r=>r.paymentMethod==='cash').reduce((s,r)=>s+Number(r.price),0).toLocaleString()}</strong></div>
        <div class="info-row"><span>เงินโอน</span><strong>฿${dayRecords.filter(r=>r.paymentMethod==='transfer').reduce((s,r)=>s+Number(r.price),0).toLocaleString()}</strong></div>
      </div>
      <div class="info-card">
        <h3>สรุปรายเดือน</h3>
        <div class="info-row"><span>ยอดรวม</span><strong>฿0</strong></div>
        <div class="info-row"><span>เฉลี่ย/วัน</span><strong>฿0</strong></div>
      </div>
    `;
  },

  renderAccountPage() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);
    const daySum = Calculations.summarizeRecords ? Calculations.summarizeRecords(dayRecords) : { barberTotal: 0, shopTotal: 0 };

    return `
      <h2 style="text-align:center; margin-bottom:16px; font-size:1.05rem;">💼 ข้อมูลการเงิน</h2>
      <div class="info-card">
        <h3>ยอดวันนี้</h3>
        <div class="info-row"><span>รายได้ของช่าง</span><strong style="color:#059669;">฿${daySum.barberTotal.toLocaleString()}</strong></div>
        <div class="info-row"><span>ยอดที่ร้านได้รับ</span><strong style="color:#4f46e5;">฿${daySum.shopTotal.toLocaleString()}</strong></div>
        <div class="info-row"><span>ยอดคงเหลือที่ต้องเคลียร์</span><strong>฿0</strong></div>
      </div>
      <div class="info-card">
        <h3>ประกันรายได้</h3>
        <div class="info-row"><span>สถานะ</span><strong>${Store.settings.guaranteeEnabled ? 'เปิดใช้งาน ✅' : 'ปิดใช้งาน'}</strong></div>
        ${Store.settings.guaranteeEnabled ? `<div class="info-row"><span>ขั้นต่ำที่รับประกัน</span><strong>฿${Store.settings.guaranteeMinIncome.toLocaleString()}</strong></div>` : ''}
      </div>
    `;
  },

  bindNavEvents() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.switchPage(page);
      });
    });
  },

  switchPage(pageName) {
    // สลับสถานะปุ่มเมนู
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === pageName));
    // สลับแสดงหน้า
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageName}`).classList.add('active');
  },

  applyTheme() {
    document.documentElement.setAttribute('data-theme', Store.settings.theme || 'light');
  },

  switchMode() {
    Store.setMode(null);
    App.init();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
