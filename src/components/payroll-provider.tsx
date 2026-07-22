"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  buildPayrollSummary,
  DEFAULT_PAYROLL_INPUT,
  type EmployeePayrollInput,
  type PayrollInput,
} from "@/lib/payroll";

type PayrollContextValue = {
  payrollInput: PayrollInput;
  payrollSummary: ReturnType<typeof buildPayrollSummary>;
  savedCalculations: SavedPayrollCalculation[];
  activeCalculationId: string;
  isStorageBusy: boolean;
  storageAvailable: boolean;
  storageMessage: string;
  addEmployee: () => void;
  removeEmployee: (employeeId: string) => void;
  updateCompanyField: <K extends keyof PayrollInput>(field: K, value: PayrollInput[K]) => void;
  updateEmployeeField: <K extends keyof EmployeePayrollInput>(
    employeeId: string,
    field: K,
    value: EmployeePayrollInput[K],
  ) => void;
  updateEmployeeExtra: (
    employeeId: string,
    field: keyof EmployeePayrollInput["periodExtras"],
    value: number,
  ) => void;
  addDeduction: (employeeId: string) => void;
  removeDeduction: (employeeId: string, index: number) => void;
  updateDeduction: (
    employeeId: string,
    index: number,
    field: "label" | "amount",
    value: string | number,
  ) => void;
  refreshSavedCalculations: () => Promise<void>;
  saveCurrentPayroll: () => Promise<void>;
  loadPayrollCalculation: (calculationId: string) => Promise<void>;
};

export type SavedPayrollCalculation = {
  id: string;
  title: string;
  payrollInput?: PayrollInput;
  createdAt: string;
  updatedAt: string;
};

const PayrollContext = createContext<PayrollContextValue | null>(null);

function createEmployee(): EmployeePayrollInput {
  return {
    id: crypto.randomUUID(),
    fullName: "",
    cedula: "",
    maritalStatus: "soltero",
    position: "",
    startYear: new Date().getFullYear(),
    startDate: "",
    monthlyBaseSalary: 0,
    notes: "",
    periodExtras: {
      companyBonus: 0,
      productionBonus: 0,
      oneTimeAllowance: 0,
      commissionRate: 0,
      commissionBase: 0,
      overtimeHours: 0,
      saturdayOvertimeHours: 0,
    },
    monthlyDeductions: [],
  };
}

