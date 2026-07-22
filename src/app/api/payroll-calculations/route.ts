import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import type { PayrollInput } from "@/lib/payroll";
import {
  createSupabaseServerClient,
  isSupabaseAuthEnabled,
} from "@/lib/supabase/server";

const saveSchema = z.object({
  title: z.string().min(1),
  payrollInput: z.unknown(),
});

type PayrollCalculationRow = {
  id: string;
  title: string;
  payroll_input: PayrollInput;
  created_at: string;
  updated_at: string;
};

function mapCalculation(row: PayrollCalculationRow) {
  return {
    id: row.id,
    title: row.title,
    payrollInput: row.payroll_input,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  await requireAdmin();

  if (!isSupabaseAuthEnabled()) {
    return NextResponse.json({
      calculations: [],
      storageAvailable: false,
      message: "El guardado en Supabase requiere iniciar sesion con Supabase Auth.",
    });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payroll_calculations")
    .select("id,title,payroll_input,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    calculations: (data as PayrollCalculationRow[]).map(mapCalculation),
    storageAvailable: true,
  });
}

export async function POST(request: Request) {
  await requireAdmin();

  if (!isSupabaseAuthEnabled()) {
    return NextResponse.json(
      { message: "El guardado en Supabase requiere iniciar sesion con Supabase Auth." },
      { status: 400 },
    );
  }

  const payload = saveSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      { message: "Datos invalidos para guardar la planilla." },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payroll_calculations")
    .insert({
      title: payload.data.title.trim(),
      payroll_input: payload.data.payrollInput,
    })
    .select("id,title,payroll_input,created_at,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ calculation: mapCalculation(data as PayrollCalculationRow) });
}
