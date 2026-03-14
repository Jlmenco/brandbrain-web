"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Clock, CheckCircle } from "lucide-react";

interface OrgItem {
  id: string;
  name: string;
  account_type: string;
  plan: string;
  trial_ends_at: string | null;
  member_count: number;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  trial: "bg-amber-100 text-amber-800",
  solo_monthly: "bg-blue-100 text-blue-800",
  agency_monthly: "bg-violet-100 text-violet-800",
  group_monthly: "bg-purple-100 text-purple-800",
  active: "bg-emerald-100 text-emerald-800",
};

export default function AdminDashboardPage() {
  const [orgs, setOrgs] = useState<OrgItem[]>([]);
  const [totalOrgs, setTotalOrgs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  async function load() {
    try {
      const [orgsData, usersData] = await Promise.all([
        api.adminListOrgs(),
        api.adminListUsers(),
      ]);
      setOrgs(orgsData.items);
      setTotalOrgs(orgsData.total);
      setTotalUsers(usersData.total);
    } catch {
      // sem permissao
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleActivate(orgId: string, plan: string) {
    setActivating(orgId);
    try {
      await api.adminActivatePlan(orgId, plan);
      await load();
    } finally {
      setActivating(null);
    }
  }

  const trialOrgs = orgs.filter((o) => o.plan === "trial");
  const paidOrgs = orgs.filter((o) => o.plan !== "trial");

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Gestao de clientes Brand Brain</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total de Orgs</p>
              <p className="text-2xl font-bold">{totalOrgs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total de Usuarios</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <Clock className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Em Trial</p>
              <p className="text-2xl font-bold">{trialOrgs.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de orgs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organizações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {orgs.map((org) => {
              const daysLeft = org.trial_ends_at
                ? Math.max(0, Math.ceil((new Date(org.trial_ends_at).getTime() - Date.now()) / 86400000))
                : null;
              return (
                <div key={org.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.account_type} · {org.member_count} membro(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {daysLeft !== null && (
                      <span className={`text-xs ${daysLeft <= 3 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                        {daysLeft}d
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PLAN_COLORS[org.plan] ?? "bg-muted text-muted-foreground"}`}>
                      {org.plan}
                    </span>
                    {org.plan === "trial" && (
                      <button
                        onClick={() => handleActivate(org.id, `${org.account_type}_monthly`)}
                        disabled={activating === org.id}
                        className="text-xs text-primary hover:underline disabled:opacity-50"
                      >
                        {activating === org.id ? "..." : "Ativar"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {orgs.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma organizacao encontrada.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
