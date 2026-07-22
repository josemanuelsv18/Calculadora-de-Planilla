"use client";

import { Moon, SunMedium } from "lucide-react";
import { useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <button
      type="button"
      onClick={() => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }}
      className="flex w-full items-center justify-between rounded-2xl border border-line bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-soft"
      aria-label="Cambiar tema"
    >
      <span>{theme === "light" ? "Modo claro" : "Modo oscuro"}</span>
      <span className="rounded-full bg-panel px-2 py-2 text-foreground">
        {theme === "light" ? <SunMedium size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}
