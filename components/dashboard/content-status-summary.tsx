"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { ContentStatus } from "@/lib/types";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const STATUSES: ContentStatus[] = [
  "draft",
  "review",
  "approved",
  "scheduled",
  "posted",
];

export function ContentStatusSummary({ ccId }: { ccId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    api
      .listContentItems({ cc_id: ccId, limit: 100 })
      .then((data) => {
        const grouped: Record<string, number> = {};
        for (const item of data.items) {
          grouped[item.status] = (grouped[item.status] || 0) + 1;
        }
        setCounts(grouped);
      })
      .catch(() => {});
  }, [ccId]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum conteudo encontrado.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {STATUSES.map((s) => {
        const count = counts[s] || 0;
        if (count === 0) return null;
        return (
          <Badge
            key={s}
            variant="outline"
            className={`${STATUS_COLORS[s]} text-sm px-3 py-1`}
          >
            {STATUS_LABELS[s]} {count}
          </Badge>
        );
      })}
    </div>
  );
}
