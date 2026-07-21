"use server";

import { redirect } from "next/navigation";

import { signInAdmin } from "@/lib/auth";

type LoginActionState = {
  message: string;
};

export async function submitLoginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const result = await signInAdmin(email, password);

  if (!result.ok) {
    return { message: result.message };
  }

  redirect("/dashboard");
}
