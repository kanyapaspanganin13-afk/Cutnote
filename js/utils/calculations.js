const Calculations = {
  // สัดส่วนแบ่งรายได้: ช่างได้ 50%, ร้านได้ 50% (ปรับในอนาคตได้)
  SPLIT_RATIO_BARBER: 0.50,
  SPLIT_RATIO_SHOP: 0.50,

  splitIncome(totalPrice) {
    const barberIncome = Math.round(totalPrice * this.SPLIT_RATIO_BARBER);
    const shopIncome = Math.round(totalPrice * this.SPLIT_RATIO_SHOP);
    return { barberIncome, shopIncome };
  },

  calcGuarantee(barberTotalIncome, guaranteeMin) {
    if (!Store.settings.guaranteeEnabled || guaranteeMin <= 0) {
      return { applicable: false, difference: 0, finalIncome: barberTotalIncome };
    }
    const difference = Math.max(0, guaranteeMin - barberTotalIncome);
    return {
      applicable: difference > 0,
      difference,
      finalIncome: barberTotalIncome + difference
    };
  },

  summarizeRecords(records) {
    const totalSales = records.reduce((sum, r) => sum + Number(r.price), 0);
    const barberTotal = records.reduce((sum, r) => sum + (Number(r.barberIncome) || 0), 0);
    const shopTotal = records.reduce((sum, r) => sum + (Number(r.shopIncome) || 0), 0);
    const cashTotal = records.filter(r => r.paymentMethod === 'cash').reduce((sum, r) => sum + Number(r.price), 0);
    const transferTotal = records.filter(r => r.paymentMethod === 'transfer').reduce((sum, r) => sum + Number(r.price), 0);
    const newCustomers = records.filter(r => r.customerType === 'new').length;
    const regularCustomers = records.filter(r => r.customerType === 'regular').length;

    return {
      count: records.length,
      totalSales,
      barberTotal,
      shopTotal,
      cashTotal,
      transferTotal,
      newCustomers,
      regularCustomers
    };
  }
};
