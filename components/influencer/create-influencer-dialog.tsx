"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  orgId: string;
}

export function CreateInfluencerDialog({
  open,
  onClose,
  onCreated,
  orgId,
}: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"master" | "brand">("brand");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("");
  const [emojiLevel, setEmojiLevel] = useState("low");
  const [language, setLanguage] = useState("pt-BR");
  const [ctaStyle, setCtaStyle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setType("brand");
    setNiche("");
    setTone("");
    setEmojiLevel("low");
    setLanguage("pt-BR");
    setCtaStyle("");
    setError("");
  }

  async function handleSubmit() {
    if (!name.trim() || !niche.trim() || !tone.trim()) return;
    setSaving(true);
    setError("");
    try {
      await api.createInfluencer(orgId, {
        name: name.trim(),
        type,
        niche: niche.trim(),
        tone: tone.trim(),
        emoji_level: emojiLevel,
        language,
        cta_style: ctaStyle.trim() || undefined,
      });
      reset();
      onCreated();
      onClose();
      toast.success("Influenciador criado com sucesso");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erro ao criar influenciador";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Influenciador</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nome do influenciador"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "master" | "brand")}
                className={inputClass}
              >
                <option value="brand">Marca</option>
                <option value="master">Master</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Idioma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={inputClass}
              >
                <option value="pt-BR">Portugues (BR)</option>
                <option value="en">Ingles</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nicho</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={inputClass}
              placeholder="ex: tecnologia, moda, saude"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tom de Voz</label>
            <input
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={inputClass}
              placeholder="ex: profissional, casual, inspirador"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nivel de Emoji</label>
              <select
                value={emojiLevel}
                onChange={(e) => setEmojiLevel(e.target.value)}
                className={inputClass}
              >
                <option value="none">Nenhum</option>
                <option value="low">Baixo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estilo CTA</label>
              <input
                value={ctaStyle}
                onChange={(e) => setCtaStyle(e.target.value)}
                className={inputClass}
                placeholder="ex: Saiba mais"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !name.trim() || !niche.trim() || !tone.trim()}
            >
              {saving ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
