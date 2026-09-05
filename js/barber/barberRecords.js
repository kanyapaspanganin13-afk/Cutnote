const BarberRecords = {
  render() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);
    const summary = Calculations.summarizeRecords(dayRecords);
    
    // คำนวณประกันรายได้
    const guarantee = Calculations.calcGuarantee(
      summary.barberTotal,
      Store.settings.guaranteeMinIncome
    );
    return `
      <div class="records-page">

        <!-- ✅ แทรกส่วนปุ่มและช่องใหม่ตรงนี้ เป็นอันดับแรก -->
        <div class="top-buttons">
          <button class="top-btn">
            <span class="icon">🛡️</span>
            ประกันรายได้
          </button>
          <button class="top-btn">
            <span class="icon">🏝️</span>
            บันทึกวันหยุด
          </button>
          <button class="top-btn">
            <span class="icon">⚙️</span>
            ตั้งค่าระบบ
          </button>
        </div>

        <div class="form-group">
          <label>📅 วันที่</label>
          <input type="date" id="date">
        </div>

        <div class="payment-buttons">
          <button class="pay-btn">💵 เงินสด</button>
          <button class="pay-btn">🔄 แบ่ง</button>
          <button class="pay-btn">🗳️ ผสม</button>
        </div>

        <button class="save-btn">บันทึกข้อมูล</button>
        <!-- ✅ จบส่วนที่แทรก -->

        <section class="card form-card">
          <h2 class="card-title">➕ บันทึกการให้บริการ</h2>
          <form id="barber-record-form" class="form-grid">
            <div class="form-group">
              <label>บริการ</label>
              <input type="text" id="service" placeholder="เช่น ตัดผม, ยืดสี" required>
            </div>
            <div class="form-group">
              <label>ราคา (฿)</label>
              <input type="number" id="price" min="0" step="10" required>
            </div>
            <div class="form-group">
              <label>ประเภทลูกค้า</label>
              <select id="customerType">
                <option value="regular">ลูกค้าประจำ</option>
                <option value="new">ลูกค้าใหม่</option>
              </select>
            </div>
            <div class="form-group">
              <label>ช่องทางชำระ</label>
              <select id="paymentMethod">
                <option value="cash">เงินสด</option>
                <option value="transfer">เงินโอน</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>ช่างผู้ให้บริการ</label>
              <input type="text" id="barber" placeholder="ชื่อช่าง">
            </div>
            <button type="submit" class="btn primary-btn full-width">✅ บันทึกรายการ</button>
          </form>
        </section>

        <section class="card summary-card">
          <h2 class="card-title">📊 สรุปยอดวันนี้</h2>
          <div class="summary-grid">
            <div class="stat-box"><div class="stat-label">รายการ</div><div class="stat-value">${summary.count}</div></div>
            <div class="stat-box"><div class="stat-label">ลูกค้าใหม่</div><div class="stat-value">${summary.newCustomers}</div></div>
            <div class="stat-box"><div class="stat-label">ลูกค้าประจำ</div><div class="stat-value">${summary.regularCustomers}</div></div>
            <div class="stat-box cash"><div class="stat-label">เงินสด</div><div class="stat-value">฿${summary.cashTotal.toLocaleString()}</div></div>
            <div class="stat-box transfer"><div class="stat-label">เงินโอน</div><div class="stat-value">฿${summary.transferTotal.toLocaleString()}</div></div>
            <div class="stat-box total"><div class="stat-label">ยอดรวม</div><div class="stat-value">฿${summary.totalSales.toLocaleString()}</div></div>
          </div>
          <div class="income-split-box">
            <h3>💰 รายได้แบ่งตามสัดส่วน</h3>
            <div class="split-row">
              <span>รายได้ของช่าง</span>
              <strong class="barber-income">฿${summary.barberTotal.toLocaleString()}</strong>
            </div>
            <div class="split-row">
              <span>ยอดที่ร้านได้รับ</span>
              <strong class="shop-income">฿${summary.shopTotal.toLocaleString()}</strong>
            </div>
          </div>
          ${this.renderGuaranteeBox(guarantee)}
        </section>

        <section class="card list-card">
          <h2 class="card-title">📋 รายการวันนี้ (${dayRecords.length})</h2>
          <div class="record-list">
            ${dayRecords.length === 0 ? '<p class="empty-text">ยังไม่มีรายการ</p>' : dayRecords.map(r => this.renderRecordRow(r)).join('')}
          </div>
        </section>
      </div>
    `;
  },

  renderGuaranteeBox(g) {
    if (!Store.settings.guaranteeEnabled) {
      return `<div class="guarantee-box info-box">ℹ️ ประกันรายได้: ปิดอยู่ <button class="link-btn" onclick="BarberDashboard.currentTab='settings';BarberDashboard.bindTabEvents();">เปิดที่ตั้งค่า</button></div>`;
    }
    if (!g.applicable) {
      return `
        <div class="guarantee-box success-box">
          ✅ รายได้ถึงเกณฑ์ขั้นต่ำ ฿${Store.settings.guaranteeMinIncome.toLocaleString()} แล้ว
          <div class="guarantee-detail">รายได้จริงครบตามจำนวน ไม่ต้องชดเชย</div>
        </div>
      `;
    }
    return `
      <div class="guarantee-box warning-box">
        ⚠️ ต้องชดเชยตามประกันรายได้
        <div class="guarantee-detail">
          <div>เกณฑ์ขั้นต่ำ: ฿${Store.settings.guaranteeMinIncome.toLocaleString()}</div>
          <div>รายได้จริง: ฿${(Store.settings.guaranteeMinIncome - g.difference).toLocaleString()}</div>
          <div class="diff-line">ส่วนต่างที่ต้องเพิ่ม: <strong>฿${g.difference.toLocaleString()}</strong></div>
          <div>รายได้ที่ได้รับจริงทั้งหมด: <strong class="final-sum">฿${g.finalIncome.toLocaleString()}</strong></div>
        </div>
      </div>
    `;
  },

  renderRecordRow(r) {
    return `
      <div class="record-row" data-id="${r.id}">
        <div class="row-main">
          <div class="row-service">${r.service} — ${r.barber || 'ไม่ระบุ'}</div>
          <div class="row-price">฿${Number(r.price).toLocaleString()}</div>
        </div>
        <div class="row-meta">
          <span class="tag ${r.customerType}">${r.customerType === 'new' ? 'ลูกค้าใหม่' : 'ลูกค้าประจำ'}</span>
          <span class="tag ${r.paymentMethod}">${r.paymentMethod === 'cash' ? 'เงินสด' : 'โอน'}</span>
          <span class="row-time">${r.time}</span>
          <span class="tag income-tag">ช่าง ฿${Number(r.barberIncome).toLocaleString()} / ร้าน ฿${Number(r.shopIncome).toLocaleString()}</span>
          <button class="delete-btn" data-id="${r.id}">🗑️</button>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('barber-record-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addRecord();
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteRecord(e.target.dataset.id));
    });
  },

  addRecord() {
    const price = Number(document.getElementById('price').value);
    const split = Calculations.splitIncome(price);
    const record = {
      id: Store.generateId(),
      date: Store.getToday(),
      time: Store.getNowTime(),
      service: document.getElementById('service').value.trim(),
      price,
      customerType: document.getElementById('customerType').value,
      paymentMethod: document.getElementById('paymentMethod').value,
      barber: document.getElementById('barber').value.trim(),
      barberIncome: split.barberIncome,
      shopIncome: split.shopIncome,
      guaranteeApplied: false,
      guaranteeDifference: 0,
      createdAt: new Date().toISOString()
    };
    Store.records.push(record);
    Store.saveRecords();
    Toast.show('บันทึกสำเร็จ ✅ แบ่งรายได้อัตโนมัติ', 'success');
    App.route();
  },

  deleteRecord(id) {
    Store.records = Store.records.filter(r => r.id !== id);
    Store.saveRecords();
    Toast.show('ลบรายการแล้ว', 'info');
    App.route();
  }
};
