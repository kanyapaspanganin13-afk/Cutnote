const OwnerRecords = {
  render() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);
    const summary = this.calcSummary(dayRecords);
    return `
      <div class="records-page">

        <!-- ✅ ปุ่มด้านบนเหมือนหน้าช่าง -->
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

        <!-- ✅ ช่องวันที่ -->
        <div class="form-group">
          <label>📅 วันที่</label>
          <input type="date" id="date" value="${today}">
        </div>

        <!-- ✅ ปุ่มช่องทางชำระ -->
        <div class="payment-buttons">
          <button class="pay-btn">💵 เงินสด</button>
          <button class="pay-btn">🔄 แบ่ง</button>
          <button class="pay-btn">🗳️ ผสม</button>
        </div>

        <!-- ✅ ปุ่มบันทึกข้อมูล -->
        <button class="save-btn">บันทึกข้อมูล</button>

        <section class="card form-card">
          <h2 class="card-title">➕ บันทึกการให้บริการ</h2>
          <form id="record-form" class="form-grid">
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
            <div class="stat-box"><div class="stat-label">รายการทั้งหมด</div><div class="stat-value">${summary.count}</div></div>
            <div class="stat-box"><div class="stat-label">ลูกค้าใหม่</div><div class="stat-value">${summary.newCustomers}</div></div>
            <div class="stat-box"><div class="stat-label">ลูกค้าประจำ</div><div class="stat-value">${summary.regularCustomers}</div></div>
            <div class="stat-box cash"><div class="stat-label">เงินสด</div><div class="stat-value">฿${summary.cashTotal.toLocaleString()}</div></div>
            <div class="stat-box transfer"><div class="stat-label">เงินโอน</div><div class="stat-value">฿${summary.transferTotal.toLocaleString()}</div></div>
            <div class="stat-box total"><div class="stat-label">ยอดรวมทั้งสิ้น</div><div class="stat-value">฿${summary.grandTotal.toLocaleString()}</div></div>
          </div>
          <button id="close-day-btn" class="btn warning-btn full-width mt-16">📅 ปิดร้าน</button>
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

  renderRecordRow(r) {
    return `
      <div class="record-row" data-id="${r.id}">
        <div class="row-main">
          <div class="row-service">${r.service} — ${r.barber || 'ไม่ระบุช่าง'}</div>
          <div class="row-price">฿${Number(r.price).toLocaleString()}</div>
        </div>
        <div class="row-meta">
          <span class="tag ${r.customerType}">${r.customerType === 'new' ? 'ลูกค้าใหม่' : 'ลูกค้าประจำ'}</span>
          <span class="tag ${r.paymentMethod}">${r.paymentMethod === 'cash' ? 'เงินสด' : 'โอน'}</span>
          <span class="row-time">${r.time}</span>
          <button class="delete-btn" data-id="${r.id}">🗑️</button>
        </div>
      </div>
    `;
  },

  calcSummary(records) {
    const cashTotal = records.filter(r => r.paymentMethod === 'cash').reduce((s, r) => s + Number(r.price), 0);
    const transferTotal = records.filter(r => r.paymentMethod === 'transfer').reduce((s, r) => s + Number(r.price), 0);
    return {
      count: records.length,
      newCustomers: records.filter(r => r.customerType === 'new').length,
      regularCustomers: records.filter(r => r.customerType === 'regular').length,
      cashTotal,
      transferTotal,
      grandTotal: cashTotal + transferTotal
    };
  },

  bindEvents() {
    document.getElementById('record-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addRecord();
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.deleteRecord(e.target.dataset.id);
      });
    });
    document.getElementById('close-day-btn')?.addEventListener('click', () => {
      Toast.show('ปิดร้านและสรุปยอดเรียบร้อย ✅', 'success');
    });
  },

  addRecord() {
    const record = {
      id: Store.generateId(),
      date: Store.getToday(),
      time: Store.getNowTime(),
      service: document.getElementById('service').value.trim(),
      price: Number(document.getElementById('price').value),
      customerType: document.getElementById('customerType').value,
      paymentMethod: document.getElementById('paymentMethod').value,
      barber: document.getElementById('barber').value.trim(),
      createdAt: new Date().toISOString()
    };
    Store.records.push(record);
    Store.saveRecords();
    Toast.show('บันทึกสำเร็จ ✅', 'success');
    App.route();
  },

  deleteRecord(id) {
    Store.records = Store.records.filter(r => r.id !== id);
    Store.saveRecords();
    Toast.show('ลบรายการแล้ว', 'info');
    App.route();
  }
};
