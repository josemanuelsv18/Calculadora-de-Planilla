"use client";

import { useState } from "react";

import { DashboardWorkspace } from "@/components/dashboard-workspace";
import { PayrollCalculatorPanel } from "@/components/payroll-calculator-panel";
import { usePayroll } from "@/components/payroll-provider";
import { ReportActions } from "@/components/report-actions";
import { currency, searchEmployees } from "@/lib/payroll";

export default function CollaboratorsPage() {
  const { payrollSummary } = usePayroll();
  const [query, setQuery] = useState("");
  const employees = searchEmployees(payrollSummary, query);

  return (
    <DashboardWorkspace
      header={
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Pantalla B
          </p>
          <h1 className="text-3xl font-semibold text-foreground">Busqueda de colaboradores</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Consulta salario base, otros ingresos, salario total, descuentos de ley y neto a pagar.
          </p>
        </header>
      }
      calculator={
        <PayrollCalculatorPanel
          title="Entrada de datos"
          description="Modifica la planilla y usa la busqueda para revisar rapidamente el detalle de cada colaborador."
        />
      }
      actions={
        <div className="space-y-4">
          <ReportActions reportType="colaboradores" />

          <form
            className="no-print content-card flex flex-col gap-3 rounded-3xl border border-line p-4 shadow-sm md:flex-row md:items-center"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, cedula o cargo"
              className="w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
            />
          </form>
        </div>
      }
    >
      <section className="space-y-4">
        {employees.map((item) => (
          <article
            key={item.employee.id}
            className="print-card content-card rounded-[2rem] border border-line p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {item.employee.fullName || "Sin nombre"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {item.employee.position || "Cargo sin definir"}
                </p>
              </div>
                <div className="rounded-3xl bg-soft px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Salario neto</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {currency(item.netPay)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {[
                ["Salario base", currency(item.basePay)],
                ["Otros ingresos", currency(item.otherIncomeTotal)],
                ["Salario total", currency(item.grossIncome)],
                ["Seguro social", currency(item.cssEmployee)],
                ["Seguro educativo", currency(item.educationalInsuranceEmployee)],
                ["ISR", currency(item.incomeTax)],
                ["Descuentos manuales", currency(item.manualDeductions)],
                ["Total descuentos", currency(item.totalDeductions)],
                ["Base CSS", currency(item.cssBase)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-line bg-panel p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-line bg-panel p-4">
                <p className="text-sm font-semibold text-foreground">Otros ingresos del periodo</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {item.incomes
                    .filter((income) => income.kind !== "base")
                    .map((income) => (
                      <li key={income.label} className="flex items-center justify-between gap-3">
                        <span>{income.label}</span>
                        <span className="font-medium text-foreground">
                          {currency(income.amount)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-4">
                <p className="text-sm font-semibold text-foreground">Detalle de descuentos</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {item.deductions.map((deduction) => (
                    <li key={deduction.label} className="flex items-center justify-between gap-3">
                      <span>{deduction.label}</span>
                      <span className="font-medium text-foreground">
                        {currency(deduction.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>
    </DashboardWorkspace>
  );
}
