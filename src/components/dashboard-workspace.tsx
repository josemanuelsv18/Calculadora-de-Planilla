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

      <div className="min-w-0">{calculator}</div>

      <div className="min-w-0 space-y-6">
        {actions}
        {children}
      </div>
    </div>
  );
}
