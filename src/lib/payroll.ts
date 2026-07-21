export type MaritalStatus = "soltero" | "casado" | "declara conjuntamente";

export type IncomeKind =
  | "base"
  | "bonus"
  | "production"
  | "commission"
  | "allowance"
  | "overtime";

export type DeductionKind =
  | "css"
  | "educational_insurance"
  | "income_tax"
  | "manual";

export type IncomeLine = {
  label: string;
  amount: number;
  kind: IncomeKind;
  taxableForIncomeTax: boolean;
  subjectToCss: boolean;
  subjectToEducationalInsurance: boolean;
};

export type DeductionLine = {
  label: string;
  amount: number;
  kind: DeductionKind;
};

export type EmployeeSeed = {
  id: string;
  group: number;
  fullName: string;
  cedula: string;
  maritalStatus: MaritalStatus;
  position: string;
  startYear: number;
  startDate: string;
  monthlyBaseSalary: number;
  notes?: string;
  periodExtras: {
    companyBonus?: number;
    productionBonus?: number;
    oneTimeAllowance?: number;
    commissionRate?: number;
    commissionBase?: number;
    overtimeHours?: number;
    saturdayOvertimeHours?: number;
  };
  monthlyDeductions: Array<{ label: string; amount: number }>;
};

export type EmployeePayrollReport = {
  employee: EmployeeSeed;
  hourlyRate: number;
  basePay: number;
  otherIncomeTotal: number;
  grossIncome: number;
  cssBase: number;
  educationalInsuranceBase: number;
  taxAnnualizedBase: number;
  incomes: IncomeLine[];
  deductions: DeductionLine[];
  cssEmployee: number;
  educationalInsuranceEmployee: number;
  incomeTax: number;
  manualDeductions: number;
  totalDeductions: number;
  netPay: number;
  employerCss: number;
  employerEducationalInsurance: number;
  employerProfessionalRisk: number;
  employerBurdenTotal: number;
};

export type PayrollSummary = {
  periodLabel: string;
  companyName: string;
  activity: string;
  location: string;
  weeklyHours: number;
  minimumWageReference: string;
  professionalRiskRate: number;
  employees: EmployeePayrollReport[];
  totals: {
    grossIncome: number;
    totalDeductions: number;
    netPay: number;
    cssEmployee: number;
    educationalInsuranceEmployee: number;
    incomeTax: number;
    employerCss: number;
    employerEducationalInsurance: number;
    employerProfessionalRisk: number;
    employerBurdenTotal: number;
  };
};

export type ReportCard = {
  title: string;
  description: string;
  href: string;
};

export const COMPANY_PROFILE = {
  name: "Planilla Pro Panama",
  legalDemoName: "La Prospera, S.A.",
  activity: "Fabricacion de cemento",
  location: "Juan Diaz, Ciudad de Panama",
  weeklyHours: 45,
  professionalRiskRate: 0.0056,
  minimumWageReference:
    "Decreto Ejecutivo 13 del 31 de diciembre de 2025, Region 1, fabricacion de cemento/concreto.",
  payPeriodLabel: "Segunda quincena de junio 2026",
  minimumHourlyRateRegionOneCement: 3.39,
};

const EMPLOYEE_CSS_RATE = 0.0975;
const EMPLOYER_CSS_RATE = 0.1325;
const EMPLOYEE_EDUCATIONAL_INSURANCE_RATE = 0.0125;
const EMPLOYER_EDUCATIONAL_INSURANCE_RATE = 0.015;
const QUINCENAS_PER_YEAR_WITH_THIRTEENTH_MONTH = 26;
const MONTHLY_HOURS = 195;

