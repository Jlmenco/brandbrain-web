"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "@/lib/api-client";
import type { Organization, CostCenter, OrgRole, AccountType, PlanType } from "@/lib/types";
import { hasPermission, type Permission } from "@/lib/permissions";

interface WorkspaceContextValue {
  orgs: Organization[];
  costCenters: CostCenter[];
  selectedOrg: Organization | null;
  selectedCostCenter: CostCenter | null;
  selectOrg: (org: Organization) => void;
  selectCostCenter: (cc: CostCenter) => void;
  refreshOrgs: () => Promise<void>;
  loading: boolean;
  currentRole: OrgRole | null;
  can: (permission: Permission) => boolean;
  accountType: AccountType;
  isSolo: boolean;
  isAgency: boolean;
  isGroup: boolean;
  plan: PlanType;
  isTrialExpired: boolean;
  trialDaysRemaining: number | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedCostCenter, setSelectedCostCenter] =
    useState<CostCenter | null>(null);
  const [loading, setLoading] = useState(true);

  // Load orgs on mount
  useEffect(() => {
    api
      .listOrgs()
      .then((data) => {
        setOrgs(data);
        if (data.length > 0) {
          setSelectedOrg(data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load cost centers when org changes
  useEffect(() => {
    if (!selectedOrg) return;
    api
      .listCostCenters(selectedOrg.id)
      .then((data) => {
        setCostCenters(data);
        if (data.length > 0) {
          setSelectedCostCenter(data[0]);
        }
      })
      .catch(() => {});
  }, [selectedOrg]);

  const refreshOrgs = useCallback(async () => {
    const data = await api.listOrgs();
    setOrgs(data);
    setSelectedOrg((prev) => data.find((o) => o.id === prev?.id) ?? prev);
  }, []);

  const selectOrg = useCallback((org: Organization) => {
    setSelectedOrg(org);
    setSelectedCostCenter(null);
    setCostCenters([]);
  }, []);

  const selectCostCenter = useCallback((cc: CostCenter) => {
    setSelectedCostCenter(cc);
  }, []);

  const currentRole: OrgRole | null = selectedOrg?.role ?? null;
  const accountType: AccountType = selectedOrg?.account_type ?? "agency";
  const isSolo = accountType === "solo";
  const isAgency = accountType === "agency";
  const isGroup = accountType === "group";
  const plan: PlanType = selectedOrg?.plan ?? "active";
  const trialDaysRemaining: number | null = (() => {
    if (!selectedOrg?.trial_ends_at) return null;
    const diff = new Date(selectedOrg.trial_ends_at).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();
  const isTrialExpired = plan === "trial" && trialDaysRemaining !== null && trialDaysRemaining <= 0;

  const can = useCallback(
    (permission: Permission) => hasPermission(currentRole, permission),
    [currentRole]
  );

  return (
    <WorkspaceContext.Provider
      value={{
        orgs,
        costCenters,
        selectedOrg,
        selectedCostCenter,
        selectOrg,
        selectCostCenter,
        refreshOrgs,
        loading,
        currentRole,
        can,
        accountType,
        isSolo,
        isAgency,
        isGroup,
        plan,
        isTrialExpired,
        trialDaysRemaining,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
