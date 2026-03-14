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
import { PROVIDER_LABELS } from "@/lib/constants";
import { toast } from "sonner";
import type { Influencer } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  costCenterId: string;
  influencers: Influencer[];
}

export function CreateContentDialog({
  open,
  onClose,
  onCreated,
  costCenterId,
  influencers,
}: Props) {
  const [providerTarget, setProviderTarget] = useState("linkedin");
  const [influencerId, setInfluencerId] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setProviderTarget("linkedin");
    setInfluencerId("");
    setText("");
    setError("");
  }

  async function handleSubmit() {
    if (!influencerId || !text.trim()) return;
    setSaving(true);
    setError("");
    try {
      await api.createContentItem({
        cost_center_id: costCenterId,
        influencer_id: influencerId,
        provider_target: providerTarget,
        text: text.trim(),
      });
      reset();
      onCreated();
      onClose();
      toast.success("Conteúdo criado com sucesso");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erro ao criar conteúdo";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

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
          <DialogTitle>Novo Conteúdo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Influenciador</label>
            <select
              value={influencerId}
              onChange={(e) => setInfluencerId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione...</option>
              {influencers.map((inf) => (
                <option key={inf.id} value={inf.id}>
                  {inf.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plataforma</label>
            <select
              value={providerTarget}
              onChange={(e) => setProviderTarget(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Texto</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Escreva o conteúdo aqui..."
            />
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
              disabled={saving || !influencerId || !text.trim()}
            >
              {saving ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
