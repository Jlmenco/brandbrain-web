"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import { OBJECTIVE_LABELS } from "@/lib/constants";
import { Gate } from "@/components/ui/gate";
import { Button } from "@/components/ui/button";
import { CreateCampaignDialog } from "@/components/campaign/create-campaign-dialog";
import { EditCampaignDialog } from "@/components/campaign/edit-campaign-dialog";
import { Plus, Pencil } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampanhasPage() {
  const { selectedCostCenter, loading: wsLoading } = useWorkspace();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [filterObjective, setFilterObjective] = useState("");

  useEffect(() => {
    if (!selectedCostCenter) {
      setCampaigns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .listCampaigns(selectedCostCenter.id)
      .then(setCampaigns)
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, [selectedCostCenter, refreshKey]);

  const filtered = filterObjective
    ? campaigns.filter((c) => c.objective === filterObjective)
    : campaigns;

  if (wsLoading) return null;

  const inputClass =
    "rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campanhas</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} campanha{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Gate permission="campaign:create">
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </Gate>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={filterObjective}
          onChange={(e) => setFilterObjective(e.target.value)}
          className={inputClass}
        >
          <option value="">Todos os objetivos</option>
          <option value="leads">Leads</option>
          <option value="awareness">Reconhecimento</option>
          <option value="traffic">Trafego</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma campanha encontrada.
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Objetivo</th>
                <th className="px-4 py-3 font-medium">Inicio</th>
                <th className="px-4 py-3 font-medium">Fim</th>
                <th className="px-4 py-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {OBJECTIVE_LABELS[c.objective] || c.objective}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.start_date || "--"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.end_date || "--"}
                  </td>
                  <td className="px-4 py-3">
                    <Gate permission="campaign:edit">
                      <button
                        onClick={() => setEditCampaign(c)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Gate>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCostCenter && (
        <CreateCampaignDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
          costCenterId={selectedCostCenter.id}
        />
      )}

      <EditCampaignDialog
        open={!!editCampaign}
        onClose={() => setEditCampaign(null)}
        onUpdated={() => setRefreshKey((k) => k + 1)}
        campaign={editCampaign}
      />
    </div>
  );
}