export function PayrollProvider({ children }: { children: ReactNode }) {
  const [payrollInput, setPayrollInput] = useState<PayrollInput>({
    ...DEFAULT_PAYROLL_INPUT,
    employees: [createEmployee()],
  });
  const [savedCalculations, setSavedCalculations] = useState<SavedPayrollCalculation[]>([]);
  const [activeCalculationId, setActiveCalculationId] = useState("");
  const [isStorageBusy, setIsStorageBusy] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");

  const payrollSummary = buildPayrollSummary(payrollInput);

  useEffect(() => {
    void refreshSavedCalculations();
  }, []);

  function getPayrollTitle() {
    const company = payrollInput.companyName.trim() || "Planilla";
    const period = payrollInput.periodLabel.trim() || "Periodo sin definir";

    return `${company} - ${period}`;
  }

  async function refreshSavedCalculations() {
    setIsStorageBusy(true);

    try {
      const response = await fetch("/api/payroll-calculations");
      const payload = (await response.json()) as {
        calculations?: SavedPayrollCalculation[];
        storageAvailable?: boolean;
        message?: string;
      };

      setSavedCalculations(payload.calculations ?? []);
      setStorageAvailable(Boolean(payload.storageAvailable));
      setStorageMessage(
        payload.message ??
          (payload.storageAvailable
            ? "Supabase esta listo para guardar planillas."
            : ""),
      );
    } catch {
      setStorageAvailable(false);
      setStorageMessage("No se pudo consultar Supabase para planillas guardadas.");
    } finally {
      setIsStorageBusy(false);
    }
  }

  async function saveCurrentPayroll() {
    setIsStorageBusy(true);

    try {
      const response = await fetch(
        activeCalculationId
          ? `/api/payroll-calculations/${activeCalculationId}`
          : "/api/payroll-calculations",
        {
          method: activeCalculationId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: getPayrollTitle(),
            payrollInput,
          }),
        },
      );
      const payload = (await response.json()) as {
        calculation?: SavedPayrollCalculation;
        message?: string;
      };

      if (!response.ok || !payload.calculation) {
        setStorageMessage(payload.message ?? "No se pudo guardar la planilla.");
        return;
      }

      setActiveCalculationId(payload.calculation.id);
      setStorageMessage("Planilla guardada en Supabase.");
      await refreshSavedCalculations();
    } catch {
      setStorageMessage("No se pudo guardar la planilla en Supabase.");
    } finally {
      setIsStorageBusy(false);
    }
  }

  async function loadPayrollCalculation(calculationId: string) {
    if (!calculationId) {
      setActiveCalculationId("");
      return;
    }

    setIsStorageBusy(true);

    try {
      const response = await fetch(`/api/payroll-calculations/${calculationId}`);
      const payload = (await response.json()) as {
        calculation?: SavedPayrollCalculation;
        message?: string;
      };

      if (!response.ok || !payload.calculation?.payrollInput) {
        setStorageMessage(payload.message ?? "No se pudo cargar la planilla.");
        return;
      }

      setPayrollInput(payload.calculation.payrollInput);
      setActiveCalculationId(payload.calculation.id);
      setStorageMessage("Planilla cargada desde Supabase.");
    } catch {
      setStorageMessage("No se pudo cargar la planilla desde Supabase.");
    } finally {
      setIsStorageBusy(false);
    }
  }

  function updateCompanyField<K extends keyof PayrollInput>(
    field: K,
    value: PayrollInput[K],
  ) {
    setPayrollInput((current) => ({ ...current, [field]: value }));
  }

  function updateEmployeeField<K extends keyof EmployeePayrollInput>(
    employeeId: string,
    field: K,
    value: EmployeePayrollInput[K],
  ) {
    setPayrollInput((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId ? { ...employee, [field]: value } : employee,
      ),
    }));
  }

  function updateEmployeeExtra(
    employeeId: string,
    field: keyof EmployeePayrollInput["periodExtras"],
    value: number,
  ) {
    setPayrollInput((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId
          ? {
              ...employee,
              periodExtras: {
                ...employee.periodExtras,
                [field]: value,
              },
            }
          : employee,
      ),
    }));
  }

  function addEmployee() {
    setPayrollInput((current) => ({
      ...current,
      employees: [...current.employees, createEmployee()],
    }));
  }

  function removeEmployee(employeeId: string) {
    setPayrollInput((current) => ({
      ...current,
      employees:
        current.employees.length > 1
          ? current.employees.filter((employee) => employee.id !== employeeId)
          : current.employees,
    }));
  }

  function addDeduction(employeeId: string) {
    setPayrollInput((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId
          ? {
              ...employee,
              monthlyDeductions: [
                ...employee.monthlyDeductions,
                { label: "", amount: 0 },
              ],
            }
          : employee,
      ),
    }));
  }

  function removeDeduction(employeeId: string, index: number) {
    setPayrollInput((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId
          ? {
              ...employee,
              monthlyDeductions: employee.monthlyDeductions.filter(
                (_deduction, deductionIndex) => deductionIndex !== index,
              ),
            }
          : employee,
      ),
    }));
  }

  function updateDeduction(
    employeeId: string,
    index: number,
    field: "label" | "amount",
    value: string | number,
  ) {
    setPayrollInput((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId
          ? {
              ...employee,
              monthlyDeductions: employee.monthlyDeductions.map(
                (deduction, deductionIndex) =>
                  deductionIndex === index
                    ? {
                        ...deduction,
                        [field]: value,
                      }
                    : deduction,
              ),
            }
          : employee,
      ),
    }));
  }

  return (
    <PayrollContext.Provider
      value={{
        payrollInput,
        payrollSummary,
        savedCalculations,
        activeCalculationId,
        isStorageBusy,
        storageAvailable,
        storageMessage,
        addEmployee,
        removeEmployee,
        updateCompanyField,
        updateEmployeeField,
        updateEmployeeExtra,
        addDeduction,
        removeDeduction,
        updateDeduction,
        refreshSavedCalculations,
        saveCurrentPayroll,
        loadPayrollCalculation,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
}

export function usePayroll() {
  const context = useContext(PayrollContext);

  if (!context) {
    throw new Error("usePayroll must be used inside PayrollProvider");
  }

  return context;
}
