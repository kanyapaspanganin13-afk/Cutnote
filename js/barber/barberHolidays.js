const BarberHolidays = {
  render() {
    return `
      <div class="holidays-page">
        <section class="card">
          <h2 class="card-title">➕ เพิ่มวันหยุด</h2>
          <form id="holiday-form" class="form-grid">
            <div class="form-group full-width">
              <label>วันที่</label>
              <input type="date" id="holiday-date" required>
            </div>
            <div class="form-group full-width">
              <label>สถานะ</label>
              <select id="holiday-status">
                <option value="pending">รออนุมัติ</option>
                <option value="approved">อนุมัติแล้ว</option>
                <option value="taken">ใช้ไปแล้ว</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>หมายเหตุ</label>
              <input type="text" id="holiday-note" placeholder="เหตุผลหรือรายละเอียด">
            </div>
            <button type="submit" class="btn primary-btn full-width">✅ บันทึกวันหยุด</button>
          </form>
        </section>

        <section class="card">
          <h2 class="card-title">📅 รายการวันหยุด (${Store.holidays.length})</h2>
          <div class="holiday-list">
            ${Store.holidays.length === 0 ? '<p class="empty-text">ยังไม่มีรายการวันหยุด</p>' :
              Store.holidays.slice().reverse().map(h => this.renderHolidayRow(h)).join('')
            }
          </div>
        </section>
      </div>
    `;
  },

  renderHolidayRow(h) {
    const statusText = { pending: 'รออนุมัติ', approved: 'อนุมัติ', taken: 'ใช้แล้ว' }[h.status] || h.status;
    const statusClass = { pending: 'status-pending', approved: 'status-approved', taken: 'status-taken' }[h.status] || '';
    return `
      <div class="holiday-row" data-id="${h.id}">
        <div class="holiday-info">
          <div class="holiday-date">📅 ${h.date}</div>
          <div class="holiday-note">${h.note || '—'}</div>
        </div>
        <div class="holiday-actions">
          <span class="status-tag ${statusClass}">${statusText}</span>
          <button class="delete-btn" data-id="${h.id}">🗑️</button>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('holiday-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addHoliday();
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteHoliday(e.target.dataset.id));
    });
  },

  addHoliday() {
    const holiday = {
      id: Store.generateId(),
      date: document.getElementById('holiday-date').value,
      status: document.getElementById('holiday-status').value,
      note: document.getElementById('holiday-note').value.trim()
    };
    Store.holidays.push(holiday);
    Store.saveHolidays();
    Toast.show('บันทึกวันหยุดเรียบร้อย ✅', 'success');
    App.route();
  },

  deleteHoliday(id) {
    Store.holidays = Store.holidays.filter(h => h.id !== id);
    Store.saveHolidays();
    Toast.show('ลบวันหยุดแล้ว', 'info');
    App.route();
  }
};
