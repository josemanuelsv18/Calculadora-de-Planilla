"use client";

import { PayrollCalculatorPanel } from "@/components/payroll-calculator-panel";
import { usePayroll } from "@/components/payroll-provider";
import { ReportActions } from "@/components/report-actions";
import {
  currency,
  EMPLOYEE_CSS_RATE,
  EMPLOYEE_EDUCATIONAL_INSURANCE_RATE,
  EMPLOYER_CSS_RATE,
  EMPLOYER_EDUCATIONAL_INSURANCE_RATE,
  toPercentage,
} from "@/lib/payroll";

export default function PayrollPage() {
  const { payrollSummary } = usePayroll();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          Pantalla C
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Reporte de planilla</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          Resumen del periodo calculado, incluyendo pagos netos, descuentos y aportes patronales para CSS.
        </p>
      </header>

      <PayrollCalculatorPanel
        title="Entrada para el reporte"
        description="Los datos que ingreses aqui alimentan el reporte de planilla, impresion y envio por correo."
      />

      <ReportActions reportType="planilla" />

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          ["Bruto total", currency(payrollSummary.totals.grossIncome)],
          ["Deducciones totales", currency(payrollSummary.totals.totalDeductions)],
          ["Neto total", currency(payrollSummary.totals.netPay)],
          ["Carga patronal", currency(payrollSummary.totals.employerBurdenTotal)],
        ].map(([label, value]) => (
          <article
            key={label}
            className="print-card rounded-[2rem] border border-line bg-background p-5 shadow-sm"
          >
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-foreground">{value}</p>
          </article>
        ))}
      </section>

      <section className="print-card overflow-hidden rounded-[2rem] border border-line bg-background shadow-sm">
        <div className="border-b border-line px-6 py-5">
          <h2 className="text-xl font-semibold text-foreground">Planilla por colaborador</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-panel text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Colaborador</th>
                <th className="px-6 py-4 font-medium">Base</th>
                <th className="px-6 py-4 font-medium">Otros ingresos</th>
                <th className="px-6 py-4 font-medium">Bruto</th>
                <th className="px-6 py-4 font-medium">CSS</th>
                <th className="px-6 py-4 font-medium">SE</th>
                <th className="px-6 py-4 font-medium">ISR</th>
                <th className="px-6 py-4 font-medium">Descuentos</th>
                <th className="px-6 py-4 font-medium">Neto</th>
              </tr>
            </thead>
            <tbody>
              {payrollSummary.employees.map((employee) => (
                <tr key={employee.employee.id} className="border-t border-line">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">
                      {employee.employee.fullName || "Sin nombre"}
                    </p>
                    <p className="text-xs text-muted">
                      {employee.employee.position || "Cargo sin definir"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.basePay)}</td>
                  <td className="px-6 py-4 text-foreground">
                    {currency(employee.otherIncomeTotal)}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {currency(employee.grossIncome)}
                  </td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.cssEmployee)}</td>
                  <td className="px-6 py-4 text-foreground">
                    {currency(employee.educationalInsuranceEmployee)}
                  </td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.incomeTax)}</td>
                  <td className="px-6 py-4 text-foreground">
                    {currency(employee.totalDeductions)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {currency(employee.netPay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="print-card rounded-[2rem] border border-line bg-background p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Reporte para Caja de Seguro Social</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["CSS empleado total", currency(payrollSummary.totals.cssEmployee)],
              [
                "Seguro educativo empleado",
                currency(payrollSummary.totals.educationalInsuranceEmployee),
              ],
              ["CSS empleador total", currency(payrollSummary.totals.employerCss)],
              [
                "Seguro educativo empleador",
                currency(payrollSummary.totals.employerEducationalInsurance),
              ],
              [
                "Riesgo profesional empleador",
                currency(payrollSummary.totals.employerProfessionalRisk),
              ],
              ["Total cargas patronales", currency(payrollSummary.totals.employerBurdenTotal)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line bg-panel p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="print-card rounded-[2rem] border border-line bg-background p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Base normativa usada</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
            <li>ISR anualizado con tramos 0%, 15% y 25%.</li>
            <li>CSS empleado {toPercentage(EMPLOYEE_CSS_RATE)} y empleador {toPercentage(EMPLOYER_CSS_RATE)}.</li>
            <li>
              Seguro educativo empleado {toPercentage(EMPLOYEE_EDUCATIONAL_INSURANCE_RATE)} y empleador {toPercentage(EMPLOYER_EDUCATIONAL_INSURANCE_RATE)}.
            </li>
            <li>
              Riesgo profesional configurado en {toPercentage(payrollSummary.professionalRiskRate)} para este calculo.
            </li>
            <li>Horas extra diurnas con recargo de 25%.</li>
            <li>Deducciones mensuales privadas distribuidas en dos quincenas.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
