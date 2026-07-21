import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
  isSupabaseAuthEnabled,
} from "@/lib/supabase/server";

const DEMO_SESSION_COOKIE = "planilla_demo_session";
const DEMO_ADMIN_EMAIL =
  process.env.DEMO_ADMIN_EMAIL ?? "admin@planillapro.demo";
const DEMO_ADMIN_PASSWORD =
  process.env.DEMO_ADMIN_PASSWORD ?? "Planilla2026*";

export type AuthenticatedAdmin = {
  email: string;
  mode: "supabase" | "demo";
};

export function getDemoCredentials() {
  return {
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
  };
}

export async function signInAdmin(email: string, password: string) {
  if (isSupabaseAuthEnabled()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Acceso concedido." };
  }

  if (email !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
    return { ok: false, message: "Credenciales invalidas para el modo demo." };
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { ok: true, message: "Acceso concedido." };
}

export async function signOutAdmin() {
  if (isSupabaseAuthEnabled()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return;
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}

export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  if (isSupabaseAuthEnabled()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    return {
      email: user.email,
      mode: "supabase",
    };
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (!session) {
    return null;
  }

  return {
    email: session,
    mode: "demo",
  };
}

export async function requireAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/login");
  }

  return admin;
}
