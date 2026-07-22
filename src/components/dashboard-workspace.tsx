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

      <div className="grid gap-6 2xl:grid-cols-[minmax(390px,500px)_minmax(0,1fr)] 2xl:items-start">
        <div className="space-y-6 2xl:sticky 2xl:top-6">{calculator}</div>
        <div className="space-y-6">
          {actions}
          {children}
        </div>
      </div>
    </div>
  );
}
