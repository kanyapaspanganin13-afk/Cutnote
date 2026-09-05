const BarberDailyReport = {
  render(data = {}) {
    const {
      totalAmount = 0,
      customerCount = 0,
      transAmount = 0,
      cashAmount = 0,
      barberShare = 0,
      shopShare = 0,
      settleBarHtml = '',
      statsHtml = '',
      recordsListHtml = ''
    } = data;

    return `
      <div id="p2" class="page" style="width: 98%; max-width: 480px; margin:0 auto; padding: 15px; background: var(--card); border: 1px solid var(--border); border-radius: 25px;">
        <!-- Card สรุปยอดรวมประจำวัน -->
        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 10px; margin-bottom: 15px; align-items: stretch;">
          <div style="background: linear-gradient(135deg, var(--primary), var(--accent)); padding:15px 10px; border-radius:20px; text-align:center; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); border: 1px solid var(--border); display: flex; flex-direction: column; justify-content: center; align-items: center; transition: 0.3s;">
            <small style="font-weight:800; color: var(--btn-text); opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; font-size: 14px;">ยอดรวมวันนี้</small>
            <div id="dTotal" style="font-size:42px; font-weight:900; color: var(--btn-text); margin: 5px 0; letter-spacing: -1px; line-height: 1;">${totalAmount.toLocaleString()}</div>
            <div id="dCounts" style="font-size:13px; font-weight:700; color: var(--btn-text); background:rgba(255,255,255,0.2); display:inline-block; padding:4px 10px; border-radius:12px; width: fit-content;">ลูกค้า ${customerCount} คน</div>
          </div>

          <div style="background: var(--card); padding:12px 15px; border-radius:20px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid var(--border); display:flex; flex-direction:column; justify-content:space-between; gap:5px; transition: 0.3s;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:16px; font-weight:700;">
              <span style="color: var(--text); opacity: 0.7; display:flex; align-items:center; gap:5px;">
                <i class="fas fa-mobile-alt" style="width:14px; color: var(--trans1);"></i> โอน
              </span>
              <b id="dTrans" style="color: var(--text);">${transAmount.toLocaleString()}</b>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:16px; font-weight:700;">
              <span style="color: var(--text); opacity: 0.7; display:flex; align-items:center; gap:5px;">
                <i class="fas fa-money-bill-wave" style="width:14px; color: var(--cash1);"></i> สด
              </span>
              <b id="dCash" style="color: var(--text);">${cashAmount.toLocaleString()}</b>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:16px; font-weight:700;">
              <span style="color: var(--text); opacity: 0.7; display:flex; align-items:center; gap:5px;">
                <i class="fas fa-cut" style="width:14px; color: var(--accent);"></i> ช่าง
              </span>
              <b id="dBarber" style="color: var(--text);">${barberShare.toLocaleString()}</b>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:16px; font-weight:800; border-top: 1px dashed var(--border); padding-top: 5px; margin-top: 2px;">
              <span style="color: var(--text); display:flex; align-items:center; gap:5px;">
                <i class="fas fa-store" style="width:14px; color: var(--danger);"></i> ร้าน
              </span>
              <b id="dShop" style="color: var(--text);">${shopShare.toLocaleString()}</b>
            </div>
          </div>
        </div>

        <!-- Progress/Settle Bar Container -->
        <div id="settleBarContainer" style="margin-bottom:18px;">
          <div id="settleBar">${settleBarHtml}</div>
        </div>

        <!-- รายละเอียด/สถิติบริการ -->
        <div id="dServiceStats">${statsHtml}</div>

        <hr style="border:0; border-top:1px solid var(--border); margin-top:15px;">

        <!-- ตาราง/รายการประจำวัน -->
        <div id="dailyList" style="color: var(--text);">${recordsListHtml}</div>
      </div>
    `;
  }
};
