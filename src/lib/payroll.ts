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

export type EmployeePayrollInput = {
  id: string;
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

export type PayrollInput = {
  periodLabel: string;
  companyName: string;
  activity: string;
  location: string;
  weeklyHours: number;
  minimumWageReference: string;
  professionalRiskRate: number;
  employees: EmployeePayrollInput[];
};

export type EmployeePayrollReport = {
  employee: EmployeePayrollInput;
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

export const EMPLOYEE_CSS_RATE = 0.0975;
export const EMPLOYER_CSS_RATE = 0.1325;
export const EMPLOYEE_EDUCATIONAL_INSURANCE_RATE = 0.0125;
export const EMPLOYER_EDUCATIONAL_INSURANCE_RATE = 0.015;
export const DEFAULT_PROFESSIONAL_RISK_RATE = 0.0056;

const QUINCENAS_PER_YEAR_WITH_THIRTEENTH_MONTH = 26;
const MONTHLY_HOURS = 195;

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

export const DEFAULT_PAYROLL_INPUT: PayrollInput = {
  periodLabel: "Segunda quincena de junio 2026",
  companyName: "Mi empresa",
  activity: "Actividad economica",
  location: "Ciudad de Panama",
  weeklyHours: 45,
  minimumWageReference:
    "Decreto Ejecutivo 13 del 31 de diciembre de 2025, Region 1, fabricacion de cemento/concreto.",
  professionalRiskRate: DEFAULT_PROFESSIONAL_RISK_RATE,
  employees: [],
};

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

export function toPercentage(value: number) {
  return `${roundCurrency(value * 100)}%`;
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

function getCommission(employee: EmployeePayrollInput) {
  if (!employee.periodExtras.commissionRate || !employee.periodExtras.commissionBase) {
    return 0;
  }

  return employee.periodExtras.commissionRate * employee.periodExtras.commissionBase;
}

function getOvertimePay(employee: EmployeePayrollInput, hourlyRate: number) {
  const normalHours = employee.periodExtras.overtimeHours ?? 0;
  const saturdayHours = employee.periodExtras.saturdayOvertimeHours ?? 0;

  const normalPay = normalHours * hourlyRate * 1.25;
  const saturdayPay = saturdayHours * hourlyRate * 1.25;

  return roundCurrency(normalPay + saturdayPay);
}

function buildIncomeLines(employee: EmployeePayrollInput): IncomeLine[] {
  const basePay = roundCurrency(getBasePay(employee.monthlyBaseSalary));
  const hourlyRate = getHourlyRate(employee.monthlyBaseSalary);
  const overtimePay = getOvertimePay(employee, hourlyRate);
  const commissionPay = roundCurrency(getCommission(employee));
  const productionBonus = roundCurrency(employee.periodExtras.productionBonus ?? 0);
  const companyBonus = roundCurrency(employee.periodExtras.companyBonus ?? 0);
  const allowance = roundCurrency(employee.periodExtras.oneTimeAllowance ?? 0);

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

function buildManualDeductions(employee: EmployeePayrollInput): DeductionLine[] {
  return employee.monthlyDeductions
    .filter((deduction) => deduction.label.trim() || deduction.amount > 0)
    .map((deduction) => ({
      label: deduction.label.trim() || "Descuento manual",
      amount: roundCurrency(deduction.amount / 2),
      kind: "manual" as const,
    }));
}

export function calculateEmployeePayroll(
  employee: EmployeePayrollInput,
  professionalRiskRate: number = DEFAULT_PROFESSIONAL_RISK_RATE,
): EmployeePayrollReport {
  const hourlyRate = roundCurrency(getHourlyRate(employee.monthlyBaseSalary));
  const incomes = buildIncomeLines(employee);
  const manualDeductions = buildManualDeductions(employee);
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
  const employerProfessionalRisk = roundCurrency(cssBase * professionalRiskRate);
  const employerBurdenTotal = roundCurrency(
    employerCss + employerEducationalInsurance + employerProfessionalRisk,
  );

  return {
    employee,
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

export function buildPayrollSummary(input: PayrollInput): PayrollSummary {
  const employees = input.employees.map((employee) =>
    calculateEmployeePayroll(employee, input.professionalRiskRate),
  );

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
    periodLabel: input.periodLabel,
    companyName: input.companyName,
    activity: input.activity,
    location: input.location,
    weeklyHours: input.weeklyHours,
    minimumWageReference: input.minimumWageReference,
    professionalRiskRate: input.professionalRiskRate,
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

export function getEmployeeReportById(summary: PayrollSummary, id: string) {
  return summary.employees.find((employee) => employee.employee.id === id);
}

export function searchEmployees(summary: PayrollSummary, query: string) {
  const normalized = query.trim().toLowerCase();

  return summary.employees.filter((employee) => {
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

export function serializeReportForEmail(
  summary: PayrollSummary,
  reportType: string,
) {
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
