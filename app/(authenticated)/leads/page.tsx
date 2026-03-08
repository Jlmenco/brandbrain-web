"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS,
} from "@/lib/constants";
import { Gate } from "@/components/ui/gate";
import { Button } from "@/components/ui/button";
import { CreateLeadDialog } from "@/components/lead/create-lead-dialog";
import { EditLeadDialog } from "@/components/lead/edit-lead-dialog";
import { Plus, Pencil } from "lucide-react";
import type { Lead } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function LeadsPage() {
  const { selectedCostCenter, loading: wsLoading } = useWorkspace();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (!selectedCostCenter) {
      setLeads([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .listLeads(selectedCostCenter.id, filterStatus || undefined)
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, [selectedCostCenter, filterStatus, refreshKey]);

  if (wsLoading) return null;

  const inputClass =
    "rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Gate permission="lead:create">
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </Gate>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={inputClass}
        >
          <option value="">Todos os status</option>
          <option value="new">Novo</option>
          <option value="qualified">Qualificado</option>
          <option value="won">Ganho</option>
          <option value="lost">Perdido</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Nenhum lead encontrado"
          description="Seus leads aparecerao aqui conforme forem capturados."
        />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">Fonte</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {l.email || "--"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {l.phone || "--"}
                  </td>
                  <td className="px-4 py-3">
                    {LEAD_SOURCE_LABELS[l.source] || l.source}
                  </td>
                  <td className="px-4 py-3 font-mono">{l.score}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        LEAD_STATUS_COLORS[l.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {LEAD_STATUS_LABELS[l.status] || l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Gate permission="lead:edit">
                      <button
                        onClick={() => setEditLead(l)}
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
        <CreateLeadDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
          costCenterId={selectedCostCenter.id}
        />
      )}

      <EditLeadDialog
        open={!!editLead}
        onClose={() => setEditLead(null)}
        onUpdated={() => setRefreshKey((k) => k + 1)}
        lead={editLead}
      />
    </div>
  );
}
