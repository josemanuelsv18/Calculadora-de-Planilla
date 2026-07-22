"use client";

import Link from "next/link";
import { ArrowRight, Building2, Calculator, ShieldCheck } from "lucide-react";

import { PayrollCalculatorPanel } from "@/components/payroll-calculator-panel";
import { usePayroll } from "@/components/payroll-provider";
import {
  currency,
  EMPLOYEE_CSS_RATE,
  EMPLOYEE_EDUCATIONAL_INSURANCE_RATE,
  EMPLOYER_CSS_RATE,
  EMPLOYER_EDUCATIONAL_INSURANCE_RATE,
  REPORT_CARDS,
  toPercentage,
} from "@/lib/payroll";

export default function DashboardPage() {
  const { payrollSummary } = usePayroll();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-panel-strong p-6 text-white md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Centro de calculo
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Calcula, revisa e imprime cualquier planilla desde una sola interfaz.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72 md:text-base">
              La aplicacion genera resultados dinamicos segun los datos que ingreses para cada colaborador y periodo.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm text-white/78">
            <p>{payrollSummary.companyName || "Empresa sin nombre"}</p>
            <p>{payrollSummary.periodLabel || "Periodo sin definir"}</p>
          </div>
        </div>
      </section>

      <PayrollCalculatorPanel />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total bruto",
            value: currency(payrollSummary.totals.grossIncome),
            icon: <Calculator size={18} />,
          },
          {
            label: "Total deducciones",
            value: currency(payrollSummary.totals.totalDeductions),
            icon: <ShieldCheck size={18} />,
          },
          {
            label: "Total neto",
            value: currency(payrollSummary.totals.netPay),
            icon: <Building2 size={18} />,
          },
          {
            label: "Cargas patronales",
            value: currency(payrollSummary.totals.employerBurdenTotal),
            icon: <ArrowRight size={18} />,
          },
        ].map((item) => (
          <article
            key={item.label}
            className="print-card rounded-3xl border border-line bg-background p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{item.label}</p>
              <span className="rounded-full bg-panel px-3 py-2 text-foreground">{item.icon}</span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-foreground">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {REPORT_CARDS.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="print-card rounded-[2rem] border border-line bg-background p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xl font-semibold text-foreground">{report.title}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{report.description}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-strong">
              Abrir reporte <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <article className="print-card rounded-[2rem] border border-line bg-background p-6 shadow-sm">
          <p className="text-lg font-semibold text-foreground">Parametros de calculo</p>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <p>CSS empleado: {toPercentage(EMPLOYEE_CSS_RATE)}</p>
            <p>CSS empleador: {toPercentage(EMPLOYER_CSS_RATE)}</p>
            <p>
              Seguro educativo empleado: {toPercentage(EMPLOYEE_EDUCATIONAL_INSURANCE_RATE)}
            </p>
            <p>
              Seguro educativo empleador: {toPercentage(EMPLOYER_EDUCATIONAL_INSURANCE_RATE)}
            </p>
            <p>
              Riesgo profesional: {toPercentage(payrollSummary.professionalRiskRate)}
            </p>
            <p>ISR: 0% / 15% / 25% segun renta anualizada</p>
          </div>
        </article>

        <article className="print-card rounded-[2rem] border border-line bg-background p-6 shadow-sm">
          <p className="text-lg font-semibold text-foreground">Resultado por colaborador</p>
          <div className="mt-5 divide-y divide-line">
            {payrollSummary.employees.map((employee) => (
              <div key={employee.employee.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium text-foreground">
                    {employee.employee.fullName || "Sin nombre"}
                  </p>
                  <p className="text-sm text-muted">
                    {employee.employee.position || "Cargo sin definir"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{currency(employee.netPay)}</p>
                  <p className="text-sm text-muted">Neto a pagar</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
