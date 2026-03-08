"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import type { ContentItem, Influencer } from "@/lib/types";
import { ContentFilters } from "@/components/content/content-filters";
import { ContentTable } from "@/components/content/content-table";
import { CreateContentDialog } from "@/components/content/create-content-dialog";
import { Button } from "@/components/ui/button";
import { Gate } from "@/components/ui/gate";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToCSV } from "@/lib/export";
import { Download } from "lucide-react";

const PAGE_SIZE = 20;

export default function ConteudosPage() {
  const { selectedOrg, selectedCostCenter, loading: wsLoading } = useWorkspace();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("all");
  const [influencer, setInfluencer] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!selectedOrg) return;
    api.listInfluencers(selectedOrg.id).then(setInfluencers).catch(() => {});
  }, [selectedOrg]);

  useEffect(() => {
    if (!selectedCostCenter) return;
    setLoading(true);
    api
      .listContentItems({
        cc_id: selectedCostCenter.id,
        status: status === "all" ? undefined : status,
        provider: provider === "all" ? undefined : provider,
        influencer_id: influencer === "all" ? undefined : influencer,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        search: search || undefined,
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      })
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCostCenter, status, provider, influencer, dateFrom, dateTo, search, page, refreshKey]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [status, provider, influencer, dateFrom, dateTo, search]);

  if (wsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedCostCenter) {
    return (
      <p className="text-muted-foreground">
        Selecione uma marca no menu superior.
      </p>
    );
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showFrom = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const showTo = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conteudos</h1>
          <p className="text-sm text-muted-foreground">
            {selectedCostCenter.name} — {total} itens
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(
                items as unknown as Record<string, unknown>[],
                "conteudos",
                [
                  { key: "provider_target", label: "Canal" },
                  { key: "text", label: "Texto" },
                  { key: "status", label: "Status" },
                  { key: "scheduled_at", label: "Agendado" },
                ]
              )
            }
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar CSV
          </Button>
          <Gate permission="content:create">
            <Button onClick={() => setShowCreate(true)}>Novo Conteudo</Button>
          </Gate>
        </div>
      </div>

      <Gate permission="content:create">
        <CreateContentDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
          costCenterId={selectedCostCenter.id}
          influencers={influencers}
        />
      </Gate>

      <ContentFilters
        status={status}
        provider={provider}
        search={search}
        onStatusChange={setStatus}
        onProviderChange={setProvider}
        onSearchChange={setSearch}
        influencers={influencers.map((inf) => ({ id: inf.id, name: inf.name }))}
        influencer={influencer}
        onInfluencerChange={setInfluencer}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <ContentTable items={items} influencers={influencers} />
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {showFrom}-{showTo} de {total} itens
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Proximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
