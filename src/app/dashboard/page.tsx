import Link from "next/link";
import { ArrowRight, Building2, Calculator, ShieldCheck } from "lucide-react";

import { currency, getGroup4PayrollSummary, REPORT_CARDS } from "@/lib/payroll";

export default function DashboardPage() {
  const summary = getGroup4PayrollSummary();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-panel-strong p-6 text-white md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Centro de reportes
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Visualiza, calcula e imprime la planilla del grupo 4.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72 md:text-base">
              Demo con login administrativo simple, reglas vigentes para Panama y reportes listos para correo e impresion.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm text-white/78">
            <p>{summary.companyName}</p>
            <p>{summary.periodLabel}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total bruto",
            value: currency(summary.totals.grossIncome),
            icon: <Calculator size={18} />,
          },
          {
            label: "Total deducciones",
            value: currency(summary.totals.totalDeductions),
            icon: <ShieldCheck size={18} />,
          },
          {
            label: "Total neto",
            value: currency(summary.totals.netPay),
            icon: <Building2 size={18} />,
          },
          {
            label: "Cargas patronales",
            value: currency(summary.totals.employerBurdenTotal),
            icon: <ArrowRight size={18} />,
          },
        ].map((item) => (
          <article key={item.label} className="print-card rounded-3xl border border-line bg-background p-5 shadow-sm">
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
            <p>CSS empleado: 9.75%</p>
            <p>CSS empleador: 13.25%</p>
            <p>Seguro educativo empleado: 1.25%</p>
            <p>Seguro educativo empleador: 1.50%</p>
            <p>Riesgo profesional: 0.56%</p>
            <p>ISR: 0% / 15% / 25% segun renta anualizada</p>
          </div>
        </article>

        <article className="print-card rounded-[2rem] border border-line bg-background p-6 shadow-sm">
          <p className="text-lg font-semibold text-foreground">Colaboradores en prueba</p>
          <div className="mt-5 divide-y divide-line">
            {summary.employees.map((employee) => (
              <div key={employee.employee.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium text-foreground">{employee.employee.fullName}</p>
                  <p className="text-sm text-muted">{employee.employee.position}</p>
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
