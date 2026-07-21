"use client";

import { useActionState } from "react";

import { submitLoginAction } from "@/app/login/actions";

const initialState = {
  message: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    submitLoginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
        Correo del administrador
        <input
          type="email"
          name="email"
          required
          className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
          placeholder="admin@planillapro.demo"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
        Contrasena
        <input
          type="password"
          name="password"
          required
          className="rounded-2xl border border-line bg-background px-4 py-3 outline-none"
          placeholder="********"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-2xl bg-panel-strong px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Validando..." : "Ingresar"}
      </button>
      {state.message ? (
        <p className="text-sm text-danger">{state.message}</p>
      ) : null}
    </form>
  );
}
