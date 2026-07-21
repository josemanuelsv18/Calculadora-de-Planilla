insert into public.payroll_periods (id, label, pay_frequency, period_start, period_end)
values (
  '7d16cf1f-6e88-462d-8d6a-16f6b883f33a',
  'Segunda quincena de junio 2026',
  'quincenal',
  '2026-06-16',
  '2026-06-30'
)
on conflict do nothing;

insert into public.employees (
  id,
  external_code,
  full_name,
  cedula,
  marital_status,
  position,
  start_year,
  start_date,
  monthly_base_salary,
  group_number,
  notes
)
values
  (
    '4d70f0b5-74f0-4f2b-a9e7-6f19d5517bb0',
    'g4-jose-gonzalez',
    'Jose Gonzalez',
    '4-590-678',
    'casado',
    'Reparador de calle',
    2021,
    '2021-01-15',
    600,
    4,
    'Prima de produccion reportada para esta quincena.'
  ),
  (
    '61189b68-d8f2-4fd4-b6ba-c624e69af274',
    'g4-rafael-fernandez',
    'Rafael Fernandez',
    '10-400-390',
    'soltero',
    'Supervisora de planta',
    2020,
    '2020-02-10',
    1000,
    4,
    'Dieta por capacitacion en Costa Rica reportada para este periodo.'
  ),
  (
    '331cf2b7-c3dd-4580-a9f4-6808cd5fd18d',
    'g4-mariano-ramos',
    'Mariano Ramos',
    '5-789-352',
    'soltero',
    'Analista supervisor',
    2019,
    '2019-04-01',
    900,
    4,
    'Comision del 2% sobre ventas por B/.9,000 en esta quincena.'
  ),
  (
    'db11dfc8-93b1-4fd0-aa96-c9eca6c4d0d9',
    'g4-gloria-benitez',
    'Gloria Benitez',
    '5-230-456',
    'declara conjuntamente',
    'Secretaria',
    2022,
    '2022-05-18',
    870,
    4,
    'Horas extra: lunes 3, jueves 3, sabado 3.'
  )
on conflict do nothing;

insert into public.tax_rules (code, value, description, effective_from)
values
  ('employee_css_rate', 0.0975, 'Cuota CSS empleado', '2025-04-01'),
  ('employer_css_rate', 0.1325, 'Cuota CSS empleador', '2025-04-01'),
  ('employee_educational_insurance_rate', 0.0125, 'Seguro educativo empleado', '1971-07-27'),
  ('employer_educational_insurance_rate', 0.0150, 'Seguro educativo empleador', '1971-07-27'),
  ('professional_risk_demo_rate', 0.0056, 'Riesgo profesional configurado para la demo', '2026-01-01')
on conflict (code) do nothing;

insert into public.employee_income_items (
  employee_id,
  payroll_period_id,
  label,
  amount,
  income_kind,
  taxable_for_income_tax,
  subject_to_css,
  subject_to_educational_insurance
)
values
  ('4d70f0b5-74f0-4f2b-a9e7-6f19d5517bb0', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Salario base quincenal', 300.00, 'base', true, true, true),
  ('4d70f0b5-74f0-4f2b-a9e7-6f19d5517bb0', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Bonificacion general', 120.00, 'bonus', true, true, true),
  ('4d70f0b5-74f0-4f2b-a9e7-6f19d5517bb0', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Prima de produccion', 600.00, 'production', true, false, false),
  ('61189b68-d8f2-4fd4-b6ba-c624e69af274', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Salario base quincenal', 500.00, 'base', true, true, true),
  ('61189b68-d8f2-4fd4-b6ba-c624e69af274', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Bonificacion general', 120.00, 'bonus', true, true, true),
  ('61189b68-d8f2-4fd4-b6ba-c624e69af274', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Dieta / asignacion especial', 5000.00, 'allowance', true, false, false),
  ('331cf2b7-c3dd-4580-a9f4-6808cd5fd18d', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Salario base quincenal', 450.00, 'base', true, true, true),
  ('331cf2b7-c3dd-4580-a9f4-6808cd5fd18d', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Bonificacion general', 120.00, 'bonus', true, true, true),
  ('331cf2b7-c3dd-4580-a9f4-6808cd5fd18d', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Comision del periodo', 180.00, 'commission', true, true, true),
  ('db11dfc8-93b1-4fd0-aa96-c9eca6c4d0d9', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Salario base quincenal', 435.00, 'base', true, true, true),
  ('db11dfc8-93b1-4fd0-aa96-c9eca6c4d0d9', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Bonificacion general', 120.00, 'bonus', true, true, true),
  ('db11dfc8-93b1-4fd0-aa96-c9eca6c4d0d9', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Horas extra', 33.46, 'overtime', true, true, true)
on conflict do nothing;

insert into public.employee_deduction_items (
  employee_id,
  payroll_period_id,
  label,
  amount,
  deduction_kind
)
values
  ('4d70f0b5-74f0-4f2b-a9e7-6f19d5517bb0', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Prestamo', 100.00, 'manual'),
  ('61189b68-d8f2-4fd4-b6ba-c624e69af274', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Muebleria', 150.00, 'manual'),
  ('331cf2b7-c3dd-4580-a9f4-6808cd5fd18d', '7d16cf1f-6e88-462d-8d6a-16f6b883f33a', 'Ahorro empresa', 100.00, 'manual')
on conflict do nothing;
