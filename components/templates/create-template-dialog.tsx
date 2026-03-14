"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { ContentTemplate } from "@/lib/types";

interface CreateTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (tpl: ContentTemplate) => void;
  orgId: string;
}

const PROVIDERS = [
  { value: "", label: "Todos os canais" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];

export function CreateTemplateDialog({ open, onClose, onCreated, orgId }: CreateTemplateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSaving(true);
    try {
      const tpl = await api.createTemplate(orgId, {
        name: name.trim(),
        description: description.trim(),
        provider_target: provider,
        text_template: text.trim(),
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      toast.success("Template criado!");
      onCreated(tpl);
      onClose();
      setName(""); setDescription(""); setProvider(""); setText(""); setTags("");
    } catch {
      toast.error("Erro ao criar template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Nome *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template de lançamento" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Descrição</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Quando usar este template..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Canal</label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Texto do Template * <span className="text-muted-foreground/60">(use {"{{"}brand_name{"}}"}, {"{{"}cta{"}}"}, {"{{"}produto{"}}"} como placeholders)</span>
            </label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[140px] resize-y focus:outline-none focus:ring-1 focus:ring-ring"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Olá! 👋 Sou {{brand_name}} e quero compartilhar {{produto}}.\n\n{{cta}}"}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Tags (separadas por vírgula)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="lançamento, produto, engajamento" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={saving || !name.trim() || !text.trim()}>
              {saving ? "Salvando..." : "Criar Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
