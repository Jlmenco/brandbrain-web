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
import {
  KeyValueListField,
  toPairs,
  fromPairs,
  type Pair,
} from "@/components/influencer/key-value-list-field";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: (kit: BrandKit) => void;
  influencerId: string;
  existing: BrandKit | null;
}

export function EditBrandKitDialog({
  open,
  onClose,
  onUpdated,
  influencerId,
  existing,
}: Props) {
  const [description, setDescription] = useState("");
  const [valueProps, setValueProps] = useState<Pair[]>([]);
  const [products, setProducts] = useState<Pair[]>([]);
  const [audience, setAudience] = useState<Pair[]>([]);
  const [styleGuidelines, setStyleGuidelines] = useState<Pair[]>([]);
  const [links, setLinks] = useState<Pair[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setDescription(existing.description || "");
      setValueProps(toPairs(existing.value_props));
      setProducts(toPairs(existing.products));
      setAudience(toPairs(existing.audience));
      setStyleGuidelines(toPairs(existing.style_guidelines));
      setLinks(toPairs(existing.links));
    } else {
      setDescription("");
      setValueProps([]);
      setProducts([]);
      setAudience([]);
      setStyleGuidelines([]);
      setLinks([]);
    }
    setError("");
  }, [existing, open]);

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      const kit = await api.upsertBrandKit(influencerId, {
        description: description.trim(),
        value_props: fromPairs(valueProps),
        products: fromPairs(products),
        audience: fromPairs(audience),
        style_guidelines: fromPairs(styleGuidelines),
        links: fromPairs(links),
      });
      onUpdated(kit);
      onClose();
      toast.success("Brand Kit salvo com sucesso");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erro ao salvar brand kit";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

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

          <KeyValueListField
            label="Proposta de Valor"
            help="Ex: diferencial → cálculo estrutural especializado"
            keyPlaceholder="diferencial"
            valuePlaceholder="cálculo estrutural especializado"
            value={valueProps}
            onChange={setValueProps}
            inputClass={inputClass}
          />
          <KeyValueListField
            label="Produtos"
            help="Ex: laudo_estrutural → análise técnica completa"
            keyPlaceholder="nome do produto"
            valuePlaceholder="descrição"
            value={products}
            onChange={setProducts}
            inputClass={inputClass}
          />
          <KeyValueListField
            label="Publico-alvo"
            help="Ex: setor → construtoras de médio porte"
            keyPlaceholder="característica"
            valuePlaceholder="valor"
            value={audience}
            onChange={setAudience}
            inputClass={inputClass}
          />
          <KeyValueListField
            label="Diretrizes de Estilo"
            help="Ex: tom → técnico e direto; palavras_proibidas → barato, simples"
            keyPlaceholder="diretriz"
            valuePlaceholder="valor"
            value={styleGuidelines}
            onChange={setStyleGuidelines}
            inputClass={inputClass}
          />
          <KeyValueListField
            label="Links"
            help="Ex: site → https://exemplo.com.br"
            keyPlaceholder="rótulo"
            valuePlaceholder="https://..."
            value={links}
            onChange={setLinks}
            inputClass={inputClass}
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
