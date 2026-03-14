"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { MetricsChart } from "@/components/dashboard/metrics-chart";
import { ContentStatusSummary } from "@/components/dashboard/content-status-summary";
import { ActiveCampaigns } from "@/components/dashboard/active-campaigns";
import { LeadPipeline } from "@/components/dashboard/lead-pipeline";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentContent } from "@/components/dashboard/recent-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { SoloDashboard } from "@/components/dashboard/solo-dashboard";

export default function DashboardPage() {
  const { selectedOrg, selectedCostCenter, loading, isSolo } = useWorkspace();

  // Onboarding: show wizard if user hasn't completed it
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem("bb_onboarding_done");
      setShowOnboarding(!done);
      setOnboardingChecked(true);
    }
  }, []);

  if (!onboardingChecked) {
    return null;
  }

  if (showOnboarding) {
    return (
      <OnboardingWizard
        onComplete={() => setShowOnboarding(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!selectedCostCenter || !selectedOrg) {
    return (
      <p className="text-muted-foreground">
        Selecione uma marca no menu superior.
      </p>
    );
  }

  if (isSolo) {
    return <SoloDashboard />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral — {selectedCostCenter.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Últimos 30 dias (dados simulados)
        </p>
      </div>

      {/* Metricas Cards */}
      <MetricsCards ccId={selectedCostCenter.id} />

      {/* Grafico diario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métricas Diárias</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricsChart ccId={selectedCostCenter.id} />
        </CardContent>
      </Card>

      {/* Status conteudos + Pipeline leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos Conteúdos</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentStatusSummary ccId={selectedCostCenter.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadPipeline ccId={selectedCostCenter.id} />
          </CardContent>
        </Card>
      </div>

      {/* Campanhas ativas + Atividade recente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveCampaigns ccId={selectedCostCenter.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity
              orgId={selectedOrg.id}
              ccId={selectedCostCenter.id}
            />
          </CardContent>
        </Card>
      </div>

      {/* Conteudos recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conteúdos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentContent ccId={selectedCostCenter.id} />
        </CardContent>
      </Card>
    </div>
  );
}
