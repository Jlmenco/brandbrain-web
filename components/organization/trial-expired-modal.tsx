"use client";

import { useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import type { PlanType } from "@/lib/types";
import { Lock, Zap, Users, Building2, Check } from "lucide-react";

const PLAN_INFO: Record<string, { label: string; icon: React.ReactNode; features: string[] }> = {
  solo: {
    label: "Solo Mensal",
    icon: <Zap className="h-6 w-6 text-amber-500" />,
    features: [
      "1 marca gerenciada",
      "Criação de conteúdo com IA",
      "Publicação automática",
      "Dashboard simplificado",
      "Suporte por email",
    ],
  },
  agency: {
    label: "Agency Mensal",
    icon: <Users className="h-6 w-6 text-blue-500" />,
    features: [
      "Multiplos clientes e marcas",
      "RBAC completo (owner/admin/editor/viewer)",
      "Workflow de aprovacao",
      "Webhooks e integrações",
      "Audit log e export CSV/PDF",
    ],
  },
  group: {
    label: "Group Mensal",
    icon: <Building2 className="h-6 w-6 text-purple-500" />,
    features: [
      "Franquias e grupos de empresas",
      "Dashboard consolidado cross-orgs",
      "Billing centralizado na org mae",
      "Cada filial opera como Agency",
      "Suporte prioritario",
    ],
  },
};

export function TrialExpiredModal() {
  const { isTrialExpired, accountType, selectedOrg, refreshOrgs } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isTrialExpired) return null;

  const planKey = accountType; // solo | agency | group
  const targetPlan = `${planKey}_monthly` as PlanType;
  const info = PLAN_INFO[planKey] ?? PLAN_INFO.agency;

  async function handleActivate() {
    if (!selectedOrg) return;
    setLoading(true);
    setError("");
    try {
      await api.activatePlan(selectedOrg.id, targetPlan);
      await refreshOrgs();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao ativar plano");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-card border rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Seu trial expirou</h2>
          <p className="text-muted-foreground text-sm">
            Seus 30 dias gratuitos chegaram ao fim. Assine para continuar usando o Brand Brain.
          </p>
        </div>

        {/* Plan card */}
        <div className="border rounded-xl p-5 space-y-4 bg-muted/30">
          <div className="flex items-center gap-3">
            {info.icon}
            <div>
              <p className="font-semibold">{info.label}</p>
              <p className="text-xs text-muted-foreground">Compativel com seu perfil atual</p>
            </div>
          </div>
          <ul className="space-y-2">
            {info.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        {/* CTA */}
        <button
          onClick={handleActivate}
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Ativando..." : "Assinar agora — continuar usando"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Entre em contato via <span className="font-medium">contato@brandbrain.com.br</span> para duvidas sobre planos e pagamento.
        </p>
      </div>
    </div>
  );
}
