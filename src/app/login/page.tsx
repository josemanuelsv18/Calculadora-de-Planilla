import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getAuthenticatedAdmin, getDemoCredentials } from "@/lib/auth";
import { isSupabaseAuthEnabled } from "@/lib/supabase/server";

export default async function LoginPage() {
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    redirect("/dashboard");
  }

  const demoCredentials = getDemoCredentials();
  const supabaseReady = isSupabaseAuthEnabled();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-panel-strong p-8 text-white shadow-2xl md:p-10">
          <span className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            Calculadora de planilla
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
            Construye cualquier planilla para Panama y obten reportes listos para imprimir.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
            Ingresa colaboradores, ingresos, descuentos y parametros del periodo para calcular la planilla completa con reglas panamenas vigentes.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "Ficha del personal",
              "Busqueda individual",
              "Planilla y CSS",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm text-white/84"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-line bg-panel p-8 shadow-xl md:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Acceso administrador
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              Iniciar sesion
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {supabaseReady
                ? "Supabase Auth esta configurado. Inicia con el usuario administrador creado en el proyecto."
                : "Supabase todavia no esta configurado, asi que la app usa un acceso demo para que puedas recorrer todo el sistema ahora mismo."}
            </p>
          </div>

          <LoginForm />

          {!supabaseReady ? (
            <div className="mt-6 rounded-3xl border border-dashed border-line bg-background p-4 text-sm text-muted">
              <p className="font-semibold text-foreground">Credenciales demo</p>
              <p className="mt-2">Correo: {demoCredentials.email}</p>
              <p>Contrasena: {demoCredentials.password}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
