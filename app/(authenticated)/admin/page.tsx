"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Building2, Users, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type OrgRow = {
  id: string;
  name: string;
  account_type: string;
  plan: string;
  trial_ends_at: string | null;
  member_count: number;
  created_at: string;
};

const PLAN_LABELS: Record<string, string> = {
  trial: "Trial",
  solo_monthly: "Solo",
  agency_monthly: "Agência",
  group_monthly: "Grupo",
  active: "Ativo",
};

const PLAN_COLORS: Record<string, string> = {
  trial: "bg-amber-100 text-amber-800 border-amber-200",
  solo_monthly: "bg-blue-100 text-blue-800 border-blue-200",
  agency_monthly: "bg-violet-100 text-violet-800 border-violet-200",
  group_monthly: "bg-emerald-100 text-emerald-800 border-emerald-200",
  active: "bg-gray-100 text-gray-800 border-gray-200",
};

const VALID_PLANS = ["trial", "solo_monthly", "agency_monthly", "group_monthly"];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [users, setUsers] = useState<{ total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user?.is_superadmin) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.is_superadmin) return;
    setLoading(true);
    Promise.all([
      api.adminListOrgs(0, 200),
      api.adminListUsers(0, 1),
    ])
      .then(([orgsData, usersData]) => {
        setOrgs(orgsData.items);
        setUsers({ total: usersData.total });
      })
      .catch(() => toast.error("Erro ao carregar dados admin"))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleActivate(orgId: string, plan: string) {
    setActivating(orgId);
    try {
      await api.adminActivatePlan(orgId, plan);
      setOrgs((prev) =>
        prev.map((o) => (o.id === orgId ? { ...o, plan, trial_ends_at: null } : o))
      );
      toast.success("Plano atualizado com sucesso");
    } catch {
      toast.error("Erro ao ativar plano");
    } finally {
      setActivating(null);
    }
  }

  if (authLoading || !user?.is_superadmin) return null;

  const trialOrgs = orgs.filter((o) => o.plan === "trial");
  const paidOrgs = orgs.filter((o) => o.plan !== "trial");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-violet-600" />
        <div>
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visão geral da plataforma</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Total Orgs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{orgs.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" /> Total Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{users?.total ?? "—"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Em Trial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-600">{trialOrgs.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Planos Pagos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-600">{paidOrgs.length}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tabela de Orgs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Organizações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Plano</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Trial expira</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Membros</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Criado em</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.map((org) => (
                    <tr key={org.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-2 font-medium">{org.name}</td>
                      <td className="px-4 py-2 text-muted-foreground capitalize">{org.account_type}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className={`text-xs ${PLAN_COLORS[org.plan] ?? ""}`}>
                          {PLAN_LABELS[org.plan] ?? org.plan}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground text-xs">
                        {org.trial_ends_at
                          ? new Date(org.trial_ends_at).toLocaleDateString("pt-BR")
                          : "—"}
                      </td>
                      <td className="px-4 py-2 text-center">{org.member_count}</td>
                      <td className="px-4 py-2 text-muted-foreground text-xs">
                        {new Date(org.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-2">
                        <ActivatePlanDropdown
                          orgId={org.id}
                          currentPlan={org.plan}
                          loading={activating === org.id}
                          onActivate={handleActivate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ActivatePlanDropdown({
  orgId,
  currentPlan,
  loading,
  onActivate,
}: {
  orgId: string;
  currentPlan: string;
  loading: boolean;
  onActivate: (orgId: string, plan: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs gap-1"
        disabled={loading}
        onClick={() => setOpen((v) => !v)}
      >
        {loading ? "Salvando..." : "Ativar plano"}
        <ChevronDown className="h-3 w-3" />
      </Button>
      {open && (
        <div className="absolute right-0 z-[9999] mt-1 w-40 rounded-md border bg-popover shadow-md">
          {VALID_PLANS.map((plan) => (
            <button
              key={plan}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors ${
                plan === currentPlan ? "font-semibold text-primary" : ""
              }`}
              onClick={() => {
                setOpen(false);
                onActivate(orgId, plan);
              }}
            >
              {PLAN_LABELS[plan]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
