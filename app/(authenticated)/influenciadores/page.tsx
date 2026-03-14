"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import type { Influencer } from "@/lib/types";
import { InfluencerCard } from "@/components/influencer/influencer-card";
import { CreateInfluencerDialog } from "@/components/influencer/create-influencer-dialog";
import { Button } from "@/components/ui/button";
import { Gate } from "@/components/ui/gate";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function InfluenciadoresPage() {
  const { selectedOrg, loading: wsLoading } = useWorkspace();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!selectedOrg) return;
    api
      .listInfluencers(selectedOrg.id)
      .then(setInfluencers)
      .catch(() => {});
  }, [selectedOrg, refreshKey]);

  if (wsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedOrg) {
    return (
      <p className="text-muted-foreground">
        Selecione uma organização.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Influenciadores</h1>
          <p className="text-sm text-muted-foreground">
            {influencers.length} influenciadores
          </p>
        </div>
        <Gate permission="influencer:create">
          <Button onClick={() => setShowCreate(true)}>Novo Influenciador</Button>
        </Gate>
      </div>

      <Gate permission="influencer:create">
        <CreateInfluencerDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
          orgId={selectedOrg.id}
        />
      </Gate>

      {influencers.length === 0 ? (
        <EmptyState
          icon="👤"
          title="Nenhum influenciador"
          description="Crie seu primeiro influenciador para começar a gerar conteúdo."
          action={
            <Gate permission="influencer:create">
              <Button onClick={() => setShowCreate(true)}>Novo Influenciador</Button>
            </Gate>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {influencers.map((inf) => (
            <InfluencerCard key={inf.id} influencer={inf} />
          ))}
        </div>
      )}
    </div>
  );
}
