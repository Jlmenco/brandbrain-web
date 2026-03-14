"use client";

import { useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { MetricsChart } from "@/components/dashboard/metrics-chart";
import { ContentStatusSummary } from "@/components/dashboard/content-status-summary";
import { RecentContent } from "@/components/dashboard/recent-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/organization/upgrade-modal";
import Link from "next/link";
import { FileText, Sparkles, Settings, Rocket } from "lucide-react";

export function SoloDashboard() {
  const { selectedOrg, selectedCostCenter } = useWorkspace();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!selectedCostCenter || !selectedOrg) {
    return (
      <p className="text-muted-foreground">Configurando sua marca...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ola, {selectedOrg.name}</h1>
        <p className="text-sm text-muted-foreground">
          Visao geral da sua marca — ultimos 30 dias
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
          <Link href="/conteudos">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Criar Conteudo</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
          <Link href="/minha-marca">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Minha Marca</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
          <Link href="/configuracoes">
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Configuracoes</span>
          </Link>
        </Button>
      </div>

      {/* Metrics */}
      <MetricsCards ccId={selectedCostCenter.id} />

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metricas Diarias</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricsChart ccId={selectedCostCenter.id} />
        </CardContent>
      </Card>

      {/* Status + Recent content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos Conteudos</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentStatusSummary ccId={selectedCostCenter.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conteudos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentContent ccId={selectedCostCenter.id} />
          </CardContent>
        </Card>
      </div>

      {/* Upsell CTA */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-sm">Cresceu? Faça upgrade para Agência</p>
              <p className="text-xs text-muted-foreground">
                Convide membros, gerencie múltiplas marcas e acesse o fluxo completo de aprovação.
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setShowUpgrade(true)}>
            Upgrade
          </Button>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        targetType="agency"
      />
    </div>
  );
}
