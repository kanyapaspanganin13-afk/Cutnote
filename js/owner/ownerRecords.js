const OwnerRecords = {
  render() {
    const today = Store.getToday();
    const dayRecords = Store.records.filter(r => r.date === today);

    return `
      <div class="records-page">
        <!-- ✅ วันที่ + ประเภทลูกค้า -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div style="background: var(--bg); border: 1px solid var(--border); border-radius:15px; height:55px; position:relative; display:flex; align-items:center; justify-content:center;">
                <span id="dateDisplay" style="font-weight:800; color: var(--text); font-size:18px;">📅 วันที่</span>
                <input type="date" id="dateInp" value="${today}" style="position:absolute; opacity:0; width:100%; height:100%; cursor:pointer; z-index:2;">
            </div>
            <select id="custType" style="width: 100%; height:55px; border-radius:15px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-weight:800; font-size:18px; text-align:center; text-align-last:center; padding: 0 5px; outline:none; appearance:none; cursor:pointer;">
                <option value="none">✳️ ประเภทลูกค้า</option>
                <option value="new">🌟 ลูกค้าใหม่</option>
                <option value="regular">📌 ลูกค้าประจำ</option>
            </select>
        </div>

        <!-- ✅ เวลา เริ่ม - เสร็จ -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div style="position:relative;">
                <div style="position:absolute; top:4px; left:10px; font-size:13px; font-weight:700; color: var(--text); opacity: 0.6; z-index:1;">เริ่ม</div>
                <input type="time" id="tStart" class="time-input-custom"
                       style="width:100%; height:55px; border-radius:15px; border: 1px solid var(--border); text-align:center; font-weight:900; background: var(--bg); color: var(--text); padding: 18px 0 0 0; font-size: 22px; outline:none; box-sizing: border-box;">
            </div>
            <div style="position:relative;">
                <div style="position:absolute; top:4px; left:10px; font-size:13px; font-weight:700; color: var(--text); opacity: 0.6; z-index:1;">เสร็จ</div>
                <input type="time" id="tEnd" class="time-input-custom"
                       style="width:100%; height:55px; border-radius:15px; border: 1px solid var(--border); text-align:center; font-weight:900; background: var(--bg); color: var(--text); padding: 18px 0 0 0; font-size: 22px; outline:none; box-sizing: border-box;">
            </div>
        </div>

        <!-- ✅ เลือกทรงผม + บริการเพิ่ม 1-2 -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <select id="hairStyle" style="height:70px; border-radius:15px; border: 1px solid var(--border); font-weight:700; background: var(--bg); color: var(--text); padding:0 8px; font-size:22px; outline:none;">
                <option value="">✂️ ทรงผม</option>
                <option>แฟชั่น</option>
                <option>สกินเฟด</option>
                <option>รองทรง</option>
                <option>ตำรวจ/ทหาร</option>
                <option>นักเรียน</option>
                <option>ซอยผม/เล็มผม</option>
                <option>แก้ผม</option>
                <option>โกนผม</option>    
            </select>
            <select id="extra1" style="height:70px; border-radius:15px; border: 1px solid var(--border); font-weight:700; background: var(--bg); color: var(--text); padding:0 5px; font-size:22px; outline:none;">
                <option value="">➕ บริการ 1</option>
                <option value="เด็ก">เด็ก</option>
                <option>โกนหนวด</option>
                <option>กันหน้า</option>
                <option>กันจอน</option>
                <option>สระผม</option>
                <option>ย้อมผม</option>
                <option>ดัดผม</option>
                <option>ย้อมแฟชั่น</option>
                <option>แคะหู</option>
            </select>
            <select id="extra2" style="height:70px; border-radius:15px; border: 1px solid var(--border); font-weight:700; background: var(--bg); color: var(--text); padding:0 5px; font-size:22px; outline:none;">
                <option value="">➕ บริการ 2</option>
                <option value="เด็ก">เด็ก</option>
                <option>โกนหนวด</option>
                <option>กันหน้า</option>
                <option>กันจอน</option>
                <option>สระผม</option>
                <option>ย้อมผม</option>
                <option>ดัดผม</option>
                <option>ย้อมแฟชั่น</option>
                <option>แคะหู</option>
            </select>
        </div>

        <!-- ✅ ราคา + ทิปโอน -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px; margin-bottom: 15px; height: 95px; align-items: stretch;">
            <div style="position: relative; background: var(--bg); border: 2px solid var(--accent); border-radius: 20px; display: flex; align-items: center; overflow: hidden;">
                <span style="padding-left: 12px; font-size: 45px; color: var(--accent); font-weight: 900;">฿</span>
                <input type="number" id="priceInp" placeholder="0" inputmode="numeric" 
                       style="width: 100%; height: 100%; border: none; background: transparent; font-size: 50px; font-weight: 900; color: var(--text); outline: none; padding-right: 15px; text-align: right;">
            </div>
            <input type="number" id="tipInp" placeholder="ทิปโอน" inputmode="numeric" 
                   style="width: 100%; height: 100%; background: rgba(225, 245, 254, 0.1); border: 2px solid var(--accent); border-radius: 20px; font-size: 28px; font-weight: 900; color: #ad2c18; text-align: center; outline: none; box-sizing: border-box;">
        </div>

        <!-- ✅ ช่องทางชำระ + ปุ่มบันทึก -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; margin-bottom: 12px; height: 80px;">
            <div style="position: relative; width: 100%; height: 100%;">
                <select id="payTypeSelect" style="width: 100%; height: 100%; border-radius: 18px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-weight: 800; font-size: 16px; text-align: center; text-align-last: center; padding: 0 10px; outline: none; appearance: none; cursor: pointer;">
                    <option value="">วิธีชำระเงิน</option>
                    <option value="Cash">💶 เงินสด</option>
                    <option value="Trans">📱 โอน/สแกน</option>
                    <option value="Mix">🌓 ผสม</option>
                    <option value="Free">🎁 ใช้สิทธิฟรี</option>
                    <option value="Free-Cash">🎁 ฟรี + 💶 เงินสด</option>
                    <option value="Free-Trans">🎁 ฟรี + 📱 เงินโอน</option>
                </select>
            </div>
            <button class="btn-pay" id="barber-save-btn" style="width: 100%; height: 100%; margin: 0; border-radius: 18px; background: #1e3a8a; color: white; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; font-weight: 900; cursor: pointer;">
                <span>บันทึกข้อมูล</span>
            </button>
        </div>

        <!-- ✅ ช่องใส่เงินผสม (ซ่อนก่อน) -->
        <div id="mixPanel" style="display: none; background: var(--input-bg); padding: 15px; border-radius: 20px; border: 2px dashed var(--accent); margin: 15px 0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 800; color: var(--cash2); text-align: center; margin-bottom: 5px;">ระบุเงินสด</label>
                    <input type="number" id="mixCash" placeholder="0" inputmode="numeric" style="width: 100%; height: 60px; border-radius: 15px; border: 1px solid var(--border); text-align: center; font-size: 32px; font-weight: 900; background: var(--card); color: var(--text); outline: none;">
                </div>
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 800; color: var(--trans2); text-align: center; margin-bottom: 5px;">ระบุเงินโอน</label>
                    <input type="number" id="mixTrans" placeholder="0" inputmode="numeric" style="width: 100%; height: 60px; border-radius: 15px; border: 1px solid var(--border); text-align: center; font-size: 32px; font-weight: 900; background: var(--card); color: var(--text); outline: none;">
                </div>
            </div>
        </div>

        <!-- ✅ รายการบันทึกประจำวัน -->
        <section class="card list-card" style="margin-top: 20px;">
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
    // กดปุ่มบันทึกข้อมูล
    document.getElementById('barber-save-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.addRecord();
    });

    // แสดง/ซ่อนช่องกรอกเงินผสม เมื่อเลือกประเภทชำระเงิน
    document.getElementById('payTypeSelect')?.addEventListener('change', (e) => {
      const mixPanel = document.getElementById('mixPanel');
      if (mixPanel) {
        mixPanel.style.display = e.target.value === 'Mix' ? 'block' : 'none';
      }
    });

    // อัปเดตข้อความวันที่เมื่อเปลี่ยนค่า
    document.getElementById('dateInp')?.addEventListener('change', (e) => {
      const dateDisplay = document.getElementById('dateDisplay');
      if (dateDisplay) {
        const d = new Date(e.target.value);
        dateDisplay.textContent = '📅 ' + d.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
      }
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteRecord(e.target.dataset.id));
    });
  },

  addRecord() {
    const dateVal = document.getElementById('dateInp')?.value || Store.getToday();
    const custTypeSelect = document.getElementById('custType');
    const customerType = custTypeSelect ? (custTypeSelect.value === 'none' ? 'regular' : custTypeSelect.value) : 'regular';
    const tStart = document.getElementById('tStart')?.value || '';
    const tEnd = document.getElementById('tEnd')?.value || '';
    const hairStyle = document.getElementById('hairStyle')?.value || '';
    const extra1 = document.getElementById('extra1')?.value || '';
    const extra2 = document.getElementById('extra2')?.value || '';
    const price = Number(document.getElementById('priceInp')?.value) || 0;
    const tip = Number(document.getElementById('tipInp')?.value) || 0;
    const payType = document.getElementById('payTypeSelect')?.value || 'Cash';

    let serviceParts = [];
    if (hairStyle) serviceParts.push(hairStyle);
    if (extra1) serviceParts.push(extra1);
    if (extra2) serviceParts.push(extra2);
    const service = serviceParts.length > 0 ? serviceParts.join(' + ') : 'บริการ';

    let paymentMethod = 'cash';
    if (payType === 'Cash') paymentMethod = 'cash';
    else if (payType === 'Trans' || payType === 'Free-Trans') paymentMethod = 'transfer';
    else if (payType === 'Mix') paymentMethod = 'mixed';
    else if (payType.startsWith('Free')) paymentMethod = 'free';

    const totalAmount = price + tip;
    const split = Calculations.splitIncome(totalAmount);

    const record = {
      id: Store.generateId(),
      date: dateVal,
      time: Store.getNowTime(),
      timeStart: tStart,
      timeEnd: tEnd,
      service: service,
      price: totalAmount,
      tip: tip,
      customerType: customerType,
      paymentMethod: paymentMethod,
      payType: payType,
      barber: Store.currentBarber || '',
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
