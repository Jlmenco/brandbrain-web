"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "@/lib/api-client";
import type { MetricsDaily } from "@/lib/types";

function formatDate(dateStr: string) {
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

export function MetricsChart({ ccId }: { ccId: string }) {
  const [data, setData] = useState<MetricsDaily[]>([]);

  useEffect(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    api
      .getMetricsDaily(ccId, fmt(from), fmt(to))
      .then(setData)
      .catch(() => {});
  }, [ccId]);

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Sem dados de metricas diarias.
      </p>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
        <Tooltip
          formatter={(value, name) => {
            const labels: Record<string, string> = {
              impressions: "Impressoes",
              likes: "Curtidas",
              clicks: "Cliques",
            };
            return [formatNumber(Number(value)), labels[String(name)] || String(name)];
          }}
        />
        <Area
          type="monotone"
          dataKey="impressions"
          stroke="hsl(var(--primary))"
          fill="url(#colorImpressions)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="likes"
          stroke="#f43f5e"
          fill="url(#colorLikes)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="#8b5cf6"
          fill="url(#colorClicks)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