export const GROUP_4_EMPLOYEES: EmployeeSeed[] = [
  {
    id: "g4-jose-gonzalez",
    group: 4,
    fullName: "Jose Gonzalez",
    cedula: "4-590-678",
    maritalStatus: "casado",
    position: "Reparador de calle",
    startYear: 2021,
    startDate: "2021-01-15",
    monthlyBaseSalary: 600,
    notes: "Prima de produccion reportada para esta quincena.",
    periodExtras: {
      companyBonus: 120,
      productionBonus: 600,
    },
    monthlyDeductions: [{ label: "Prestamo", amount: 200 }],
  },
  {
    id: "g4-rafael-fernandez",
    group: 4,
    fullName: "Rafael Fernandez",
    cedula: "10-400-390",
    maritalStatus: "soltero",
    position: "Supervisora de planta",
    startYear: 2020,
    startDate: "2020-02-10",
    monthlyBaseSalary: 1000,
    notes: "Dieta por capacitacion en Costa Rica reportada para este periodo.",
    periodExtras: {
      companyBonus: 120,
      oneTimeAllowance: 5000,
    },
    monthlyDeductions: [{ label: "Muebleria", amount: 300 }],
  },
  {
    id: "g4-mariano-ramos",
    group: 4,
    fullName: "Mariano Ramos",
    cedula: "5-789-352",
    maritalStatus: "soltero",
    position: "Analista supervisor",
    startYear: 2019,
    startDate: "2019-04-01",
    monthlyBaseSalary: 900,
    notes: "Comision del 2% sobre ventas por B/.9,000 en esta quincena.",
    periodExtras: {
      companyBonus: 120,
      commissionRate: 0.02,
      commissionBase: 9000,
    },
    monthlyDeductions: [{ label: "Ahorro empresa", amount: 200 }],
  },
  {
    id: "g4-gloria-benitez",
    group: 4,
    fullName: "Gloria Benitez",
    cedula: "5-230-456",
    maritalStatus: "declara conjuntamente",
    position: "Secretaria",
    startYear: 2022,
    startDate: "2022-05-18",
    monthlyBaseSalary: 870,
    notes: "Horas extra: lunes 3, jueves 3, sabado 3.",
    periodExtras: {
      companyBonus: 120,
      overtimeHours: 6,
      saturdayOvertimeHours: 3,
    },
    monthlyDeductions: [],
  },
];

export const REPORT_CARDS: ReportCard[] = [
  {
    title: "Datos del personal",
    description: "Ficha de cada colaborador con cargo, salario base y fecha de inicio.",
    href: "/dashboard/personal",
  },
  {
    title: "Busqueda de colaboradores",
    description: "Consulta individual con ingresos, descuentos y salario neto.",
    href: "/dashboard/colaboradores",
  },
  {
    title: "Reporte de planilla",
    description: "Resumen quincenal, cargas patronales y reporte para CSS.",
    href: "/dashboard/planilla",
  },
];

export function currency(value: number) {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "PAB",
    minimumFractionDigits: 2,
  }).format(value);
}

export function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function computeIncomeTax(annualizedBase: number) {
  if (annualizedBase <= 11000) {
    return 0;
  }

  if (annualizedBase <= 50000) {
    return (annualizedBase - 11000) * 0.15;
  }

  return 5850 + (annualizedBase - 50000) * 0.25;
}

function getHourlyRate(monthlyBaseSalary: number) {
  return monthlyBaseSalary / MONTHLY_HOURS;
}

function getBasePay(monthlyBaseSalary: number) {
  return monthlyBaseSalary / 2;
}

function getCommission(seed: EmployeeSeed) {
  if (!seed.periodExtras.commissionRate || !seed.periodExtras.commissionBase) {
    return 0;
  }

  return seed.periodExtras.commissionRate * seed.periodExtras.commissionBase;
}

function getOvertimePay(seed: EmployeeSeed, hourlyRate: number) {
  const normalHours = seed.periodExtras.overtimeHours ?? 0;
  const saturdayHours = seed.periodExtras.saturdayOvertimeHours ?? 0;

  const normalPay = normalHours * hourlyRate * 1.25;
  const saturdayPay = saturdayHours * hourlyRate * 1.25;

  return roundCurrency(normalPay + saturdayPay);
}

function buildIncomeLines(seed: EmployeeSeed): IncomeLine[] {
  const basePay = roundCurrency(getBasePay(seed.monthlyBaseSalary));
  const hourlyRate = getHourlyRate(seed.monthlyBaseSalary);
  const overtimePay = getOvertimePay(seed, hourlyRate);
  const commissionPay = roundCurrency(getCommission(seed));
  const productionBonus = roundCurrency(seed.periodExtras.productionBonus ?? 0);
  const companyBonus = roundCurrency(seed.periodExtras.companyBonus ?? 0);
  const allowance = roundCurrency(seed.periodExtras.oneTimeAllowance ?? 0);

  return [
    {
      label: "Salario base quincenal",
      amount: basePay,
      kind: "base" as const,
      taxableForIncomeTax: true,
      subjectToCss: true,
      subjectToEducationalInsurance: true,
    },
    {
      label: "Bonificacion general",
      amount: companyBonus,
      kind: "bonus" as const,
      taxableForIncomeTax: true,
      subjectToCss: companyBonus > 0,
      subjectToEducationalInsurance: companyBonus > 0,
    },
    {
      label: "Prima de produccion",
      amount: productionBonus,
      kind: "production" as const,
      taxableForIncomeTax: true,
      subjectToCss: false,
      subjectToEducationalInsurance: false,
    },
    {
      label: "Comision del periodo",
      amount: commissionPay,
      kind: "commission" as const,
      taxableForIncomeTax: true,
      subjectToCss: commissionPay > 0,
      subjectToEducationalInsurance: commissionPay > 0,
    },
    {
      label: "Dieta / asignacion especial",
      amount: allowance,
      kind: "allowance" as const,
      taxableForIncomeTax: true,
      subjectToCss: false,
      subjectToEducationalInsurance: false,
    },
    {
      label: "Horas extra",
      amount: overtimePay,
      kind: "overtime" as const,
      taxableForIncomeTax: true,
      subjectToCss: overtimePay > 0,
      subjectToEducationalInsurance: overtimePay > 0,
    },
  ].filter((line) => line.amount > 0);
}

