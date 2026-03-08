"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import type { ContentItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScheduleDialog } from "./schedule-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useWorkspace } from "@/contexts/workspace-context";

interface Props {
  item: ContentItem;
  onStatusChange: () => void;
}

export function ContentWorkflowActions({ item, onStatusChange }: Props) {
  const { can } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function doAction(fn: () => Promise<unknown>, successMsg?: string) {
    setLoading(true);
    setError("");
    try {
      await fn();
      onStatusChange();
      if (successMsg) toast.success(successMsg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro na operacao";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {item.status === "draft" && can("content:submit_review") && (
        <Button
          onClick={() => doAction(() => api.submitReview(item.id), "Enviado para revisao")}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar para Revisao"}
        </Button>
      )}

      {item.status === "review" && can("content:approve") && (
        <div className="space-y-3">
          <Input
            placeholder="Observacoes (opcional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() =>
                doAction(() => api.approve(item.id, notes || undefined), "Conteudo aprovado")
              }
              disabled={loading}
            >
              Aprovar
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                doAction(() =>
                  api.requestChanges(item.id, notes || undefined), "Alteracoes solicitadas"
                )
              }
              disabled={loading}
            >
              Solicitar Alteracoes
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowConfirmReject(true)}
              disabled={loading}
            >
              Rejeitar
            </Button>
          </div>
        </div>
      )}

      {item.status === "approved" && can("content:schedule") && (
        <div className="flex gap-2">
          <Button onClick={() => setShowSchedule(true)} disabled={loading}>
            Agendar
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConfirmPublish(true)}
            disabled={loading}
          >
            Publicar Agora
          </Button>
        </div>
      )}

      {item.status === "scheduled" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Agendado para: {formatDate(item.scheduled_at)}
          </p>
          {can("content:publish") && (
            <Button
              variant="outline"
              onClick={() => setShowConfirmPublish(true)}
              disabled={loading}
            >
              Publicar Agora
            </Button>
          )}
        </div>
      )}

      {item.status === "publishing" && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-purple-600">Publicando... aguarde.</p>
          <span className="text-xs text-muted-foreground">(modo simulacao)</span>
        </div>
      )}

      {item.status === "posted" && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-emerald-600 font-medium">
              Publicado com sucesso!
            </p>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Simulacao
            </span>
          </div>
          {item.posted_at && (
            <p className="text-xs text-muted-foreground">
              Em {formatDate(item.posted_at)}
            </p>
          )}
          {item.provider_post_url && (
            <a
              href={item.provider_post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Ver publicacao <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {item.status === "failed" && (
        <div className="space-y-1">
          <p className="text-sm text-red-600">
            Erro: {item.last_error || "Falha na publicacao"}
          </p>
          <p className="text-xs text-muted-foreground">
            Tentativas: {item.retry_count}
          </p>
        </div>
      )}

      {item.status === "rejected" && (
        <p className="text-sm text-red-600">Este conteudo foi rejeitado.</p>
      )}

      <ScheduleDialog
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        onSchedule={(dt) =>
          doAction(() => api.schedule(item.id, dt), "Conteudo agendado")
        }
      />

      <ConfirmDialog
        open={showConfirmReject}
        onClose={() => setShowConfirmReject(false)}
        onConfirm={() => {
          setShowConfirmReject(false);
          doAction(() => api.reject(item.id, notes || undefined), "Conteudo rejeitado");
        }}
        title="Rejeitar Conteudo"
        description="Tem certeza que deseja rejeitar este conteudo?"
        confirmLabel="Rejeitar"
        variant="destructive"
        loading={loading}
      />

      <ConfirmDialog
        open={showConfirmPublish}
        onClose={() => setShowConfirmPublish(false)}
        onConfirm={() => {
          setShowConfirmPublish(false);
          doAction(() => api.publishNow(item.id), "Publicacao iniciada");
        }}
        title="Publicar Conteudo"
        description="Publicar este conteudo imediatamente?"
        confirmLabel="Publicar Agora"
        variant="default"
        loading={loading}
      />
    </div>
  );
}
