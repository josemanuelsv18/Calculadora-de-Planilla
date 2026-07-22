"use client";

import { createContext, useContext, useState } from "react";
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

  const payrollSummary = buildPayrollSummary(payrollInput);

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
        addEmployee,
        removeEmployee,
        updateCompanyField,
        updateEmployeeField,
        updateEmployeeExtra,
        addDeduction,
        removeDeduction,
        updateDeduction,
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
