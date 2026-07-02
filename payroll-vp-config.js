window.MKC_PAYROLL_VP_CONFIG = {
  period: {
    label: "Tháng 01/2026",
    code: "2026-01",
    scope: "Payroll Văn phòng gián tiếp Campuchia",
    standardWorkDays: 26,
    primaryCurrency: "USD",
    taxCurrency: "KHR",
    exchangeRate: 4026,
    formulaVersion: "VP-2026.01",
    taxVersion: "PIT-KH-2026.01",
    insuranceVersion: "NSSF-KH-2026.01",
    approvalStep: "Chờ TP TC-KT kiểm tra"
  },
  totals: {
    employeeCount: 38,
    gross: 29591.24,
    timeSalary: 24350.81,
    meal: 2160,
    house: 1040,
    leaveSalary: 131.81,
    holidaySalary: 768.62,
    holidayBonus: 1140,
    electricity: 74.87,
    advance: 1140,
    otherTax: 680,
    pit: 1363.63
  },
  departments: [
    { name: "Ban Giám đốc", employees: 2, workDays: 54, timeSalary: 3073.85, meal: 120, house: 60, leaveSalary: 0, holidaySalary: 113.85, holidayBonus: 60, gross: 3427.70 },
    { name: "TCHC", employees: 12, workDays: 328, timeSalary: 7284.63, meal: 660, house: 310, leaveSalary: 0, holidaySalary: 225.91, holidayBonus: 360, gross: 8840.54 },
    { name: "TCKT", employees: 7, workDays: 173, timeSalary: 4228.47, meal: 420, house: 190, leaveSalary: 32.34, holidaySalary: 170.78, holidayBonus: 210, gross: 5251.59 },
    { name: "KHXDCB", employees: 5, workDays: 129, timeSalary: 3493.85, meal: 300, house: 150, leaveSalary: 47.51, holidaySalary: 72.70, holidayBonus: 150, gross: 4214.06 },
    { name: "QLCL", employees: 7, workDays: 159, timeSalary: 3405.00, meal: 420, house: 210, leaveSalary: 51.96, holidaySalary: 108.84, holidayBonus: 210, gross: 4405.80 },
    { name: "KTNN", employees: 5, workDays: 112, timeSalary: 2865.01, meal: 240, house: 120, leaveSalary: 0, holidaySalary: 76.54, holidayBonus: 150, gross: 3451.55 }
  ],
  payrollRows: [
    {
      code: "VP001",
      name: "Đỗ Quốc Tuấn",
      department: "Ban Giám đốc",
      passport: "C7620912",
      baseSalary: 1580,
      actualDays: 27,
      holidayDays: 1,
      leaveDays: 0,
      timeSalary: 1640.77,
      meal: 60,
      arrears: 0,
      holidaySalary: 60.77,
      house: 30,
      leaveSalary: 0,
      abcBonus: 0,
      holidayBonus: 30,
      supplement: 0,
      seniorityNonTaxable: 0,  // Cột Q - Thâm niên không chịu thuế
      seniorityTaxable: 0,     // Cột R - Thâm niên chịu thuế
      gross: 1821.54,
      advance: 30,
      otherTax: 20,
      pit: 138.09,
      unionFee: 3.71,
      visaWorkPermit: 0,
      unionHouse: 0,
      coefficient: 5.03,
      positionAllowanceFactor: 0,
      areaAllowanceFactor: 0.04,
      nssf: 5.97,
      socialInsurance: 64.23,
      healthInsurance: 12.04,
      unemployment: 8.03,
      electricity: 0,
      electricitySheetAmount: 11.21,
      deductionTotal: 282.07,
      netPay: 1539.47
    },
    {
      code: "VP002",
      name: "Nguyễn Văn Toàn",
      department: "Ban Giám đốc",
      passport: "C0561974",
      baseSalary: 1380,
      actualDays: 27,
      holidayDays: 1,
      leaveDays: 0,
      timeSalary: 1433.08,
      meal: 60,
      arrears: 0,
      holidaySalary: 53.08,
      house: 30,
      leaveSalary: 0,
      abcBonus: 0,
      holidayBonus: 30,
      supplement: 0,
      seniorityNonTaxable: 0,  // Cột Q - Thâm niên không chịu thuế
      seniorityTaxable: 0,     // Cột R - Thâm niên chịu thuế
      gross: 1606.16,
      advance: 30,
      otherTax: 20,
      pit: 116.55,
      unionFee: 3.29,
      visaWorkPermit: 0,
      unionHouse: 0,
      coefficient: 4.45,
      positionAllowanceFactor: 0,
      areaAllowanceFactor: 0.04,
      nssf: 5.97,
      socialInsurance: 56.88,
      healthInsurance: 10.67,
      unemployment: 7.11,
      electricity: 0,
      electricitySheetAmount: 2.74,
      deductionTotal: 250.47,
      netPay: 1355.69
    },
    {
      code: "VP010",
      name: "Trần Thị Mỹ Hạnh",
      department: "TCHC",
      passport: "N1288891",
      baseSalary: 780,
      actualDays: 26,
      holidayDays: 1,
      leaveDays: 0,
      timeSalary: 780,
      meal: 60,
      arrears: 0,
      holidaySalary: 30,
      house: 30,
      leaveSalary: 0,
      abcBonus: 0,
      holidayBonus: 30,
      supplement: 0,
      seniorityNonTaxable: 0,  // Cột Q - Thâm niên không chịu thuế
      seniorityTaxable: 0,     // Cột R - Thâm niên chịu thuế
      gross: 930,
      advance: 30,
      otherTax: 20,
      pit: 34.22,
      unionFee: 3,
      visaWorkPermit: 0,
      unionHouse: 0,
      nssf: 5.96,
      socialInsurance: 0,
      healthInsurance: 0,
      unemployment: 0,
      electricity: 4.10
    },
    {
      code: "VP021",
      name: "Sok Dara",
      department: "TCKT",
      passport: "KH445120",
      baseSalary: 620,
      actualDays: 25,
      holidayDays: 1,
      leaveDays: 1,
      timeSalary: 596.15,
      meal: 60,
      arrears: 0,
      holidaySalary: 23.85,
      house: 30,
      leaveSalary: 23.85,
      abcBonus: 0,
      holidayBonus: 30,
      supplement: 0,
      seniorityNonTaxable: 0,  // Cột Q - Thâm niên không chịu thuế
      seniorityTaxable: 0,     // Cột R - Thâm niên chịu thuế
      gross: 763.85,
      advance: 30,
      otherTax: 0,
      pit: 8.91,
      unionFee: 3,
      visaWorkPermit: 0,
      unionHouse: 0,
      nssf: 5.96,
      socialInsurance: 0,
      healthInsurance: 0,
      unemployment: 0,
      electricity: 0
    },
    {
      code: "VP033",
      name: "Lê Minh Kha",
      department: "QLCL",
      passport: "C8891002",
      baseSalary: 520,
      actualDays: 26,
      holidayDays: 1,
      leaveDays: 0,
      timeSalary: 520,
      meal: 60,
      arrears: 0,
      holidaySalary: 20,
      house: 30,
      leaveSalary: 0,
      abcBonus: 0,
      holidayBonus: 30,
      supplement: 0,
      seniorityNonTaxable: 0,  // Cột Q - Thâm niên không chịu thuế
      seniorityTaxable: 0,     // Cột R - Thâm niên chịu thuế
      gross: 660,
      advance: 30,
      otherTax: 0,
      pit: 0,
      unionFee: 3,
      visaWorkPermit: 0,
      unionHouse: 0,
      nssf: 5.96,
      socialInsurance: 0,
      healthInsurance: 0,
      unemployment: 0,
      electricity: 3.25
    }
  ],
  // Các cấu hình Thuế TNCN, Bảo hiểm (NSSF, BHXH, BHYT) và Giảm trừ gia cảnh
  // đã được chuyển sang quản lý tập trung tại phân hệ HR.
  // Payroll VP chỉ nhận kết quả cuối cùng để lên bảng lương.
  // OQ-018: Công đoàn phí - configurable, không hardcode
  unionFeeConfig: {
    formulaType: "coefficient",    // Tính theo hệ số (chờ TCHC xác nhận)
    baseMultiplier: 1.0,           // Hệ số × baseMultiplier = CĐ phí
    minAmount: 0,
    maxAmount: null,
    note: "Chờ TCHC xác nhận công thức chính xác"
  },
  currencies: [
    { code: "USD", name: "Đô la Mỹ", country: "Mỹ", decimalPlaces: 2, isPayrollBase: true },
    { code: "KHR", name: "Riel Campuchia", country: "Campuchia", decimalPlaces: 0, isPayrollBase: false },
    { code: "VND", name: "Đồng Việt Nam", country: "Việt Nam", decimalPlaces: 0, isPayrollBase: false }
  ],
  exchangeRates: [
    { from: "USD", to: "VND", rate: 24500, display: "1 USD = 24,500 VND", effectiveFrom: "2026-01-01", source: "Danh mục nền", status: "Hoạt động" },
    { from: "KHR", to: "USD", rate: 0.000248, display: "4,026 KHR = 1 USD", effectiveFrom: "2026-01-01", source: "Danh mục nền", status: "Hoạt động" },
    { from: "KHR", to: "VND", rate: 6.09, display: "1 KHR = 6.09 VND", effectiveFrom: "2026-01-01", source: "Danh mục nền", status: "Hoạt động" },
    { from: "USD", to: "KHR", rate: 4026, display: "1 USD = 4,026 KHR", effectiveFrom: "2026-01-01", source: "Danh mục nền", status: "Hoạt động" }
  ],
  operationalDeductionTypes: [
    { code: "ADVANCE", name: "Tạm ứng/hoàn ứng", column: "T/U", source: "Đề nghị tạm ứng đã duyệt", configurable: true },
    { code: "UNION_FEE", name: "CĐ phí cá nhân", column: "Z", source: "Danh mục khấu trừ", configurable: true },
    { code: "VISA_WORK_PERMIT", name: "Visa/Sổ LĐ", column: "AA", source: "Hồ sơ nhân viên", configurable: true },
    { code: "UNION_HOUSE", name: "Mái ấm CĐ", column: "AB", source: "Danh mục khấu trừ", configurable: true },
    { code: "LOAN", name: "Khoản vay/khấu trừ khác", column: "Nhập kỳ", source: "Nhập kỳ", configurable: true },
    { code: "DISCIPLINE", name: "Khấu trừ kỷ luật", column: "Nhập kỳ", source: "Quyết định kỷ luật", configurable: true },
    { code: "ELECTRICITY", name: "Tiền điện", column: "Sheet Điện", source: "Sheet Điện", configurable: true }
  ],
  deductionTypes: [
    { code: "ADVANCE", name: "Tạm ứng", column: "T/U", source: "Đề nghị đã duyệt", configurable: true },
    { code: "OTHER_TAX", name: "Thuế thu nhập khác", column: "V", source: "Nhập tay (OQ-007)", configurable: true, requiresApproval: true, hasAttachment: true },
    { code: "PIT", name: "Thuế TNCN Campuchia", column: "W/X", source: "Rule PIT", configurable: true },
    { code: "UNION_FEE", name: "CĐ phí", column: "Z", source: "Danh mục khấu trừ", configurable: true },
    { code: "VISA_WORK_PERMIT", name: "Visa/Sổ LĐ", column: "AA", source: "Hồ sơ nhân viên", configurable: true },
    { code: "UNION_HOUSE", name: "Mái ấm CĐ", column: "AB", source: "Danh mục khấu trừ", configurable: true },
    { code: "NSSF", name: "BH hưu trí CPC", column: "AG", source: "Rule bảo hiểm", configurable: true },
    { code: "BHXH", name: "BHXH NLĐ 8%", column: "AH", source: "(Hệ số + PC) × Lương cơ sở × 8% / Tỷ giá", configurable: true },
    { code: "BHYT", name: "BHYT NLĐ 1.5%", column: "AI", source: "(Hệ số + PC) × Lương cơ sở × 1.5% / Tỷ giá", configurable: true },
    { code: "ELECTRICITY", name: "Tiền điện", column: "Sheet Điện", source: "Sheet Điện", configurable: true }
  ],
  // OQ-017: Tiền điện chỉ áp dụng cho NV có bill KTX
  electricityConfig: {
    freeQuotaKwh: 20,              // Định mức miễn phí 20 kWh
    unitPriceRanges: [
      { maxKwh: 50, priceKHR: 480 },
      { maxKwh: 100, priceKHR: 540 },
      { maxKwh: null, priceKHR: 610 }
    ],
    eligibility: "KTX_RESIDENT",   // Chỉ NV ở KTX có bill điện
    formula: "(Số ký - 20) × Đơn giá / Tỷ giá"
  },
  electricityRows: [
    { code: "VP001", name: "Đỗ Quốc Tuấn", kw: 94, freeKw: 20, billableKw: 74, unitPriceKHR: 610, amountUsd: 11.21 },
    { code: "VP002", name: "Nguyễn Văn Toàn", kw: 43, freeKw: 20, billableKw: 23, unitPriceKHR: 480, amountUsd: 2.74 }
  ],
  // OQ-020: Danh sách ký hiệu chấm công (đã xác nhận)
  attendanceSymbols: [
    { code: "X", name: "Công ngày", nameKH: "ថ្ងៃធ្វើការ", value: 1, isPaid: true },
    { code: "Ro", name: "Việc riêng", nameKH: "ការងារផ្ទាល់ខ្លួន", value: 0, isPaid: false },
    { code: "PN", name: "Phép năm", nameKH: "ច្បាប់ឆ្នាំ", value: 1, isPaid: true, category: "leave" },
    { code: "CT", name: "Công tác", nameKH: "បេសកកម្ម", value: 1, isPaid: true },
    { code: "R", name: "Lễ/Tết", nameKH: "បុណ្យ", value: 1, isPaid: true, category: "holiday" },
    { code: "R1", name: "Trực Lễ/Tết", nameKH: "ថ្ងៃបុណ្យ", value: 1, isPaid: true, category: "holiday", hasOT: true },
    { code: "H", name: "Học tập", nameKH: "រៀន", value: 1, isPaid: true },
    { code: "O", name: "Nghỉ ốm", nameKH: "ឈឺ", value: 0, isPaid: false, category: "sick" }
  ],
  workflow: [
    { step: 1, role: "Kế toán lương", status: "Hoàn tất tính lương" },
    { step: 2, role: "TP TC-KT", status: "Đang kiểm tra" },
    { step: 3, role: "Giám đốc Tài chính", status: "Chờ duyệt" },
    { step: 4, role: "Tổng Giám đốc", status: "Chờ duyệt cuối" }
  ]
};
