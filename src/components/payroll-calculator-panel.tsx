"use client";

import { usePayroll } from "@/components/payroll-provider";
import { currency, toPercentage } from "@/lib/payroll";

type PayrollCalculatorPanelProps = {
  title?: string;
  description?: string;
};

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function PayrollCalculatorPanel({
  title = "Constructor de planilla",
  description = "Ingresa los datos de la empresa y de cada colaborador para calcular la planilla.",
}: PayrollCalculatorPanelProps) {
  const {
    payrollInput,
    payrollSummary,
    addEmployee,
    removeEmployee,
    updateCompanyField,
    updateEmployeeField,
    updateEmployeeExtra,
    addDeduction,
    removeDeduction,
    updateDeduction,
  } = usePayroll();

  return (
    <section className="no-print rounded-[2rem] border border-line bg-background p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Calculadora
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-panel px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Colaboradores</p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {payrollInput.employees.length}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-panel px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Bruto total</p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {currency(payrollSummary.totals.grossIncome)}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-panel px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Neto total</p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {currency(payrollSummary.totals.netPay)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Empresa
            <input
              type="text"
              value={payrollInput.companyName}
              onChange={(event) => updateCompanyField("companyName", event.target.value)}
              className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
              placeholder="Mi empresa"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Periodo
            <input
              type="text"
              value={payrollInput.periodLabel}
              onChange={(event) => updateCompanyField("periodLabel", event.target.value)}
              className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
              placeholder="Segunda quincena de junio 2026"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Actividad
            <input
              type="text"
              value={payrollInput.activity}
              onChange={(event) => updateCompanyField("activity", event.target.value)}
              className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
              placeholder="Actividad economica"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Ubicacion
            <input
              type="text"
              value={payrollInput.location}
              onChange={(event) => updateCompanyField("location", event.target.value)}
              className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
              placeholder="Ciudad de Panama"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Horas semanales
            <input
              type="number"
              min="0"
              step="1"
              value={payrollInput.weeklyHours}
              onChange={(event) =>
                updateCompanyField("weeklyHours", parseNumber(event.target.value))
              }
              className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Riesgo profesional
            <input
              type="number"
              min="0"
              step="0.0001"
              value={payrollInput.professionalRiskRate}
              onChange={(event) =>
                updateCompanyField(
                  "professionalRiskRate",
                  parseNumber(event.target.value),
                )
              }
              className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          Referencia normativa
          <textarea
            value={payrollInput.minimumWageReference}
            onChange={(event) =>
              updateCompanyField("minimumWageReference", event.target.value)
            }
            className="min-h-36 rounded-[1.5rem] border border-line bg-panel px-4 py-3 outline-none"
            placeholder="Norma o referencia salarial usada"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-sm text-muted">
          CSS empleado {toPercentage(0.0975)} | CSS empleador {toPercentage(0.1325)} | Seguro educativo empleado {toPercentage(0.0125)} | Seguro educativo empleador {toPercentage(0.015)}
        </div>
        <button
          type="button"
          onClick={addEmployee}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
        >
          Agregar colaborador
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {payrollInput.employees.map((employee, employeeIndex) => (
          <article key={employee.id} className="rounded-[2rem] border border-line bg-panel p-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                  Colaborador {employeeIndex + 1}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {employee.fullName || "Sin nombre"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeEmployee(employee.id)}
                disabled={payrollInput.employees.length === 1}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-50"
              >
                Eliminar colaborador
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Nombre completo
                <input
                  type="text"
                  value={employee.fullName}
                  onChange={(event) =>
                    updateEmployeeField(employee.id, "fullName", event.target.value)
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Cedula
                <input
                  type="text"
                  value={employee.cedula}
                  onChange={(event) =>
                    updateEmployeeField(employee.id, "cedula", event.target.value)
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Cargo
                <input
                  type="text"
                  value={employee.position}
                  onChange={(event) =>
                    updateEmployeeField(employee.id, "position", event.target.value)
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Estado civil
                <select
                  value={employee.maritalStatus}
                  onChange={(event) =>
                    updateEmployeeField(
                      employee.id,
                      "maritalStatus",
                      event.target.value as typeof employee.maritalStatus,
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                >
                  <option value="soltero">Soltero</option>
                  <option value="casado">Casado</option>
                  <option value="declara conjuntamente">Declara conjuntamente</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Salario base mensual
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employee.monthlyBaseSalary}
                  onChange={(event) =>
                    updateEmployeeField(
                      employee.id,
                      "monthlyBaseSalary",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Anio de inicio
                <input
                  type="number"
                  min="1900"
                  step="1"
                  value={employee.startYear}
                  onChange={(event) =>
                    updateEmployeeField(
                      employee.id,
                      "startYear",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Fecha de inicio
                <input
                  type="date"
                  value={employee.startDate}
                  onChange={(event) =>
                    updateEmployeeField(employee.id, "startDate", event.target.value)
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground md:col-span-2 xl:col-span-1">
                Notas
                <input
                  type="text"
                  value={employee.notes ?? ""}
                  onChange={(event) =>
                    updateEmployeeField(employee.id, "notes", event.target.value)
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Bonificacion general
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employee.periodExtras.companyBonus ?? 0}
                  onChange={(event) =>
                    updateEmployeeExtra(
                      employee.id,
                      "companyBonus",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Prima de produccion
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employee.periodExtras.productionBonus ?? 0}
                  onChange={(event) =>
                    updateEmployeeExtra(
                      employee.id,
                      "productionBonus",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Dieta o asignacion
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employee.periodExtras.oneTimeAllowance ?? 0}
                  onChange={(event) =>
                    updateEmployeeExtra(
                      employee.id,
                      "oneTimeAllowance",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Tasa de comision
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={employee.periodExtras.commissionRate ?? 0}
                  onChange={(event) =>
                    updateEmployeeExtra(
                      employee.id,
                      "commissionRate",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Base de comision
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employee.periodExtras.commissionBase ?? 0}
                  onChange={(event) =>
                    updateEmployeeExtra(
                      employee.id,
                      "commissionBase",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Horas extra
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employee.periodExtras.overtimeHours ?? 0}
                  onChange={(event) =>
                    updateEmployeeExtra(
                      employee.id,
                      "overtimeHours",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Horas extra sabado
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employee.periodExtras.saturdayOvertimeHours ?? 0}
                  onChange={(event) =>
                    updateEmployeeExtra(
                      employee.id,
                      "saturdayOvertimeHours",
                      parseNumber(event.target.value),
                    )
                  }
                  className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-line bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Descuentos mensuales</p>
                  <p className="text-sm text-muted">
                    La calculadora divide cada descuento mensual entre dos quincenas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addDeduction(employee.id)}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Agregar descuento
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {employee.monthlyDeductions.length ? (
                  employee.monthlyDeductions.map((deduction, deductionIndex) => (
                    <div
                      key={`${employee.id}-${deductionIndex}`}
                      className="grid gap-3 md:grid-cols-[1fr_180px_auto]"
                    >
                      <input
                        type="text"
                        value={deduction.label}
                        onChange={(event) =>
                          updateDeduction(
                            employee.id,
                            deductionIndex,
                            "label",
                            event.target.value,
                          )
                        }
                        placeholder="Prestamo, ahorro, adelanto..."
                        className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={deduction.amount}
                        onChange={(event) =>
                          updateDeduction(
                            employee.id,
                            deductionIndex,
                            "amount",
                            parseNumber(event.target.value),
                          )
                        }
                        className="rounded-2xl border border-line bg-panel px-4 py-3 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeDeduction(employee.id, deductionIndex)}
                        className="rounded-2xl border border-line px-4 py-3 text-sm font-semibold text-foreground"
                      >
                        Quitar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">Este colaborador no tiene descuentos manuales.</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
