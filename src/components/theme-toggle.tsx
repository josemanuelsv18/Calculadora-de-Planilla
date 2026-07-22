"use client";

import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => {
        setTheme((currentTheme) =>
          currentTheme === "light" ? "dark" : "light",
        );
      }}
      className="flex w-full items-center justify-between rounded-2xl border border-line bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-soft"
      aria-label="Cambiar tema"
    >
      <span>{isDark ? "Activar modo claro" : "Activar modo oscuro"}</span>
      <span className="rounded-full bg-panel px-2 py-2 text-foreground">
        {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}
