"use client";

import type { ReactNode } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import type { Permission } from "@/lib/permissions";

interface GateProps {
  permission: Permission | Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function Gate({ permission, fallback = null, children }: GateProps) {
  const { can } = useWorkspace();

  const allowed = Array.isArray(permission)
    ? permission.some(can)
    : can(permission);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
