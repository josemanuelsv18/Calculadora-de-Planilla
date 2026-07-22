"use client";

import { PayrollCalculatorPanel } from "@/components/payroll-calculator-panel";
import { usePayroll } from "@/components/payroll-provider";
import { ReportActions } from "@/components/report-actions";
import { currency } from "@/lib/payroll";

export default function PersonalPage() {
  const { payrollSummary } = usePayroll();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          Pantalla A
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Datos del personal</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          Nombre completo, salario base, cedula, estado civil, cargo, anio e inicio de labores.
        </p>
      </header>

      <PayrollCalculatorPanel
        title="Datos de entrada"
        description="Edita aqui la informacion base de la empresa y del personal antes de imprimir o enviar el reporte."
      />

      <ReportActions reportType="personal" />

      <section className="grid gap-4 xl:grid-cols-2">
        {payrollSummary.employees.map((item) => (
          <article
            key={item.employee.id}
            className="print-card rounded-[2rem] border border-line bg-background p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {item.employee.fullName || "Sin nombre"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {item.employee.position || "Cargo sin definir"}
                </p>
              </div>
              <span className="rounded-full bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {item.employee.cedula || "Sin cedula"}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Cedula
                </dt>
                <dd className="mt-1 text-sm text-foreground">{item.employee.cedula || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Estado civil
                </dt>
                <dd className="mt-1 text-sm text-foreground">{item.employee.maritalStatus}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Salario base mensual
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {currency(item.employee.monthlyBaseSalary)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Anio de inicio
                </dt>
                <dd className="mt-1 text-sm text-foreground">{item.employee.startYear || "-"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Inicio de labores
                </dt>
                <dd className="mt-1 text-sm text-foreground">{item.employee.startDate || "-"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Notas
                </dt>
                <dd className="mt-1 text-sm text-foreground">{item.employee.notes || "-"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
