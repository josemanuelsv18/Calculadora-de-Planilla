alter table public.employees alter column group_number drop default;

create index if not exists employee_income_items_employee_id_idx
on public.employee_income_items (employee_id);

create index if not exists employee_income_items_payroll_period_id_idx
on public.employee_income_items (payroll_period_id);

create index if not exists employee_deduction_items_employee_id_idx
on public.employee_deduction_items (employee_id);

create index if not exists employee_deduction_items_payroll_period_id_idx
on public.employee_deduction_items (payroll_period_id);

create table if not exists public.payroll_calculations (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Planilla sin titulo',
  payroll_input jsonb not null,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payroll_calculations enable row level security;

drop policy if exists "authenticated can manage own payroll calculations"
on public.payroll_calculations;

create policy "authenticated can manage own payroll calculations"
on public.payroll_calculations
for all
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists payroll_calculations_set_updated_at
on public.payroll_calculations;

create trigger payroll_calculations_set_updated_at
before update on public.payroll_calculations
for each row
execute function public.set_updated_at();

drop policy if exists "authenticated can manage employees"
on public.employees;
drop policy if exists "authenticated can manage payroll periods"
on public.payroll_periods;
drop policy if exists "authenticated can manage income items"
on public.employee_income_items;
drop policy if exists "authenticated can manage deduction items"
on public.employee_deduction_items;
drop policy if exists "authenticated can manage tax rules"
on public.tax_rules;
drop policy if exists "authenticated can manage report logs"
on public.report_email_logs;

create policy "authenticated can manage employees"
on public.employees
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "authenticated can manage payroll periods"
on public.payroll_periods
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "authenticated can manage income items"
on public.employee_income_items
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "authenticated can manage deduction items"
on public.employee_deduction_items
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "authenticated can manage tax rules"
on public.tax_rules
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "authenticated can manage report logs"
on public.report_email_logs
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);
