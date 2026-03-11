"use client";

import { useState } from "react";
import { Video, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { ContentItem } from "@/lib/types";

interface VideoGeneratorProps {
  item: ContentItem;
  onGenerated?: () => void;
}

export function VideoGenerator({ item, onGenerated }: VideoGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(() => {
    const refs = (item.media_refs || []) as Array<{ type: string }>;
    const videoRef = refs.find((m) => m.type === "video");
    return videoRef ? api.getVideoUrl(item.id) : null;
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await api.generateVideo(item.id);
      setVideoUrl(api.getVideoUrl(item.id) + "?t=" + Date.now());
      toast.success("Video gerado com sucesso!");
      onGenerated?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar video";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Video do Influenciador</CardTitle>
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
              Gere um video do influenciador falando o texto deste conteudo
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Usa IA para criar voz realista + lip sync com o avatar
            </p>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          size="sm"
          variant={videoUrl ? "outline" : "default"}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Gerando video... (pode levar 1-2 min)
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
            Este conteudo nao tem influenciador associado. Associe um influenciador primeiro.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
