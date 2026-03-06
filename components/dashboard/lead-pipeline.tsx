"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/lib/constants";

const PIPELINE = ["new", "qualified", "won", "lost"] as const;

export function LeadPipeline({ ccId }: { ccId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    api
      .listLeads(ccId)
      .then((data) => {
        const grouped: Record<string, number> = {};
        for (const lead of data) {
          grouped[lead.status] = (grouped[lead.status] || 0) + 1;
        }
        setCounts(grouped);
      })
      .catch(() => {});
  }, [ccId]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum lead encontrado.</p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {PIPELINE.map((s) => (
        <div
          key={s}
          className={`rounded-md p-3 text-center ${LEAD_STATUS_COLORS[s] || ""}`}
        >
          <p className="text-2xl font-bold">{counts[s] || 0}</p>
          <p className="text-xs font-medium">{LEAD_STATUS_LABELS[s]}</p>
        </div>
      ))}
    </div>
  );
}
