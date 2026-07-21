import { ReportActions } from "@/components/report-actions";
import { currency, getGroup4PayrollSummary } from "@/lib/payroll";

export default function PayrollPage() {
  const summary = getGroup4PayrollSummary();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          Pantalla C
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Reporte de planilla</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          Resumen de la segunda quincena de junio 2026, incluyendo pagos netos, descuentos y aportes patronales para CSS.
        </p>
      </header>

      <ReportActions reportType="planilla" />

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          ["Bruto total", currency(summary.totals.grossIncome)],
          ["Deducciones totales", currency(summary.totals.totalDeductions)],
          ["Neto total", currency(summary.totals.netPay)],
          ["Carga patronal", currency(summary.totals.employerBurdenTotal)],
        ].map(([label, value]) => (
          <article key={label} className="print-card rounded-[2rem] border border-line bg-background p-5 shadow-sm">
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
              {summary.employees.map((employee) => (
                <tr key={employee.employee.id} className="border-t border-line">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{employee.employee.fullName}</p>
                    <p className="text-xs text-muted">{employee.employee.position}</p>
                  </td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.basePay)}</td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.otherIncomeTotal)}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{currency(employee.grossIncome)}</td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.cssEmployee)}</td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.educationalInsuranceEmployee)}</td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.incomeTax)}</td>
                  <td className="px-6 py-4 text-foreground">{currency(employee.totalDeductions)}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{currency(employee.netPay)}</td>
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
              ["CSS empleado total", currency(summary.totals.cssEmployee)],
              [
                "Seguro educativo empleado",
                currency(summary.totals.educationalInsuranceEmployee),
              ],
              ["CSS empleador total", currency(summary.totals.employerCss)],
              [
                "Seguro educativo empleador",
                currency(summary.totals.employerEducationalInsurance),
              ],
              [
                "Riesgo profesional empleador",
                currency(summary.totals.employerProfessionalRisk),
              ],
              ["Total cargas patronales", currency(summary.totals.employerBurdenTotal)],
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
            <li>CSS empleado 9.75% y empleador 13.25%.</li>
            <li>Seguro educativo empleado 1.25% y empleador 1.50%.</li>
            <li>Riesgo profesional configurado en 0.56% para esta demo.</li>
            <li>Horas extra diurnas con recargo de 25%.</li>
            <li>Deducciones mensuales privadas distribuidas en dos quincenas.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
