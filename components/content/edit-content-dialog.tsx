"use client";

import { useState, useEffect } from "react";
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
import type { ContentItem } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  item: ContentItem;
}

export function EditContentDialog({ open, onClose, onUpdated, item }: Props) {
  const [providerTarget, setProviderTarget] = useState(item.provider_target);
  const [text, setText] = useState(item.text);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProviderTarget(item.provider_target);
    setText(item.text);
    setError("");
  }, [item]);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSaving(true);
    setError("");
    try {
      await api.updateContentItem(item.id, {
        text: text.trim(),
        provider_target: providerTarget,
      });
      onUpdated();
      onClose();
      toast.success("Conteúdo atualizado com sucesso");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Erro ao atualizar conteúdo";
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
        if (!v) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Conteúdo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
              rows={8}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !text.trim()}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
