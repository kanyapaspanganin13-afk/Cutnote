const BarberAccount = {
  render(data = {}) {
    const {
      oldBalance = 0,
      todayBalance = 0,
      totalBalance = 0,
      currentDate = new Date().toISOString().split('T')[0],
      formattedDate = '00/00/0000',
      statusText = 'กำลังคำนวณ...'
    } = data;

    return `
      <div id="p3" class="page" style="width: 100%; max-width: 480px; margin: 0 auto; padding: 12px; padding-bottom: 20px; background: var(--bg); min-height: fit-content; overflow-x: hidden; transition: 0.3s;">
        <div class="card" style="background: var(--card); border-radius:25px; padding:20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border:1px solid var(--border); margin-bottom: 15px; height: auto;">
          
          <!-- สถานะบัญชี Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <b style="font-size:22px; color: var(--accent);"><i class="fas fa-wallet"></i> สถานะบัญชี</b>
            <div id="accLight" style="background:var(--success); width:10px; height:10px; border-radius:50%; box-shadow:0 0 8px #22c55e;"></div>
          </div>

          <!-- ค้างเดิม & ยอดวันนี้ -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div style="background: var(--bg); border-radius:18px; padding:12px; text-align:center; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              <small style="font-size:12px; color: var(--text); opacity: 0.6; font-weight:700;">ค้างเดิม</small>
              <b style="font-size:18px; color: var(--text); display:block;" id="accOldVal">฿${oldBalance.toLocaleString()}</b>
            </div>
            <div style="background: var(--bg); border-radius:18px; padding:12px; text-align:center; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              <small id="accDateLabel" style="font-size:12px; color: var(--text); opacity: 0.6; font-weight:700;">${formattedDate}</small>
              <b style="font-size:18px; color: var(--text); display:block;" id="accTodayVal">฿${todayBalance.toLocaleString()}</b>
            </div>
          </div>

          <!-- แสดงยอดรวมเคลียร์สุทธิ -->
          <div style="background: var(--bg); border-radius:22px; padding:20px; text-align:center; margin-bottom:15px; border: 1px solid var(--border);">
            <div id="statusBadge" style="display:inline-block; padding:4px 12px; border-radius:10px; font-size:12px; font-weight:700; margin-bottom:8px; background: var(--card); color: var(--text);">${statusText}</div>
            <div style="font-size:32px; font-weight:900; color: var(--text);" id="accTotalVal">฿${totalBalance.toLocaleString()}</div>
          </div>

          <!-- ฟอร์มระบุวันที่ + หมายเหตุ -->
          <div style="margin-bottom:15px;">
            <div style="display:flex; align-items:center; background: var(--bg); border: 1px solid var(--border); border-radius:15px; padding:0 15px; margin-bottom:8px; height:50px;">
              <i class="fas fa-calendar-alt" style="color: var(--primary);"></i>
              <input type="date" id="accDate" value="${currentDate}" style="flex:1; border:none; background:none; font-size:16px; font-weight:600; padding-left:10px; outline:none; color: var(--text);">
            </div>
            <div style="display:flex; align-items:center; background: var(--bg); border: 1px solid var(--border); border-radius:15px; padding:0 15px; height:50px;">
              <i class="fas fa-pen-nib" style="color: var(--text); opacity: 0.5;"></i>
              <input type="text" id="accNote" placeholder="หมายเหตุ..." style="flex:1; border:none; background:none; font-size:15px; padding-left:10px; outline:none; color: var(--text);">
            </div>
          </div>

          <!-- ปุ่มจัดการเคลียร์เงิน -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <button onclick="clearAccount()" class="btn-clear" style="border:none; border-radius:18px; padding:15px 5px; font-size:14px; cursor:pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <i class="fas fa-check-double"></i> เคลียร์เงิน
            </button>
            <button onclick="openHistoryModal()" class="btn-history" style="border:none; border-radius:18px; padding:15px 5px; font-size:14px; cursor:pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <i class="fas fa-history"></i> ประวัติเคลียร์เงิน
            </button>
          </div>

          <!-- ปุ่มรายงานย้อนหลัง / สรุปประมวลผล -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 15px; margin-bottom: 12px; width: 100%;">
            <div onclick="document.getElementById('histMonth').showPicker()" class="btn-monthly" style="background: linear-gradient(135deg, var(--btn-monthly1), var(--btn-monthly2)); color: var(--btn-text); border-radius:18px; padding:15px 5px; text-align:center; position:relative; box-shadow:0 8px 20px rgba(0,0,0,0.15); cursor:pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--border);">
              <i class="fas fa-calendar-check" style="font-size:20px; margin-bottom:5px;"></i>
              <b style="font-size:11px; white-space: nowrap;">สรุปภาพรวม</b>
              <input type="month" id="histMonth" onchange="loadHistMonth()" style="position:absolute; inset:0; opacity:0; width:100%; height:100%; cursor:pointer;">
            </div>

            <div onclick="document.getElementById('excelMonth').showPicker()" class="btn-excel" style="background: linear-gradient(135deg, var(--btn-clear1), var(--btn-btn-clear2, var(--success))); color: var(--btn-text); border-radius:18px; padding:15px 5px; text-align:center; cursor:pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.3s; position: relative; border: 1px solid var(--border);">
              <i class="fas fa-file-excel" style="font-size:20px; margin-bottom:5px;"></i>
              <b style="font-size:11px; white-space: nowrap;">สรุปรายเดือน</b>
              <input type="month" id="excelMonth" onchange="exportToExcel(this.value)" style="position:absolute; inset:0; opacity:0; width:100%; height:100%; cursor:pointer;">
            </div>

            <div onclick="handleGoogleSheet()" class="btn-sheets" style="background: linear-gradient(135deg, #0F9D58, #0B8043); color: #fff; border-radius:18px; padding:15px 5px; text-align:center; cursor:pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.3s; border: 1px solid rgba(0,0,0,0.1);">
              <i class="fas fa-table" style="font-size:20px; margin-bottom:5px;"></i>
              <b style="font-size:11px; white-space: nowrap;">เปิดSheet</b>
            </div>
          </div>

          <!-- ปุ่มเปรียบเทียบช่วงวันที่ -->
          <div onclick="openComparisonSelector()" class="btn-compare" style="border-radius: 25px; padding: 15px; text-align: center; cursor: pointer; box-shadow: 0 8px 15px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 10px;">
            <i class="fas fa-chart-line" style="font-size: 24px;"></i>
            <b style="font-size: 16px;">เปรียบเทียบช่วงวันที่</b>
          </div>
        </div>
      </div>
    `;
  }
};
