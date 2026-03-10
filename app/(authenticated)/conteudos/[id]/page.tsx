"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { api } from "@/lib/api-client";
import type { ContentItem } from "@/lib/types";
import { STATUS_LABELS, STATUS_COLORS, PROVIDER_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContentEditor } from "@/components/content/content-editor";
import { ContentWorkflowActions } from "@/components/content/content-workflow-actions";
import { PostPreview } from "@/components/content/post-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { EditContentDialog } from "@/components/content/edit-content-dialog";
import { Button } from "@/components/ui/button";
import { Gate } from "@/components/ui/gate";
import type { Influencer } from "@/lib/types";

export default function ConteudoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<ContentItem | null>(null);
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const fetchItem = useCallback(() => {
    api
      .getContentItem(id)
      .then((data) => {
        setItem(data);
        if (data.influencer_id) {
          api.getInfluencer(data.influencer_id).then(setInfluencer).catch(() => {});
        }
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!item) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/conteudos"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Detalhe do Conteudo</h1>
          <p className="text-sm text-muted-foreground">
            {PROVIDER_LABELS[item.provider_target] || item.provider_target}
          </p>
        </div>
        {(item.status === "draft" || item.status === "review") && (
          <Gate permission="content:edit_draft">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEdit(true)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </Gate>
        )}
        <Badge
          variant="outline"
          className={`text-sm ${STATUS_COLORS[item.status] || ""}`}
        >
          {STATUS_LABELS[item.status] || item.status}
        </Badge>
      </div>

      {showEdit && (
        <EditContentDialog
          open={showEdit}
          onClose={() => setShowEdit(false)}
          onUpdated={fetchItem}
          item={item}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <ContentEditor item={item} onUpdate={setItem} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acoes</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentWorkflowActions
                item={item}
                onStatusChange={fetchItem}
              />
            </CardContent>
          </Card>

          <PostPreview
            provider={item.provider_target}
            text={item.text}
            influencerName={influencer?.name || "Influenciador"}
            influencerNiche={influencer?.niche}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informacoes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="ID" value={item.id.slice(0, 8) + "..."} />
              <Separator />
              <InfoRow
                label="Canal"
                value={
                  PROVIDER_LABELS[item.provider_target] ||
                  item.provider_target
                }
              />
              <Separator />
              <InfoRow label="Versao" value={`v${item.version}`} />
              <Separator />
              <InfoRow
                label="Agendado"
                value={formatDate(item.scheduled_at)}
              />
              <Separator />
              <InfoRow
                label="Publicado"
                value={formatDate(item.posted_at)}
              />
              {item.provider_post_id && (
                <>
                  <Separator />
                  <InfoRow label="Post ID" value={item.provider_post_id} />
                </>
              )}
              {item.retry_count > 0 && (
                <>
                  <Separator />
                  <InfoRow
                    label="Retries"
                    value={String(item.retry_count)}
                  />
                </>
              )}
              {item.last_error && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Ultimo Erro
                    </p>
                    <p className="text-sm text-destructive">
                      {item.last_error}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
