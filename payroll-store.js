/**
 * MKC Payroll Store - Shared localStorage layer
 * Đồng bộ dữ liệu giữa tất cả pages trong hệ thống tiền lương VP Campuchia
 *
 * @version 1.0.0
 * @author EcoTech 2A
 */

(function(window) {
  'use strict';

  const STORAGE_PREFIX = 'mkc_payroll_';
  const CFG = window.MKC_PAYROLL_VP_CONFIG || {};

  // ============================================================
  // STORAGE UTILS
  // ============================================================
  const storage = {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(STORAGE_PREFIX + key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('Storage get error:', key, e);
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('Storage set error:', key, e);
        return false;
      }
    },
    remove(key) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    },
    clear() {
      Object.keys(localStorage)
        .filter(k => k.startsWith(STORAGE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    }
  };

  // ============================================================
  // RESPONSE DATA FORMAT (khớp backend API)
  // ============================================================
  function wrapResponse(data, data2nd = null) {
    return {
      result: 1,
      time: Math.floor(Date.now() / 1000),
      data,
      data2nd,
      error: { code: 200, message: '' }
    };
  }

  function wrapError(code, message) {
    return {
      result: 0,
      time: Math.floor(Date.now() / 1000),
      data: null,
      error: { code, message }
    };
  }

  // ============================================================
  // EMPLOYEE STORE
  // ============================================================
  const employeeStore = {
    KEY: 'employees',

    init() {
      if (!storage.get(this.KEY)) {
        // Seed từ payroll-vp-config.js
        const seed = (CFG.payrollRows || []).map((row, idx) => ({
          id: idx + 1,
          code: row.code,
          name: row.name,
          department: row.department,
          passport: row.passport,
          email: (row.code || '').toLowerCase() + '@vrg-mkc.com',
          baseSalary: row.baseSalary || 0,
          coefficient: row.coefficient || 0,
          positionAllowanceFactor: row.positionAllowanceFactor || 0,
          areaAllowanceFactor: row.areaAllowanceFactor || 0,
          // OQ-006: Người phụ thuộc cho FamilyRebate
          dependents: row.dependents || 0,
          spouseNoIncome: row.spouseNoIncome || false,
          // OQ-017: NV ở KTX có bill điện
          ktxResident: row.electricity > 0 || row.electricitySheetAmount > 0,
          status: 1,
          createdAt: new Date().toISOString()
        }));
        storage.set(this.KEY, seed);
      }
      return this;
    },

    getAll() {
      return storage.get(this.KEY, []).filter(e => e.status !== -1);
    },

    getById(id) {
      return this.getAll().find(e => e.id === id) || null;
    },

    getByCode(code) {
      return this.getAll().find(e => e.code === code) || null;
    },

    create(data) {
      const list = storage.get(this.KEY, []);
      if (list.some(e => e.code === data.code && e.status !== -1)) {
        return wrapError(409, 'Mã nhân viên đã tồn tại');
      }
      const maxId = list.length > 0 ? Math.max(...list.map(e => e.id)) : 0;
      const newEmp = {
        id: maxId + 1,
        ...data,
        status: 1,
        createdAt: new Date().toISOString()
      };
      list.push(newEmp);
      storage.set(this.KEY, list);
      return wrapResponse(newEmp);
    },

    update(id, data) {
      const list = storage.get(this.KEY, []);
      const idx = list.findIndex(e => e.id === id);
      if (idx === -1) return wrapError(404, 'Không tìm thấy nhân viên');
      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      storage.set(this.KEY, list);
      return wrapResponse(list[idx]);
    },

    delete(id) {
      const list = storage.get(this.KEY, []);
      const idx = list.findIndex(e => e.id === id);
      if (idx === -1) return wrapError(404, 'Không tìm thấy nhân viên');
      list[idx].status = -1;
      list[idx].updatedAt = new Date().toISOString();
      storage.set(this.KEY, list);
      return wrapResponse(true);
    }
  };

  // ============================================================
  // ATTENDANCE STORE (OQ-020: Ký hiệu chấm công)
  // ============================================================
  const attendanceStore = {
    KEY: 'attendance',

    // Ký hiệu chấm công chuẩn (OQ-020)
    SYMBOLS: CFG.attendanceSymbols || [
      { code: 'X', name: 'Công ngày', value: 1, isPaid: true },
      { code: 'Ro', name: 'Việc riêng', value: 0, isPaid: false },
      { code: 'PN', name: 'Phép năm', value: 1, isPaid: true, category: 'leave' },
      { code: 'CT', name: 'Công tác', value: 1, isPaid: true },
      { code: 'R', name: 'Lễ/Tết', value: 1, isPaid: true, category: 'holiday' },
      { code: 'R1', name: 'Trực Lễ/Tết', value: 1, isPaid: true, category: 'holiday', hasOT: true },
      { code: 'H', name: 'Học tập', value: 1, isPaid: true },
      { code: 'O', name: 'Nghỉ ốm', value: 0, isPaid: false, category: 'sick' }
    ],

    init() {
      if (!storage.get(this.KEY)) {
        storage.set(this.KEY, {});
      }
      return this;
    },

    // Lấy chấm công theo kỳ và nhân viên
    get(period, empCode) {
      const data = storage.get(this.KEY, {});
      return (data[period] && data[period][empCode]) || null;
    },

    // Lưu chấm công cho nhân viên
    set(period, empCode, days) {
      const data = storage.get(this.KEY, {});
      if (!data[period]) data[period] = {};
      data[period][empCode] = {
        days, // { 1: 'X', 2: 'X', 3: 'Ro', ... }
        updatedAt: new Date().toISOString()
      };
      storage.set(this.KEY, data);
      return wrapResponse(data[period][empCode]);
    },

    // Tổng hợp công theo kỳ
    summarize(period, empCode) {
      const record = this.get(period, empCode);
      if (!record) return null;

      const summary = {
        totalDays: 0,
        paidDays: 0,
        holidayDays: 0,
        leaveDays: 0,
        sickDays: 0,
        unpaidDays: 0
      };

      Object.values(record.days || {}).forEach(symbol => {
        const sym = this.SYMBOLS.find(s => s.code === symbol);
        if (!sym) return;
        summary.totalDays++;
        if (sym.isPaid) summary.paidDays += sym.value;
        if (sym.category === 'holiday') summary.holidayDays++;
        if (sym.category === 'leave') summary.leaveDays++;
        if (sym.category === 'sick') summary.sickDays++;
        if (!sym.isPaid) summary.unpaidDays++;
      });

      return summary;
    }
  };

  // ============================================================
  // PAYROLL STORE
  // ============================================================
  const payrollStore = {
    KEY: 'payroll',

    init() {
      if (!storage.get(this.KEY)) {
        // Seed từ config
        const seed = {};
        const period = CFG.period?.code || '2026-01';
        seed[period] = {
          status: 'pending', // pending | approved | rejected
          currentStep: 1, // 1-4 theo workflow
          employees: (CFG.payrollRows || []).map(row => ({
            code: row.code,
            name: row.name,
            department: row.department,
            // Thu nhập
            baseSalary: row.baseSalary || 0,
            actualDays: row.actualDays || 0,
            holidayDays: row.holidayDays || 0,
            leaveDays: row.leaveDays || 0,
            timeSalary: row.timeSalary || 0,
            meal: row.meal || 0,
            house: row.house || 0,
            leaveSalary: row.leaveSalary || 0,
            holidaySalary: row.holidaySalary || 0,
            holidayBonus: row.holidayBonus || 0,
            seniorityNonTaxable: row.seniorityNonTaxable || 0, // OQ-013: Cột Q
            seniorityTaxable: row.seniorityTaxable || 0, // OQ-013: Cột R
            gross: row.gross || 0,
            // Khấu trừ
            advance: row.advance || 0,
            otherTax: row.otherTax || 0,
            pit: row.pit || 0, // OQ-006: Đã tính FamilyRebate
            unionFee: row.unionFee || 0, // OQ-018
            visaWorkPermit: row.visaWorkPermit || 0,
            unionHouse: row.unionHouse || 0,
            nssf: row.nssf || 0, // OQ-001: Pension 2%
            socialInsurance: row.socialInsurance || 0, // OQ-003: BHXH NLĐ 8%
            healthInsurance: row.healthInsurance || 0, // OQ-003: BHYT NLĐ 1.5%
            electricity: row.electricity || 0, // OQ-017
            // Thực lĩnh
            netPay: row.netPay || 0
          })),
          totals: CFG.totals || {},
          createdAt: new Date().toISOString()
        };
        storage.set(this.KEY, seed);
      }
      return this;
    },

    getByPeriod(period) {
      const data = storage.get(this.KEY, {});
      return data[period] || null;
    },

    getEmployeePayroll(period, empCode) {
      const periodData = this.getByPeriod(period);
      if (!periodData) return null;
      return periodData.employees.find(e => e.code === empCode) || null;
    },

    updateEmployeePayroll(period, empCode, updates) {
      const data = storage.get(this.KEY, {});
      if (!data[period]) return wrapError(404, 'Không tìm thấy kỳ lương');

      const idx = data[period].employees.findIndex(e => e.code === empCode);
      if (idx === -1) return wrapError(404, 'Không tìm thấy nhân viên trong kỳ');

      data[period].employees[idx] = {
        ...data[period].employees[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Recalc totals
      this._recalcTotals(data[period]);
      storage.set(this.KEY, data);
      return wrapResponse(data[period].employees[idx]);
    },

    // Duyệt bảng lương (workflow 4 bước)
    approve(period, step, note = '') {
      const data = storage.get(this.KEY, {});
      if (!data[period]) return wrapError(404, 'Không tìm thấy kỳ lương');

      if (step >= 4) {
        data[period].status = 'approved';
        data[period].currentStep = 4;
      } else {
        data[period].currentStep = step + 1;
      }
      data[period].approvalNote = note;
      data[period].approvedAt = new Date().toISOString();
      storage.set(this.KEY, data);
      return wrapResponse(data[period]);
    },

    reject(period, step, reason) {
      const data = storage.get(this.KEY, {});
      if (!data[period]) return wrapError(404, 'Không tìm thấy kỳ lương');

      data[period].status = 'rejected';
      data[period].rejectReason = reason;
      data[period].rejectedAt = new Date().toISOString();
      storage.set(this.KEY, data);
      return wrapResponse(data[period]);
    },

    _recalcTotals(periodData) {
      const emps = periodData.employees || [];
      periodData.totals = {
        employeeCount: emps.length,
        gross: emps.reduce((s, e) => s + (e.gross || 0), 0),
        timeSalary: emps.reduce((s, e) => s + (e.timeSalary || 0), 0),
        meal: emps.reduce((s, e) => s + (e.meal || 0), 0),
        house: emps.reduce((s, e) => s + (e.house || 0), 0),
        advance: emps.reduce((s, e) => s + (e.advance || 0), 0),
        pit: emps.reduce((s, e) => s + (e.pit || 0), 0),
        netPay: emps.reduce((s, e) => s + (e.netPay || 0), 0)
      };
    }
  };

  // ============================================================
  // DEDUCTION STORE (OQ-007, OQ-017, OQ-018)
  // ============================================================
  const deductionStore = {
    KEY: 'deductions',

    TYPES: CFG.deductionTypes || [],

    init() {
      if (!storage.get(this.KEY)) {
        storage.set(this.KEY, []);
      }
      return this;
    },

    getAll(period = null) {
      let list = storage.get(this.KEY, []).filter(d => d.status !== -1);
      if (period) list = list.filter(d => d.period === period);
      return list;
    },

    getByEmployee(empCode, period = null) {
      return this.getAll(period).filter(d => d.empCode === empCode);
    },

    // OQ-007: Thuế TN khác cần chứng từ + workflow duyệt
    create(data) {
      const list = storage.get(this.KEY, []);
      const maxId = list.length > 0 ? Math.max(...list.map(d => d.id)) : 0;

      const newDed = {
        id: maxId + 1,
        ...data,
        status: 1,
        // OQ-007: Nếu là OTHER_TAX thì cần duyệt
        approvalStatus: data.type === 'OTHER_TAX' ? 'pending' : 'approved',
        createdAt: new Date().toISOString()
      };

      list.push(newDed);
      storage.set(this.KEY, list);
      return wrapResponse(newDed);
    },

    update(id, data) {
      const list = storage.get(this.KEY, []);
      const idx = list.findIndex(d => d.id === id);
      if (idx === -1) return wrapError(404, 'Không tìm thấy khoản khấu trừ');

      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      storage.set(this.KEY, list);
      return wrapResponse(list[idx]);
    },

    // OQ-007: Duyệt thuế TN khác
    approve(id, approvedBy) {
      return this.update(id, {
        approvalStatus: 'approved',
        approvedBy,
        approvedAt: new Date().toISOString()
      });
    },

    reject(id, reason, rejectedBy) {
      return this.update(id, {
        approvalStatus: 'rejected',
        rejectReason: reason,
        rejectedBy,
        rejectedAt: new Date().toISOString()
      });
    },

    delete(id) {
      const list = storage.get(this.KEY, []);
      const idx = list.findIndex(d => d.id === id);
      if (idx === -1) return wrapError(404, 'Không tìm thấy khoản khấu trừ');

      list[idx].status = -1;
      list[idx].updatedAt = new Date().toISOString();
      storage.set(this.KEY, list);
      return wrapResponse(true);
    }
  };

  // ============================================================
  // ELECTRICITY STORE (OQ-017)
  // ============================================================
  const electricityStore = {
    KEY: 'electricity',

    CONFIG: CFG.electricityConfig || {
      freeQuotaKwh: 20,
      unitPriceRanges: [
        { maxKwh: 50, priceKHR: 480 },
        { maxKwh: 100, priceKHR: 540 },
        { maxKwh: null, priceKHR: 610 }
      ]
    },

    init() {
      if (!storage.get(this.KEY)) {
        // Seed từ config
        const seed = (CFG.electricityRows || []).map((row, idx) => ({
          id: idx + 1,
          empCode: row.code,
          empName: row.name,
          period: CFG.period?.code || '2026-01',
          kwh: row.kw || 0,
          freeKwh: this.CONFIG.freeQuotaKwh,
          billableKwh: row.billableKw || Math.max(0, (row.kw || 0) - this.CONFIG.freeQuotaKwh),
          unitPriceKHR: row.unitPriceKHR || 610,
          amountUsd: row.amountUsd || 0,
          postedToPayroll: false,
          status: 1,
          createdAt: new Date().toISOString()
        }));
        storage.set(this.KEY, seed);
      }
      return this;
    },

    getAll(period = null) {
      let list = storage.get(this.KEY, []).filter(e => e.status !== -1);
      if (period) list = list.filter(e => e.period === period);
      return list;
    },

    getByEmployee(empCode, period = null) {
      return this.getAll(period).filter(e => e.empCode === empCode);
    },

    // Tính tiền điện theo OQ-017
    calculate(kwh) {
      const billable = Math.max(0, kwh - this.CONFIG.freeQuotaKwh);
      let priceKHR = 610;
      for (const range of this.CONFIG.unitPriceRanges) {
        if (range.maxKwh === null || kwh <= range.maxKwh) {
          priceKHR = range.priceKHR;
          break;
        }
      }
      const amountKHR = billable * priceKHR;
      const exchangeRate = CFG.period?.exchangeRate || 4026;
      const amountUsd = amountKHR / exchangeRate;

      return {
        kwh,
        freeKwh: this.CONFIG.freeQuotaKwh,
        billableKwh: billable,
        unitPriceKHR: priceKHR,
        amountKHR,
        amountUsd: Math.round(amountUsd * 100) / 100
      };
    },

    create(data) {
      const calc = this.calculate(data.kwh || 0);
      const list = storage.get(this.KEY, []);
      const maxId = list.length > 0 ? Math.max(...list.map(e => e.id)) : 0;

      const newRec = {
        id: maxId + 1,
        empCode: data.empCode,
        empName: data.empName,
        period: data.period,
        ...calc,
        postedToPayroll: false,
        status: 1,
        createdAt: new Date().toISOString()
      };

      list.push(newRec);
      storage.set(this.KEY, list);
      return wrapResponse(newRec);
    },

    update(id, data) {
      const list = storage.get(this.KEY, []);
      const idx = list.findIndex(e => e.id === id);
      if (idx === -1) return wrapError(404, 'Không tìm thấy bản ghi điện');

      // Recalc nếu có kwh mới
      let updates = { ...data };
      if (data.kwh !== undefined) {
        const calc = this.calculate(data.kwh);
        updates = { ...updates, ...calc };
      }

      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      storage.set(this.KEY, list);
      return wrapResponse(list[idx]);
    },

    // Post tiền điện vào bảng lương
    postToPayroll(id) {
      const list = storage.get(this.KEY, []);
      const rec = list.find(e => e.id === id);
      if (!rec) return wrapError(404, 'Không tìm thấy bản ghi điện');

      // Update payroll
      const payrollResult = payrollStore.updateEmployeePayroll(
        rec.period,
        rec.empCode,
        { electricity: rec.amountUsd }
      );

      if (payrollResult.result !== 1) return payrollResult;

      // Mark as posted
      return this.update(id, { postedToPayroll: true });
    }
  };

  // ============================================================
  // TAX STORE (OQ-006: FamilyRebate, OQ-013: Seniority)
  // ============================================================
  const taxStore = {
    KEY: 'tax_records',

    BRACKETS: CFG.taxBrackets || [
      { from: 0, to: 1500000, rate: 0, deduction: 0 },
      { from: 1500001, to: 2000000, rate: 0.05, deduction: 75000 },
      { from: 2000001, to: 8500000, rate: 0.10, deduction: 175000 },
      { from: 8500001, to: 12500000, rate: 0.15, deduction: 600000 },
      { from: 12500001, to: null, rate: 0.20, deduction: 1225000 }
    ],

    FAMILY_DEDUCTION: CFG.familyDeductionConfig || {
      dependentDeductionKHR: 150000,
      spouseNoIncomeKHR: 150000
    },

    // OQ-006: Tính FamilyRebate
    calcFamilyRebate(dependents = 0, spouseNoIncome = false) {
      let total = dependents * this.FAMILY_DEDUCTION.dependentDeductionKHR;
      if (spouseNoIncome) {
        total += this.FAMILY_DEDUCTION.spouseNoIncomeKHR;
      }
      return total;
    },

    // OQ-013: Thu nhập chịu thuế = Gross - Thâm niên không chịu thuế (Cột Q) + Thâm niên chịu thuế (Cột R)
    calcTaxableIncome(gross, seniorityNonTaxable = 0, seniorityTaxable = 0) {
      return gross - seniorityNonTaxable + seniorityTaxable;
    },

    // Tính PIT Campuchia
    calcPIT(taxableIncomeKHR, familyRebateKHR = 0) {
      const netTaxable = Math.max(0, taxableIncomeKHR - familyRebateKHR);

      let tax = 0;
      for (const bracket of this.BRACKETS) {
        if (netTaxable >= bracket.from) {
          if (bracket.to === null || netTaxable <= bracket.to) {
            tax = netTaxable * bracket.rate - bracket.deduction;
            break;
          }
        }
      }

      return {
        taxableIncomeKHR,
        familyRebateKHR,
        netTaxableKHR: netTaxable,
        taxKHR: Math.max(0, tax),
        bracket: this.BRACKETS.find(b => netTaxable >= b.from && (b.to === null || netTaxable <= b.to))
      };
    }
  };

  // ============================================================
  // INSURANCE STORE (OQ-001, OQ-002, OQ-003)
  // ============================================================
  const insuranceStore = {
    RULES: CFG.insuranceRules || {
      nssfPensionEmployeeRate: 0.02,
      nssfPensionEmployerRate: 0.02,
      nssfHealthcareEmployerRate: 0.026,
      nssfFloorKHR: 400000,
      nssfCapKHR: 1200000,
      bhxhEmployeeRate: 0.08,
      bhytEmployeeRate: 0.015
    },

    // OQ-001: Tính NSSF Pension (NLĐ 2%)
    calcNSSFPension(salaryKHR) {
      const capped = Math.min(
        Math.max(salaryKHR, this.RULES.nssfFloorKHR),
        this.RULES.nssfCapKHR
      );
      return capped * this.RULES.nssfPensionEmployeeRate;
    },

    // OQ-003: Tính BHXH NLĐ 8%
    calcBHXH(coefficient, positionAllowance, baseSalaryVND, exchangeRate) {
      const base = (coefficient + positionAllowance) * baseSalaryVND;
      return (base * this.RULES.bhxhEmployeeRate) / exchangeRate;
    },

    // OQ-003: Tính BHYT NLĐ 1.5%
    calcBHYT(coefficient, positionAllowance, baseSalaryVND, exchangeRate) {
      const base = (coefficient + positionAllowance) * baseSalaryVND;
      return (base * this.RULES.bhytEmployeeRate) / exchangeRate;
    }
  };

  // ============================================================
  // PAYSLIP STORE (Phiếu lương điện tử)
  // ============================================================
  const payslipStore = {
    KEY: 'payslips',

    init() {
      if (!storage.get(this.KEY)) {
        storage.set(this.KEY, {});
      }
      return this;
    },

    getStatus(period, empCode) {
      const data = storage.get(this.KEY, {});
      return (data[period] && data[period][empCode]) || {
        sent: false,
        viewed: false,
        sentAt: null,
        viewedAt: null
      };
    },

    markSent(period, empCode, email) {
      const data = storage.get(this.KEY, {});
      if (!data[period]) data[period] = {};
      data[period][empCode] = {
        ...data[period][empCode],
        sent: true,
        email,
        sentAt: new Date().toISOString()
      };
      storage.set(this.KEY, data);
      return wrapResponse(data[period][empCode]);
    },

    markViewed(period, empCode) {
      const data = storage.get(this.KEY, {});
      if (!data[period]) data[period] = {};
      data[period][empCode] = {
        ...data[period][empCode],
        viewed: true,
        viewedAt: new Date().toISOString()
      };
      storage.set(this.KEY, data);
      return wrapResponse(data[period][empCode]);
    },

    // Gửi tất cả phiếu lương trong kỳ
    sendAll(period) {
      const payroll = payrollStore.getByPeriod(period);
      if (!payroll) return wrapError(404, 'Không tìm thấy kỳ lương');

      payroll.employees.forEach(emp => {
        const email = emp.code.toLowerCase() + '@vrg-mkc.com';
        this.markSent(period, emp.code, email);
      });

      return wrapResponse({ count: payroll.employees.length });
    }
  };

  // ============================================================
  // MULTI-PAYMENT STORE (Chi trả nhiều đợt)
  // ============================================================
  const multiPaymentStore = {
    KEY: 'multi_payments',

    init() {
      if (!storage.get(this.KEY)) {
        storage.set(this.KEY, []);
      }
      return this;
    },

    getAll(period = null) {
      let list = storage.get(this.KEY, []).filter(p => p.status !== -1);
      if (period) list = list.filter(p => p.period === period);
      return list;
    },

    create(data) {
      const list = storage.get(this.KEY, []);
      const maxId = list.length > 0 ? Math.max(...list.map(p => p.id)) : 0;

      const newPayment = {
        id: maxId + 1,
        ...data,
        status: 1,
        paymentStatus: 'pending', // pending | partial | completed
        paidAmount: 0,
        remainingAmount: data.totalAmount,
        createdAt: new Date().toISOString()
      };

      list.push(newPayment);
      storage.set(this.KEY, list);
      return wrapResponse(newPayment);
    },

    recordPayment(id, amount, note = '') {
      const list = storage.get(this.KEY, []);
      const idx = list.findIndex(p => p.id === id);
      if (idx === -1) return wrapError(404, 'Không tìm thấy đợt chi trả');

      const payment = list[idx];
      const newPaid = payment.paidAmount + amount;
      const remaining = payment.totalAmount - newPaid;

      list[idx] = {
        ...payment,
        paidAmount: newPaid,
        remainingAmount: remaining,
        paymentStatus: remaining <= 0 ? 'completed' : 'partial',
        payments: [
          ...(payment.payments || []),
          { amount, note, paidAt: new Date().toISOString() }
        ],
        updatedAt: new Date().toISOString()
      };

      storage.set(this.KEY, list);
      return wrapResponse(list[idx]);
    }
  };

  // ============================================================
  // WORKFLOW / APPROVAL STORE
  // ============================================================
  const workflowStore = {
    STEPS: CFG.workflow || [
      { step: 1, role: 'Kế toán lương', status: 'Hoàn tất tính lương' },
      { step: 2, role: 'TP TC-KT', status: 'Đang kiểm tra' },
      { step: 3, role: 'Giám đốc Tài chính', status: 'Chờ duyệt' },
      { step: 4, role: 'Tổng Giám đốc', status: 'Chờ duyệt cuối' }
    ],

    getStepInfo(step) {
      return this.STEPS.find(s => s.step === step) || this.STEPS[0];
    },

    canApprove(currentStep, userRole) {
      const step = this.getStepInfo(currentStep);
      return step && step.role === userRole;
    }
  };

  // ============================================================
  // INIT & EXPORT
  // ============================================================
  function initAll() {
    employeeStore.init();
    attendanceStore.init();
    payrollStore.init();
    deductionStore.init();
    electricityStore.init();
    payslipStore.init();
    multiPaymentStore.init();
    console.log('[MKC Payroll Store] Initialized');
    return window.MKC_STORE;
  }

  // Export to window
  window.MKC_STORE = {
    // Utils
    storage,
    wrapResponse,
    wrapError,

    // Stores
    employee: employeeStore,
    attendance: attendanceStore,
    payroll: payrollStore,
    deduction: deductionStore,
    electricity: electricityStore,
    tax: taxStore,
    insurance: insuranceStore,
    payslip: payslipStore,
    multiPayment: multiPaymentStore,
    workflow: workflowStore,

    // Init
    init: initAll,

    // Helpers
    fmt: {
      currency: (n, cur = 'USD') => {
        const val = Number(n || 0);
        if (cur === 'KHR') return val.toLocaleString('vi-VN') + ' ៛';
        return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
      },
      date: (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—',
      datetime: (d) => d ? new Date(d).toLocaleString('vi-VN') : '—'
    }
  };

  // ============================================================
  // KPI STORE
  // ============================================================
  const kpiStore = {
    KEY: 'kpi_scores',

    init() {
      if (!storage.get(this.KEY)) {
        // Seed từ config (lấy từ employee data)
        const period = CFG.period?.code || '2026-01';
        const seed = {};
        seed[period] = (CFG.payrollRows || []).map((row, idx) => ({
          empCode: row.code,
          empName: row.name,
          department: row.department,
          scores: [0, 0, 0, 0], // Hoàn thành CV, Kỷ luật, Sáng kiến, Hợp tác
          status: 'pending',
          updatedAt: new Date().toISOString()
        }));
        
        // Add some dummy initial data for UI preview like it was before
        if (seed[period].length >= 8) {
          seed[period][0].scores = [95,90,85,92]; seed[period][0].status = 'done';
          seed[period][1].scores = [88,85,70,80]; seed[period][1].status = 'done';
          seed[period][2].scores = [92,88,90,85]; seed[period][2].status = 'done';
          seed[period][3].scores = [78,80,65,75]; seed[period][3].status = 'done';
          seed[period][4].scores = [85,82,88,90]; seed[period][4].status = 'pending';
          seed[period][5].scores = [72,75,60,70]; seed[period][5].status = 'pending';
          seed[period][6].scores = [90,78,82,88]; seed[period][6].status = 'done';
          seed[period][7].scores = [65,70,55,68]; seed[period][7].status = 'pending';
        }

        storage.set(this.KEY, seed);
      }
      return this;
    },

    getAll(period) {
      const data = storage.get(this.KEY, {});
      return data[period] || [];
    },

    update(period, empCode, scores, status = 'done') {
      const data = storage.get(this.KEY, {});
      if (!data[period]) data[period] = [];
      
      const idx = data[period].findIndex(e => e.empCode === empCode);
      if (idx !== -1) {
        data[period][idx].scores = scores;
        data[period][idx].status = status;
        data[period][idx].updatedAt = new Date().toISOString();
      } else {
        // Find employee info from config or employeeStore
        const emp = employeeStore.getByCode(empCode);
        data[period].push({
          empCode,
          empName: emp ? emp.name : '',
          department: emp ? emp.department : '',
          scores,
          status,
          updatedAt: new Date().toISOString()
        });
      }
      storage.set(this.KEY, data);
      return wrapResponse(data[period].find(e => e.empCode === empCode));
    }
  };

  window.MKC_STORE.kpi = kpiStore;

  // Add to initAll
  const originalInit = initAll;
  function initAllWithKPI() {
    originalInit();
    kpiStore.init();
  }
  window.MKC_STORE.init = initAllWithKPI;

  // Auto-init khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllWithKPI);
  } else {
    initAllWithKPI();
  }

})(window);
