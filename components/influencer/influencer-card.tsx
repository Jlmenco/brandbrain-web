"use client";

import { useRouter } from "next/navigation";
import type { Influencer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfluencerCard({ influencer }: { influencer: Influencer }) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/influenciadores/${influencer.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{influencer.name}</CardTitle>
          <Badge
            variant="outline"
            className={
              influencer.type === "master"
                ? "bg-amber-100 text-amber-800"
                : "bg-blue-100 text-blue-800"
            }
          >
            {influencer.type === "master" ? "Master" : "Marca"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="text-xs text-muted-foreground">Nicho:</span>{" "}
          <span className="text-sm">{influencer.niche || "--"}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Tom:</span>{" "}
          <span className="text-sm">{influencer.tone || "--"}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Idioma:</span>{" "}
          <span className="text-sm">{influencer.language}</span>
        </div>
        {!influencer.is_active && (
          <Badge variant="outline" className="bg-red-50 text-red-600">
            Inativo
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
