"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { clsx } from "clsx";

type SidebarLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

export function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
        isActive
          ? "bg-accent text-white shadow-sm"
          : "text-muted hover:bg-white/70 hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
