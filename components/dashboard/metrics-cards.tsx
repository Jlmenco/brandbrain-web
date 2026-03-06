"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MousePointerClick,
  UserPlus,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api-client";
import type { MetricsOverview } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const METRICS = [
  { key: "total_impressions", label: "Impressoes", icon: Eye },
  { key: "total_likes", label: "Curtidas", icon: Heart },
  { key: "total_comments", label: "Comentarios", icon: MessageCircle },
  { key: "total_shares", label: "Compartilhamentos", icon: Share2 },
  { key: "total_clicks", label: "Cliques", icon: MousePointerClick },
  { key: "total_followers_delta", label: "Seguidores", icon: UserPlus },
  { key: "total_posts", label: "Publicacoes", icon: FileText },
] as const;

export function MetricsCards({ ccId }: { ccId: string }) {
  const [data, setData] = useState<MetricsOverview | null>(null);

  useEffect(() => {
    api.getMetricsOverview(ccId).then(setData).catch(() => {});
  }, [ccId]);

  if (!data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {METRICS.map((m) => (
          <Card key={m.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-muted-foreground">--</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {METRICS.map((m) => (
        <Card key={m.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <m.icon className="h-3 w-3" />
              {m.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(
                data[m.key as keyof MetricsOverview] as number
              ).toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