function buildManualDeductions(seed: EmployeeSeed): DeductionLine[] {
  return seed.monthlyDeductions.map((deduction) => ({
    label: deduction.label,
    amount: roundCurrency(deduction.amount / 2),
    kind: "manual" as const,
  }));
}

export function calculateEmployeePayroll(seed: EmployeeSeed): EmployeePayrollReport {
  const hourlyRate = roundCurrency(getHourlyRate(seed.monthlyBaseSalary));
  const incomes = buildIncomeLines(seed);
  const manualDeductions = buildManualDeductions(seed);
  const basePay = incomes.find((line) => line.kind === "base")?.amount ?? 0;
  const grossIncome = roundCurrency(
    incomes.reduce((sum, income) => sum + income.amount, 0),
  );
  const cssBase = roundCurrency(
    incomes
      .filter((income) => income.subjectToCss)
      .reduce((sum, income) => sum + income.amount, 0),
  );
  const educationalInsuranceBase = roundCurrency(
    incomes
      .filter((income) => income.subjectToEducationalInsurance)
      .reduce((sum, income) => sum + income.amount, 0),
  );
  const annualizedTaxBase = roundCurrency(
    incomes
      .filter((income) => income.taxableForIncomeTax)
      .reduce((sum, income) => sum + income.amount, 0) *
      QUINCENAS_PER_YEAR_WITH_THIRTEENTH_MONTH,
  );
  const annualIncomeTax = computeIncomeTax(annualizedTaxBase);
  const incomeTax = roundCurrency(
    annualIncomeTax / QUINCENAS_PER_YEAR_WITH_THIRTEENTH_MONTH,
  );
  const cssEmployee = roundCurrency(cssBase * EMPLOYEE_CSS_RATE);
  const educationalInsuranceEmployee = roundCurrency(
    educationalInsuranceBase * EMPLOYEE_EDUCATIONAL_INSURANCE_RATE,
  );
  const manualDeductionTotal = roundCurrency(
    manualDeductions.reduce((sum, deduction) => sum + deduction.amount, 0),
  );
  const statutoryDeductions: DeductionLine[] = [
    {
      label: "Seguro social",
      amount: cssEmployee,
      kind: "css",
    },
    {
      label: "Seguro educativo",
      amount: educationalInsuranceEmployee,
      kind: "educational_insurance",
    },
    {
      label: "Impuesto sobre la renta",
      amount: incomeTax,
      kind: "income_tax",
    },
  ];
  const deductions = [...statutoryDeductions, ...manualDeductions];
  const totalDeductions = roundCurrency(
    deductions.reduce((sum, deduction) => sum + deduction.amount, 0),
  );
  const netPay = roundCurrency(grossIncome - totalDeductions);
  const employerCss = roundCurrency(cssBase * EMPLOYER_CSS_RATE);
  const employerEducationalInsurance = roundCurrency(
    educationalInsuranceBase * EMPLOYER_EDUCATIONAL_INSURANCE_RATE,
  );
  const employerProfessionalRisk = roundCurrency(
    cssBase * COMPANY_PROFILE.professionalRiskRate,
  );
  const employerBurdenTotal = roundCurrency(
    employerCss + employerEducationalInsurance + employerProfessionalRisk,
  );

  return {
    employee: seed,
    hourlyRate,
    basePay,
    otherIncomeTotal: roundCurrency(grossIncome - basePay),
    grossIncome,
    cssBase,
    educationalInsuranceBase,
    taxAnnualizedBase: annualizedTaxBase,
    incomes,
    deductions,
    cssEmployee,
    educationalInsuranceEmployee,
    incomeTax,
    manualDeductions: manualDeductionTotal,
    totalDeductions,
    netPay,
    employerCss,
    employerEducationalInsurance,
    employerProfessionalRisk,
    employerBurdenTotal,
  };
}

