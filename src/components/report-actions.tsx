"use client";

import { useState, useTransition } from "react";

type ReportActionsProps = {
  reportType: "personal" | "colaboradores" | "planilla";
};

export function ReportActions({ reportType }: ReportActionsProps) {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="no-print flex flex-col gap-3 rounded-3xl border border-line bg-panel p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">Acciones del reporte</p>
        <p className="text-sm text-muted">
          Imprime el reporte o envialo por correo desde la interfaz.
        </p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-panel-strong px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Imprimir
        </button>
        <input
          type="email"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="correo@destino.com"
          className="min-w-56 rounded-full border border-line bg-background px-4 py-2 text-sm outline-none ring-0"
        />
        <button
          type="button"
          onClick={() => {
            startTransition(async () => {
              setMessage("");

              const response = await fetch("/api/reports/email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ reportType, recipient }),
              });

              const payload = (await response.json()) as { message: string };
              setMessage(payload.message);
            });
          }}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
          disabled={isPending || !recipient}
        >
          {isPending ? "Enviando..." : "Enviar por correo"}
        </button>
      </div>
      {message ? <p className="text-sm text-muted md:ml-3">{message}</p> : null}
    </div>
  );
}
