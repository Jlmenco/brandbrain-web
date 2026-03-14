"use client";

import { useState, useEffect, useRef } from "react";
import { Video, Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { ContentItem } from "@/lib/types";

interface VideoGeneratorProps {
  item: ContentItem;
  onGenerated?: () => void;
}

const JOB_POLL_INTERVAL = 5000; // 5 segundos

export function VideoGenerator({ item, onGenerated }: VideoGeneratorProps) {
  const [jobStatus, setJobStatus] = useState<ContentItem["video_job_status"]>(
    item.video_job_status
  );
  const [queuing, setQueuing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(() => {
    const refs = (item.media_refs || []) as Array<{ type: string }>;
    const videoRef = refs.find((m) => m.type === "video");
    return videoRef ? api.getVideoUrl(item.id) : null;
  });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Iniciar polling se job estiver em andamento
  useEffect(() => {
    if (jobStatus === "pending" || jobStatus === "processing") {
      pollRef.current = setInterval(async () => {
        try {
          const updated = await api.getContentItem(item.id);
          setJobStatus(updated.video_job_status);
          if (updated.video_job_status === "done") {
            const refs = (updated.media_refs || []) as Array<{ type: string }>;
            const videoRef = refs.find((m) => m.type === "video");
            if (videoRef) setVideoUrl(api.getVideoUrl(item.id) + "?t=" + Date.now());
            toast.success("Video gerado com sucesso!");
            onGenerated?.();
            clearInterval(pollRef.current!);
          } else if (updated.video_job_status === "failed") {
            toast.error(`Falha: ${updated.video_job_error || "erro desconhecido"}`);
            clearInterval(pollRef.current!);
          }
        } catch {
          // silencioso — continua tentando
        }
      }, JOB_POLL_INTERVAL);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobStatus]);

  const handleGenerate = async () => {
    setQueuing(true);
    try {
      await api.generateVideo(item.id);
      setJobStatus("pending");
      toast.info("Video enfileirado! Processando em segundo plano...");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enfileirar video";
      toast.error(msg);
    } finally {
      setQueuing(false);
    }
  };

  const isProcessing = jobStatus === "pending" || jobStatus === "processing";

  const statusBadge = () => {
    if (jobStatus === "pending") return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        Aguardando na fila...
      </div>
    );
    if (jobStatus === "processing") return (
      <div className="flex items-center gap-1.5 text-xs text-blue-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        Gerando video (ElevenLabs + Hedra)...
      </div>
    );
    if (jobStatus === "done") return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-600">
        <CheckCircle className="h-3 w-3" />
        Video gerado com sucesso
      </div>
    );
    if (jobStatus === "failed") return (
      <div className="flex items-center gap-1.5 text-xs text-destructive">
        <XCircle className="h-3 w-3" />
        Falha na geracao
      </div>
    );
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Video do Influenciador</span>
          {statusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videoUrl ? (
          <div className="rounded-lg overflow-hidden bg-black">
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              className="w-full max-h-[500px]"
              preload="metadata"
            />
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <Video className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Gere um video do influenciador falando o texto deste conteúdo
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Pipeline: Voz (ElevenLabs) + Lip sync (Hedra) — processado em segundo plano
            </p>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={queuing || isProcessing}
          size="sm"
          variant={videoUrl ? "outline" : "default"}
          className="w-full"
        >
          {queuing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enfileirando...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando em segundo plano...
            </>
          ) : videoUrl ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regerar Video
            </>
          ) : (
            <>
              <Video className="h-4 w-4 mr-2" />
              Gerar Video com IA
            </>
          )}
        </Button>

        {!item.influencer_id && (
          <p className="text-xs text-destructive text-center">
            Este conteúdo não tem influenciador associado.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