export function getGroup4PayrollSummary(): PayrollSummary {
  const employees = GROUP_4_EMPLOYEES.map(calculateEmployeePayroll);

  const totals = employees.reduce(
    (accumulator, employee) => ({
      grossIncome: accumulator.grossIncome + employee.grossIncome,
      totalDeductions: accumulator.totalDeductions + employee.totalDeductions,
      netPay: accumulator.netPay + employee.netPay,
      cssEmployee: accumulator.cssEmployee + employee.cssEmployee,
      educationalInsuranceEmployee:
        accumulator.educationalInsuranceEmployee +
        employee.educationalInsuranceEmployee,
      incomeTax: accumulator.incomeTax + employee.incomeTax,
      employerCss: accumulator.employerCss + employee.employerCss,
      employerEducationalInsurance:
        accumulator.employerEducationalInsurance +
        employee.employerEducationalInsurance,
      employerProfessionalRisk:
        accumulator.employerProfessionalRisk + employee.employerProfessionalRisk,
      employerBurdenTotal:
        accumulator.employerBurdenTotal + employee.employerBurdenTotal,
    }),
    {
      grossIncome: 0,
      totalDeductions: 0,
      netPay: 0,
      cssEmployee: 0,
      educationalInsuranceEmployee: 0,
      incomeTax: 0,
      employerCss: 0,
      employerEducationalInsurance: 0,
      employerProfessionalRisk: 0,
      employerBurdenTotal: 0,
    },
  );

  return {
    periodLabel: COMPANY_PROFILE.payPeriodLabel,
    companyName: COMPANY_PROFILE.legalDemoName,
    activity: COMPANY_PROFILE.activity,
    location: COMPANY_PROFILE.location,
    weeklyHours: COMPANY_PROFILE.weeklyHours,
    minimumWageReference: COMPANY_PROFILE.minimumWageReference,
    professionalRiskRate: COMPANY_PROFILE.professionalRiskRate,
    employees,
    totals: {
      grossIncome: roundCurrency(totals.grossIncome),
      totalDeductions: roundCurrency(totals.totalDeductions),
      netPay: roundCurrency(totals.netPay),
      cssEmployee: roundCurrency(totals.cssEmployee),
      educationalInsuranceEmployee: roundCurrency(
        totals.educationalInsuranceEmployee,
      ),
      incomeTax: roundCurrency(totals.incomeTax),
      employerCss: roundCurrency(totals.employerCss),
      employerEducationalInsurance: roundCurrency(
        totals.employerEducationalInsurance,
      ),
      employerProfessionalRisk: roundCurrency(totals.employerProfessionalRisk),
      employerBurdenTotal: roundCurrency(totals.employerBurdenTotal),
    },
  };
}

export function getEmployeeReportById(id: string) {
  return getGroup4PayrollSummary().employees.find((employee) => employee.employee.id === id);
}

export function searchEmployees(query: string) {
  const normalized = query.trim().toLowerCase();

  return getGroup4PayrollSummary().employees.filter((employee) => {
    if (!normalized) {
      return true;
    }

    return [
      employee.employee.fullName,
      employee.employee.cedula,
      employee.employee.position,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });
}

export function serializeReportForEmail(reportType: string) {
  const summary = getGroup4PayrollSummary();

  if (reportType === "personal") {
    return {
      title: "Reporte de datos del personal",
      body: summary.employees
        .map(
          (employee) =>
            `${employee.employee.fullName} | ${employee.employee.position} | ${employee.employee.cedula} | ${currency(employee.employee.monthlyBaseSalary)}`,
        )
        .join("\n"),
    };
  }

  if (reportType === "planilla") {
    return {
      title: `Reporte de planilla - ${summary.periodLabel}`,
      body: summary.employees
        .map(
          (employee) =>
            `${employee.employee.fullName} | Bruto ${currency(employee.grossIncome)} | Deducciones ${currency(employee.totalDeductions)} | Neto ${currency(employee.netPay)}`,
        )
        .join("\n"),
    };
  }

  return {
    title: "Reporte de colaboradores",
    body: summary.employees
      .map(
        (employee) =>
          `${employee.employee.fullName} | Base ${currency(employee.basePay)} | Otros ingresos ${currency(employee.otherIncomeTotal)} | Neto ${currency(employee.netPay)}`,
      )
      .join("\n"),
  };
}
