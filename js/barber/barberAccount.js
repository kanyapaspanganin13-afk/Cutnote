const BarberAccount = {
  render() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);
    const daySum = Calculations.summarizeRecords(dayRecords);
    const lastSettlement = Store.settlements.at(-1);
    const previousBalance = lastSettlement ? Number(lastSettlement.remainingBalance) : 0;
    const guarantee = Calculations.calcGuarantee(daySum.barberTotal, Store.settings.guaranteeMinIncome);
    const totalToSettle = previousBalance + daySum.barberTotal + guarantee.difference;

    return `
      <div class="account-page">
        <section class="card">
          <h2 class="card-title">📒 บัญชี & การเคลียร์เงิน</h2>
          <div class="account-summary">
            <div class="acc-row"><span>ยอดค้างจากครั้งก่อน</span><strong>฿${previousBalance.toLocaleString()}</strong></div>
            <div class="acc-row"><span>รายได้วันนี้</span><strong>฿${daySum.barberTotal.toLocaleString()}</strong></div>
            ${guarantee.difference > 0 ? `<div class="acc-row warning"><span>ส่วนต่างประกันรายได้</span><strong>+฿${guarantee.difference.toLocaleString()}</strong></div>` : ''}
            <div class="acc-row total"><span>ยอดที่ต้องเคลียร์ทั้งหมด</span><strong>฿${totalToSettle.toLocaleString()}</strong></div>
          </div>
          <form id="settle-form" class="mt-16">
            <div class="form-group">
              <label>จำนวนที่เคลียร์ (฿)</label>
              <input type="number" id="cleared-amount" min="0" max="${totalToSettle}" value="${totalToSettle}">
            </div>
            <div class="form-group">
              <label>หมายเหตุ</label>
              <input type="text" id="note" placeholder="ระบุเพิ่มเติม (ถ้ามี)">
            </div>
            <button type="submit" class="btn primary-btn full-width mt-8">✅ บันทึกการเคลียร์เงิน</button>
          </form>
        </section>

        <section class="card">
          <h2 class="card-title">📋 ประวัติการเคลียร์</h2>
          <div class="history-list">
            ${Store.settlements.length === 0 ? '<p class="empty-text">ยังไม่มีประวัติ</p>' :
              Store.settlements.slice().reverse().map(s => `
                <div class="history-item">
                  <div class="hist-date">${s.date}</div>
                  <div class="hist-detail">
                    เคลียร์: ฿${Number(s.clearedAmount).toLocaleString()} | คงเหลือ: ฿${Number(s.remainingBalance).toLocaleString()}
                    ${s.note ? `<br><small>หมายเหตุ: ${s.note}</small>` : ''}
                  </div>
                </div>
              `).join('')
            }
          </div>
        </section>
      </div>
    `;
  },

  bindEvents() {
    document.getElementById('settle-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.settle();
    });
  },

  settle() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);
    const daySum = Calculations.summarizeRecords(dayRecords);
    const lastSettlement = Store.settlements.at(-1);
    const previousBalance = lastSettlement ? Number(lastSettlement.remainingBalance) : 0;
    const guarantee = Calculations.calcGuarantee(daySum.barberTotal, Store.settings.guaranteeMinIncome);
    const totalToSettle = previousBalance + daySum.barberTotal + guarantee.difference;
    const cleared = Math.min(Number(document.getElementById('cleared-amount').value) || 0, totalToSettle);
    const remaining = Math.max(0, totalToSettle - cleared);

    if (cleared < 0) {
      Toast.show('จำนวนเคลียร์ต้องไม่ติดลบ ❌', 'error');
      return;
    }

    const settlement = {
      id: Store.generateId(),
      date: today,
      previousBalance,
      todayTotal: daySum.barberTotal + guarantee.difference,
      totalToSettle,
      clearedAmount: cleared,
      remainingBalance: remaining,
      clearedAt: new Date().toISOString(),
      note: document.getElementById('note').value.trim()
    };

    Store.settlements.push(settlement);
    Store.saveSettlements();
    Toast.show(`เคลียร์เงิน ฿${cleared.toLocaleString()} คงเหลือ ฿${remaining.toLocaleString()} ✅`, 'success');
    App.route();
  }
};
