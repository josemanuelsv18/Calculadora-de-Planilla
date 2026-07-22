create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists payroll_calculations_created_by_idx
on public.payroll_calculations (created_by);

drop policy if exists "authenticated can manage own payroll calculations"
on public.payroll_calculations;
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

create policy "authenticated can manage own payroll calculations"
on public.payroll_calculations
for all
to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));

create policy "authenticated can manage employees"
on public.employees
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "authenticated can manage payroll periods"
on public.payroll_periods
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "authenticated can manage income items"
on public.employee_income_items
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "authenticated can manage deduction items"
on public.employee_deduction_items
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "authenticated can manage tax rules"
on public.tax_rules
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "authenticated can manage report logs"
on public.report_email_logs
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);
