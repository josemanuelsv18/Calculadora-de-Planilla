import Link from "next/link";
import { BarChart3, BriefcaseBusiness, Files, Search } from "lucide-react";

import { PayrollProvider } from "@/components/payroll-provider";
import { SidebarLink } from "@/components/sidebar-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOutAction } from "@/app/dashboard/actions";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-background px-4 py-4 md:px-6 md:py-6 xl:px-8">
      <div className="app-shell mx-auto grid min-h-[calc(100vh-2rem)] gap-5 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="no-print content-card rounded-[2rem] border border-line p-6 shadow-sm xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-auto">
          <Link href="/dashboard" className="block rounded-3xl bg-panel-strong p-5 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-white/65">
              Calculadora de planilla
            </p>
            <p className="mt-3 text-2xl font-semibold">Panama</p>
            <p className="mt-2 text-sm text-white/72">Construye y calcula planillas quincenales de forma libre.</p>
          </Link>

          <nav className="mt-6 flex flex-col gap-2">
            <SidebarLink href="/dashboard" icon={<BarChart3 size={18} />} label="Resumen" />
            <SidebarLink
              href="/dashboard/personal"
              icon={<BriefcaseBusiness size={18} />}
              label="Datos del personal"
            />
            <SidebarLink
              href="/dashboard/colaboradores"
              icon={<Search size={18} />}
              label="Busqueda de colaboradores"
            />
            <SidebarLink href="/dashboard/planilla" icon={<Files size={18} />} label="Reporte de planilla" />
          </nav>

          <div className="mt-8 rounded-3xl border border-line bg-background p-4 text-sm text-muted">
            <p className="font-semibold text-foreground">Sesion activa</p>
            <p className="mt-2 break-all">{admin.email}</p>
            <p className="mt-1 uppercase tracking-[0.18em]">Modo {admin.mode}</p>
          </div>

          <div className="mt-4">
            <ThemeToggle />
          </div>

          <form action={signOutAction} className="mt-4">
            <button
              type="submit"
              className="w-full rounded-2xl border border-line px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-soft"
            >
              Cerrar sesion
            </button>
          </form>
        </aside>

        <main className="content-card rounded-[2rem] border border-line p-5 shadow-sm md:p-8 xl:p-9">
          <PayrollProvider>{children}</PayrollProvider>
        </main>
      </div>
    </div>
  );
}
