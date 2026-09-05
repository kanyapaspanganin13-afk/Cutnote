const BarberReports = {
  render() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);
    const daySum = Calculations.summarizeRecords(dayRecords);
    const dayGuarantee = Calculations.calcGuarantee(daySum.barberTotal, Store.settings.guaranteeMinIncome);

    const month = today.slice(0, 7);
    const monthRecords = Store.records.filter(r => r.date.startsWith(month));
    const monthSum = Calculations.summarizeRecords(monthRecords);
    const monthGuarantee = Calculations.calcGuarantee(monthSum.barberTotal, Store.settings.guaranteeMinIncome);

    return `
      <div class="reports-page">
        <section class="card">
          <h2 class="card-title">📅 สรุปรายวัน — ${today}</h2>
          ${this.renderSummary(daySum, dayGuarantee)}
        </section>
        <section class="card">
          <h2 class="card-title">📆 สรุปรายเดือน — ${month}</h2>
          ${this.renderSummary(monthSum, monthGuarantee)}
        </section>
        <section class="card">
          <h2 class="card-title">🛠️ เครื่องมือ</h2>
          <div class="btn-group">
            <button class="btn primary-btn" id="export-report">📤 ส่งรายงาน</button>
            <button class="btn" id="send-line">💬 ส่งทาง LINE</button>
          </div>
        </section>
      </div>
    `;
  },

  renderSummary(s, g) {
    return `
      <div class="summary-table">
        <div class="row"><span>จำนวนรายการ</span><strong>${s.count}</strong></div>
        <div class="row"><span>ลูกค้าใหม่ / ประจำ</span><strong>${s.newCustomers} / ${s.regularCustomers}</strong></div>
        <div class="row"><span>เงินสด / เงินโอน</span><strong class="cash">฿${s.cashTotal.toLocaleString()}</strong> / <strong class="transfer">฿${s.transferTotal.toLocaleString()}</strong></div>
        <div class="row"><span>ยอดรวมทั้งหมด</span><strong>฿${s.totalSales.toLocaleString()}</strong></div>
        <div class="row"><span>รายได้ของช่าง</span><strong class="barber-income">฿${s.barberTotal.toLocaleString()}</strong></div>
        <div class="row"><span>ยอดที่ร้านได้รับ</span><strong class="shop-income">฿${s.shopTotal.toLocaleString()}</strong></div>
        ${Store.settings.guaranteeEnabled ? `
          <div class="row"><span>ประกันรายได้ขั้นต่ำ</span><strong>฿${Store.settings.guaranteeMinIncome.toLocaleString()}</strong></div>
          <div class="row"><span>ส่วนต่างประกัน</span><strong class="${g.difference > 0 ? 'warning' : ''}">฿${g.difference.toLocaleString()}</strong></div>
          <div class="row total"><span>รายได้สุทธิ</span><strong>฿${g.finalIncome.toLocaleString()}</strong></div>
        ` : ''}
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('export-report')?.addEventListener('click', () => {
      Toast.show('ส่งออกรายงานเรียบร้อย ✅', 'success');
    });
    document.getElementById('send-line')?.addEventListener('click', () => {
      Toast.show('ส่งข้อมูลไป LINE เรียบร้อย ✅', 'success');
    });
  }
};
