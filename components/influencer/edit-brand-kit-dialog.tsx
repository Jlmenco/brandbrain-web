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
import type { BrandKit } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: (kit: BrandKit) => void;
  influencerId: string;
  existing: BrandKit | null;
}

function safeStringify(value: Record<string, unknown>): string {
  if (!value || Object.keys(value).length === 0) return "";
  return JSON.stringify(value, null, 2);
}

function safeParse(value: string): Record<string, unknown> {
  if (!value.trim()) return {};
  return JSON.parse(value);
}

export function EditBrandKitDialog({
  open,
  onClose,
  onUpdated,
  influencerId,
  existing,
}: Props) {
  const [description, setDescription] = useState("");
  const [valueProps, setValueProps] = useState("");
  const [products, setProducts] = useState("");
  const [audience, setAudience] = useState("");
  const [styleGuidelines, setStyleGuidelines] = useState("");
  const [links, setLinks] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setDescription(existing.description || "");
      setValueProps(safeStringify(existing.value_props));
      setProducts(safeStringify(existing.products));
      setAudience(safeStringify(existing.audience));
      setStyleGuidelines(safeStringify(existing.style_guidelines));
      setLinks(safeStringify(existing.links));
    } else {
      setDescription("");
      setValueProps("");
      setProducts("");
      setAudience("");
      setStyleGuidelines("");
      setLinks("");
    }
    setError("");
  }, [existing, open]);

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      const kit = await api.upsertBrandKit(influencerId, {
        description: description.trim(),
        value_props: safeParse(valueProps),
        products: safeParse(products),
        audience: safeParse(audience),
        style_guidelines: safeParse(styleGuidelines),
        links: safeParse(links),
      });
      onUpdated(kit);
      onClose();
      toast.success("Brand Kit salvo com sucesso");
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("JSON invalido em um dos campos");
        toast.error("JSON invalido em um dos campos");
      } else {
        const msg = err instanceof ApiError ? err.message : "Erro ao salvar brand kit";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const textareaClass = `${inputClass} resize-none font-mono text-xs`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {existing ? "Editar" : "Criar"} Brand Kit
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            <label className="text-sm font-medium">Descricao</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Descricao geral da marca..."
            />
          </div>

          <JsonField
            label="Proposta de Valor"
            value={valueProps}
            onChange={setValueProps}
            className={textareaClass}
          />
          <JsonField
            label="Produtos"
            value={products}
            onChange={setProducts}
            className={textareaClass}
          />
          <JsonField
            label="Publico-alvo"
            value={audience}
            onChange={setAudience}
            className={textareaClass}
          />
          <JsonField
            label="Diretrizes de Estilo"
            value={styleGuidelines}
            onChange={setStyleGuidelines}
            className={textareaClass}
          />
          <JsonField
            label="Links"
            value={links}
            onChange={setLinks}
            className={textareaClass}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JsonField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={className}
        placeholder='{"chave": "valor"}'
      />
    </div>
  );
}
