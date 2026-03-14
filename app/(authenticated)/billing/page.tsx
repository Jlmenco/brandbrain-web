"use client";

import { useEffect, useState } from "react";
import { DollarSign, RefreshCw, CheckCircle2, Zap, Building2, Network } from "lucide-react";
import { api } from "@/lib/api-client";
import { useWorkspace } from "@/contexts/workspace-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Gate } from "@/components/ui/gate";
import { toast } from "sonner";

const PLANS = [
  {
    id: "solo_monthly",
    label: "Solo",
    price: 297,
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    features: ["1 influenciador", "Geração de conteúdo IA", "Publicação agendada", "Métricas básicas"],
  },
  {
    id: "agency_monthly",
    label: "Agência",
    price: 697,
    icon: Building2,
    color: "text-purple-600",
    bg: "bg-purple-50",
    features: ["Até 10 influenciadores", "Multi cost center", "Aprovação em equipe", "Métricas avançadas", "Webhooks"],
    popular: true,
  },
  {
    id: "group_monthly",
    label: "Grupo",
    price: 1497,
    icon: Network,
    color: "text-orange-600",
    bg: "bg-orange-50",
    features: ["Influenciadores ilimitados", "Multi filiais", "RAG + Brand Kit", "Relatórios consolidados", "Suporte prioritário"],
  },
];

const PLAN_DISPLAY: Record<string, string> = {
  trial: "Teste Gratuito",
  solo_monthly: "Solo",
  agency_monthly: "Agência",
  group_monthly: "Grupo",
  active: "Ativo",
};

interface UsageSummary {
  resource_type: string;
  provider: string;
  total_units: number;
  unit_type: string;
  total_cost_usd: number;
  request_count: number;
}

interface UsageOverview {
  total_cost_usd: number;
  by_resource: UsageSummary[];
  period_start: string;
  period_end: string;
}

const RESOURCE_LABELS: Record<string, string> = {
  avatar: "Avatar (DALL-E 3)",
  tts: "Voz (ElevenLabs)",
  video: "Video (Hedra)",
  ai_generation: "Geração de Conteúdo",
  publish: "Publicação",
};

const PROVIDER_COLORS: Record<string, string> = {
  dalle: "bg-emerald-100 text-emerald-800",
  elevenlabs: "bg-purple-100 text-purple-800",
  hedra: "bg-blue-100 text-blue-800",
  openai: "bg-green-100 text-green-800",
  anthropic: "bg-orange-100 text-orange-800",
};

