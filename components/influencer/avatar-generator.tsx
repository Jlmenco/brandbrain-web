"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface AvatarGeneratorProps {
  influencerId: string;
  influencerName: string;
}

export function AvatarGenerator({ influencerId, influencerName }: AvatarGeneratorProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [revisedPrompt, setRevisedPrompt] = useState("");

  // Verificar se avatar existe ao montar
  const checkAvatar = () => {
    if (checked) return;
    const url = api.getAvatarUrl(influencerId);
    const img = new Image();
    img.onload = () => {
      setAvatarUrl(url + "?t=" + Date.now());
      setChecked(true);
    };
    img.onerror = () => setChecked(true);
    img.src = url;
  };

  // Check on first render
  if (!checked) checkAvatar();

  const handleGenerate = async () => {
    setLoading(true);
    setRevisedPrompt("");
    try {
      const result = await api.generateAvatar(influencerId);
      setAvatarUrl(api.getAvatarUrl(influencerId) + "?t=" + Date.now());
      setRevisedPrompt(result.revised_prompt);
      toast.success("Avatar gerado com sucesso!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar avatar";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const initials = influencerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Avatar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`Avatar de ${influencerName}`}
            className="w-40 h-40 rounded-full object-cover border-4 border-background shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {initials}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            size="sm"
            variant={avatarUrl ? "outline" : "default"}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Gerando...
              </>
            ) : avatarUrl ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Regerar
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Gerar Avatar com IA
              </>
            )}
          </Button>
        </div>

        {revisedPrompt && (
          <p className="text-[11px] text-muted-foreground text-center max-w-xs leading-relaxed">
            {revisedPrompt.slice(0, 200)}...
          </p>
        )}

        {!avatarUrl && checked && (
          <p className="text-xs text-muted-foreground text-center">
            Gere um avatar fotorrealista baseado nas configuracoes do influenciador
          </p>
        )}
      </CardContent>
    </Card>
  );
}
