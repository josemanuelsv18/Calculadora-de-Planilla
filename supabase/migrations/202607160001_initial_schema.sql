create extension if not exists pgcrypto;

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  external_code text unique not null,
  full_name text not null,
  cedula text not null,
  marital_status text not null,
  position text not null,
  start_year integer not null,
  start_date date not null,
  monthly_base_salary numeric(12,2) not null,
  group_number integer not null default 4,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  pay_frequency text not null default 'quincenal',
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.employee_income_items (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  payroll_period_id uuid not null references public.payroll_periods(id) on delete cascade,
  label text not null,
  amount numeric(12,2) not null,
  income_kind text not null,
  taxable_for_income_tax boolean not null default true,
  subject_to_css boolean not null default true,
  subject_to_educational_insurance boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.employee_deduction_items (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  payroll_period_id uuid not null references public.payroll_periods(id) on delete cascade,
  label text not null,
  amount numeric(12,2) not null,
  deduction_kind text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.tax_rules (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  value numeric(12,6) not null,
  description text not null,
  effective_from date not null,
  effective_to date,
  created_at timestamptz not null default now()
);

create table if not exists public.report_email_logs (
  id uuid primary key default gen_random_uuid(),
  report_type text not null,
  recipient_email text not null,
  status text not null,
  sent_at timestamptz not null default now()
);

alter table public.employees enable row level security;
alter table public.payroll_periods enable row level security;
alter table public.employee_income_items enable row level security;
alter table public.employee_deduction_items enable row level security;
alter table public.tax_rules enable row level security;
alter table public.report_email_logs enable row level security;

create policy "authenticated can manage employees"
on public.employees
for all
to authenticated
using (true)
with check (true);

create policy "anon can read employees for demo"
on public.employees
for select
to anon
using (true);

create policy "authenticated can manage payroll periods"
on public.payroll_periods
for all
to authenticated
using (true)
with check (true);

create policy "anon can read payroll periods for demo"
on public.payroll_periods
for select
to anon
using (true);

create policy "authenticated can manage income items"
on public.employee_income_items
for all
to authenticated
using (true)
with check (true);

create policy "anon can read income items for demo"
on public.employee_income_items
for select
to anon
using (true);

create policy "authenticated can manage deduction items"
on public.employee_deduction_items
for all
to authenticated
using (true)
with check (true);

create policy "anon can read deduction items for demo"
on public.employee_deduction_items
for select
to anon
using (true);

create policy "authenticated can manage tax rules"
on public.tax_rules
for all
to authenticated
using (true)
with check (true);

create policy "anon can read tax rules for demo"
on public.tax_rules
for select
to anon
using (true);

create policy "authenticated can manage report logs"
on public.report_email_logs
for all
to authenticated
using (true)
with check (true);
