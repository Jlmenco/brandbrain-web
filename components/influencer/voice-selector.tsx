"use client";

import { useEffect, useState } from "react";
import { Mic, Check } from "lucide-react";
import { api } from "@/lib/api-client";
import type { ElevenLabsVoice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface VoiceSelectorProps {
  influencerId: string;
  currentVoiceId: string | null;
  onSaved?: (voiceId: string | null) => void;
}

export function VoiceSelector({ influencerId, currentVoiceId, onSaved }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [selected, setSelected] = useState<string>(currentVoiceId || "");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listVoices()
      .then((data) => setVoices(data.voices))
      .catch(() => setVoices([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelected(currentVoiceId || "");
  }, [currentVoiceId]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateInfluencer(influencerId, { voice_id: selected || undefined });
      toast.success("Voz do influenciador salva!");
      onSaved?.(selected || null);
    } catch {
      toast.error("Erro ao salvar voz");
    } finally {
      setSaving(false);
    }
  }

  const selectedVoice = voices.find((v) => v.voice_id === selected);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Mic className="h-4 w-4 text-muted-foreground" />
          Voz (ElevenLabs)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Selecione a voz usada para gerar vídeos deste influenciador.
        </p>

        {loading ? (
          <div className="h-9 bg-muted rounded animate-pulse" />
        ) : voices.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhuma voz disponível. Verifique a ELEVENLABS_API_KEY.
          </p>
        ) : (
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar voz..." />
            </SelectTrigger>
            <SelectContent>
              {voices.map((v) => (
                <SelectItem key={v.voice_id} value={v.voice_id}>
                  <span className="font-medium">{v.name}</span>
                  {v.labels.gender && (
                    <span className="ml-1 text-muted-foreground text-xs">
                      · {v.labels.gender}
                    </span>
                  )}
                  {v.labels.accent && (
                    <span className="ml-1 text-muted-foreground text-xs">
                      · {v.labels.accent}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedVoice && (
          <p className="text-xs text-muted-foreground">
            ID: <code className="bg-muted px-1 rounded">{selectedVoice.voice_id}</code>
          </p>
        )}

        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || loading || selected === (currentVoiceId || "")}
          className="w-full"
        >
          {saving ? (
            "Salvando..."
          ) : (
            <>
              <Check className="h-3 w-3 mr-1" />
              Salvar Voz
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
