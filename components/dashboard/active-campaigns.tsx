"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { Campaign } from "@/lib/types";
import { OBJECTIVE_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
}

export function ActiveCampaigns({ ccId }: { ccId: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    api
      .listCampaigns(ccId)
      .then((data) => {
        const today = new Date().toISOString().slice(0, 10);
        const active = data.filter((c) => {
          const started = !c.start_date || c.start_date <= today;
          const notEnded = !c.end_date || c.end_date >= today;
          return started && notEnded;
        });
        setCampaigns(active);
      })
      .catch(() => {});
  }, [ccId]);

  if (campaigns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhuma campanha ativa.</p>
    );
  }

  return (
    <div className="space-y-3">
      {campaigns.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <p className="text-sm font-medium">{c.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(c.start_date)} — {formatDate(c.end_date)}
            </p>
          </div>
          <Badge variant="outline">
            {OBJECTIVE_LABELS[c.objective] || c.objective}
          </Badge>
        </div>
      ))}
    </div>
  );
}
