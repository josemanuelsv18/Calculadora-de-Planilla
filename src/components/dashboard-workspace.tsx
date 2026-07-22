import type { ReactNode } from "react";

type DashboardWorkspaceProps = {
  header: ReactNode;
  calculator: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
};

export function DashboardWorkspace({
  header,
  calculator,
  children,
  actions,
}: DashboardWorkspaceProps) {
  return (
    <div className="space-y-6">
      {header}

      <div className="grid gap-6 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)] xl:items-start">
        <div className="min-w-0 space-y-6 xl:sticky xl:top-6">{calculator}</div>
        <div className="min-w-0 space-y-6">
          {actions}
          {children}
        </div>
      </div>
    </div>
  );
}
