/**
 * Shared Calculation Engine
 * รับผิดชอบคำนวณรายรับ ส่วนแบ่ง ประกันรายได้ และสถานะโปรโมชัน 5 ฟรี 1
 */

export const Calculations = {
  /**
   * คำนวณส่วนแบ่งการบริการ (สำหรับ Barber Mode)
   * @param {number} price - ราคาบริการ
   * @param {number} commissionPercent - เปอร์เซ็นต์ส่วนแบ่งของช่าง
   * @returns {{barberShare: number, shopShare: number}}
   */
  calculateCommission(price, commissionPercent) {
    const validPrice = Number(price) || 0;
    const validPercent = Number(commissionPercent) || 0;

    const barberShare = Math.round(validPrice * (validPercent / 100));
    const shopShare = validPrice - barberShare;

    return { barberShare, shopShare };
  },

  /**
   * ตรวจสอบสิทธิ์โปรโมชัน 5 ฟรี 1
   * @param {number} visitCount - จำนวนครั้งที่มาใช้บริการสะสม
   * @returns {boolean}
   */
  checkFiveFreeOneEligibility(visitCount) {
    const count = Number(visitCount) || 0;
    return count > 0 && count % 5 === 0;
  },

  /**
   * คำนวณสรุปยอดรายได้ประจำวัน
   * @param {Array} transactions - รายการบริการทั้งหมดของวัน
   * @param {number} commissionPercent - % ช่าง (กรณี Barber Mode)
   * @returns {Object}
   */
  calculateDailySummary(transactions = [], commissionPercent = 0) {
    let totalRevenue = 0;
    let cashTotal = 0;
    let transferTotal = 0;
    let totalBarberShare = 0;
    let totalShopShare = 0;
    let freeCount = 0;

    transactions.forEach(tx => {
      const price = Number(tx.price) || 0;
      totalRevenue += price;

      // จัดกลุ่มวิธีชำระเงิน
      if (tx.paymentMethod === 'CASH') cashTotal += price;
      else if (tx.paymentMethod === 'TRANSFER') transferTotal += price;
      else if (tx.paymentMethod.startsWith('FREE')) freeCount++;

      // ส่วนแบ่ง (ถ้ามี)
      if (tx.barberShare !== undefined && tx.shopShare !== undefined) {
        totalBarberShare += tx.barberShare;
        totalShopShare += tx.shopShare;
      } else {
        const { barberShare, shopShare } = this.calculateCommission(price, commissionPercent);
        totalBarberShare += barberShare;
        totalShopShare += shopShare;
      }
    });

    return {
      totalRevenue,
      cashTotal,
      transferTotal,
      totalBarberShare,
      totalShopShare,
      customerCount: transactions.length,
      freeCount
    };
  },

  /**
   * คำนวณประกันรายได้ช่าง (Guaranteed Income Calculation)
   * @param {number} currentEarnedBarber - รายได้ช่างจริงวันนี้
   * @param {number} guaranteeThreshold - ยอดประกันรายได้
   * @returns {{isEligible: boolean, shortfall: number, finalBarberIncome: number}}
   */
  calculateGuaranteedIncome(currentEarnedBarber, guaranteeThreshold) {
    const earned = Number(currentEarnedBarber) || 0;
    const threshold = Number(guaranteeThreshold) || 0;

    if (earned < threshold) {
      const shortfall = threshold - earned; // ยอดที่ร้านต้องจ่ายชดเชยเพิ่ม
      return {
        isEligible: true,
        shortfall,
        finalBarberIncome: threshold
      };
    }

    return {
      isEligible: false,
      shortfall: 0,
      finalBarberIncome: earned
    };
  },

  /**
   * คำนวณยอดค้างจ่ายช่างสะสม (Uncleared Balance)
   * @param {Array} transactions - รายการงานทั้งหมด
   * @param {Array} clearances - ประวัติการเคลียร์เงินทั้งหมด
   * @returns {number}
   */
  calculateUnclearedBalance(transactions = [], clearances = []) {
    const totalEarned = transactions.reduce((sum, tx) => sum + (tx.barberShare || 0), 0);
    const totalCleared = clearances.reduce((sum, cl) => sum + (cl.amountCleared || 0), 0);

    return Math.max(0, totalEarned - totalCleared);
  }
};
