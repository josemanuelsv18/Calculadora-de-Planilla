import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { serializeReportForEmail } from "@/lib/payroll";

const schema = z.object({
  reportType: z.enum(["personal", "colaboradores", "planilla"]),
  recipient: z.email(),
});

export async function POST(request: Request) {
  await requireAdmin();

  const payload = schema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      { message: "Solicitud invalida para envio de correo." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY || !process.env.REPORT_EMAIL_FROM) {
    return NextResponse.json(
      {
        message:
          "El envio esta preparado, pero falta configurar RESEND_API_KEY y REPORT_EMAIL_FROM.",
      },
      { status: 400 },
    );
  }

  const report = serializeReportForEmail(payload.data.reportType);
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.REPORT_EMAIL_FROM,
    to: payload.data.recipient,
    subject: report.title,
    text: report.body,
  });

  return NextResponse.json({
    message: `Reporte enviado a ${payload.data.recipient}.`,
  });
}