export default function BillingPage() {
  const { selectedOrg, refreshOrgs } = useWorkspace();
  const [overview, setOverview] = useState<UsageOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState("30");
  const [threshold, setThreshold] = useState("");
  const [savingThreshold, setSavingThreshold] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [quota, setQuota] = useState<Record<string, { used: number; limit: number | null }> | null>(null);

  async function handleCheckout(planId: string) {
    setCheckingOut(planId);
    try {
      const res = await api.billingCheckout(planId);
      window.open(res.url, "_blank");
    } catch {
      toast.error("Erro ao gerar link de pagamento. Tente novamente.");
    } finally {
      setCheckingOut(null);
    }
  }

  function trialDaysLeft(): number | null {
    if (!selectedOrg?.trial_ends_at) return null;
    const diff = new Date(selectedOrg.trial_ends_at).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  useEffect(() => {
    if (selectedOrg?.billing_alert_threshold != null) {
      setThreshold(String(selectedOrg.billing_alert_threshold));
    } else {
      setThreshold("");
    }
  }, [selectedOrg?.id, selectedOrg?.billing_alert_threshold]);

  function fetchData() {
    if (!selectedOrg) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}/usage/overview?org_id=${selectedOrg.id}&days=${days}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("bb_token")}` },
    })
      .then((r) => r.json())
      .then(setOverview)
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  }

  async function saveThreshold() {
    if (!selectedOrg) return;
    setSavingThreshold(true);
    try {
      const value = threshold === "" ? null : parseFloat(threshold);
      if (threshold !== "" && (isNaN(value!) || value! < 0)) {
        toast.error("Valor inválido. Use um número positivo.");
        return;
      }
      await api.updateOrg(selectedOrg.id, { billing_alert_threshold: value });
      await refreshOrgs?.();
      toast.success("Limite de alerta salvo.");
    } catch {
      toast.error("Erro ao salvar limite.");
    } finally {
      setSavingThreshold(false);
    }
  }

  useEffect(() => {
    if (!selectedOrg) return;
    api.getQuota(selectedOrg.id).then(setQuota).catch(() => setQuota(null));
  }, [selectedOrg?.id]);

  useEffect(() => { fetchData(); }, [selectedOrg, days]);

  const daysLeft = trialDaysLeft();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Faturamento</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Plano, assinatura e consumo de recursos de IA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Plano atual */}
      {selectedOrg && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Plano Atual</CardTitle>
              <Badge variant={selectedOrg.plan === "trial" ? "secondary" : "default"}>
                {PLAN_DISPLAY[selectedOrg.plan] ?? selectedOrg.plan}
              </Badge>
            </div>
            {selectedOrg.plan === "trial" && daysLeft !== null && (
              <CardDescription className="text-xs">
                {daysLeft > 0
                  ? `Período de teste: ${daysLeft} dia${daysLeft !== 1 ? "s" : ""} restante${daysLeft !== 1 ? "s" : ""}`
                  : "Período de teste encerrado. Faça upgrade para continuar."}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      )}

      {/* Quota do mês */}
      {quota && Object.keys(quota).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Uso este mês</CardTitle>
            <CardDescription className="text-xs">Recursos com limite mensal por plano.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(quota).map(([resource, { used, limit }]) => {
              const label = resource === "video" ? "Vídeos gerados" : "Avatares gerados";
              const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
              const over = limit !== null && used >= limit;
              return (
                <div key={resource} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{label}</span>
                    <span className={over ? "text-red-600 font-semibold" : "text-muted-foreground"}>
                      {used} / {limit ?? "∞"}
                    </span>
                  </div>
                  {limit !== null && (
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${over ? "bg-red-500" : pct > 80 ? "bg-orange-400" : "bg-primary"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Upgrade */}
      <Gate permission="org:manage">
        <div>
          <h2 className="text-base font-semibold mb-3">Fazer Upgrade</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = selectedOrg?.plan === plan.id;
              return (
                <Card key={plan.id} className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="text-xs">Mais popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className={`h-9 w-9 rounded-lg ${plan.bg} flex items-center justify-center mb-2`}>
                      <Icon className={`h-5 w-5 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-base">{plan.label}</CardTitle>
                    <p className="text-2xl font-bold">
                      R$ {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent || checkingOut !== null}
                      onClick={() => handleCheckout(plan.id)}
                    >
                      {checkingOut === plan.id ? "Aguarde..." : isCurrent ? "Plano atual" : "Assinar"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Gate>

      <Gate permission="org:manage">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : overview ? (
          <>
            {/* Total cost card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${overview.total_cost_usd.toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground">
                      {overview.period_start} → {overview.period_end}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* By resource */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Por Recurso</CardTitle>
              </CardHeader>
              <CardContent>
                {overview.by_resource.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum uso registrado neste período.</p>
                ) : (
                  <div className="space-y-3">
                    {overview.by_resource.map((r, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge
                            variant="outline"
                            className={`text-xs shrink-0 ${PROVIDER_COLORS[r.provider] || "bg-gray-100 text-gray-700"}`}
                          >
                            {r.provider}
                          </Badge>
                          <span className="text-sm truncate">
                            {RESOURCE_LABELS[r.resource_type] || r.resource_type}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium">${r.total_cost_usd.toFixed(4)}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.total_units.toLocaleString()} {r.unit_type} · {r.request_count} req
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing alert threshold */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Alerta de Custo</CardTitle>
                <CardDescription className="text-xs">
                  Receba notificações (email + push) quando o custo mensal cruzar este valor.
                  Deixe em branco para desativar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="threshold">Limite mensal (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="threshold"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ex: 10.00"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <Button onClick={saveThreshold} disabled={savingThreshold} size="sm">
                    {savingThreshold ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
                {selectedOrg?.billing_alert_threshold != null && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Limite atual: <span className="font-medium">${selectedOrg.billing_alert_threshold.toFixed(2)}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="text-muted-foreground">Selecione uma organização no menu superior.</p>
        )}
      </Gate>
    </div>
  );
}
