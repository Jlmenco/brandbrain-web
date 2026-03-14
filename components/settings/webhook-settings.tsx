"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Webhook, Send, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useWorkspace } from "@/contexts/workspace-context";

const EVENTS = [
  { value: "submit_review", label: "Enviado para revisão" },
  { value: "approve", label: "Aprovado" },
  { value: "reject", label: "Rejeitado" },
  { value: "schedule", label: "Agendado" },
  { value: "publish_now", label: "Publicado" },
];

const PROVIDERS = [
  { value: "slack", label: "Slack" },
  { value: "discord", label: "Discord" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "custom", label: "Custom (JSON POST)" },
];

interface Hook {
  id: string;
  name: string;
  provider: string;
  url: string;
  events: string[];
  is_active: boolean;
}

export function WebhookSettings() {
  const { selectedOrg } = useWorkspace();
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [loading, setLoading] = useState(false);

  // Formulário de novo webhook
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("slack");
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedOrg) return;
    setLoading(true);
    api.listWebhooks(selectedOrg.id)
      .then(setHooks)
      .catch(() => setHooks([]))
      .finally(() => setLoading(false));
  }, [selectedOrg]);

  function toggleEvent(ev: string) {
    setEvents((prev) => prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrg || !name || !url) return;
    setSaving(true);
    try {
      const hook = await api.createWebhook(selectedOrg.id, { name, provider, url, events });
      setHooks((prev) => [hook, ...prev]);
      toast.success("Webhook criado!");
      setShowForm(false); setName(""); setUrl(""); setEvents([]);
    } catch {
      toast.error("Erro ao criar webhook");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest(hookId: string) {
    setTestingId(hookId);
    try {
      await api.testWebhook(hookId);
      toast.success("Teste enviado com sucesso!");
    } catch {
      toast.error("Falha ao enviar teste");
    } finally {
      setTestingId(null);
    }
  }

  async function handleDelete(hookId: string) {
    try {
      await api.deleteWebhook(hookId);
      setHooks((prev) => prev.filter((h) => h.id !== hookId));
      toast.success("Webhook removido");
    } catch {
      toast.error("Erro ao remover webhook");
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Webhooks</CardTitle>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-3 w-3 mr-1" />
            Novo
          </Button>
        </div>
        <CardDescription>
          Notificações reais via Slack, Discord, Teams ou URL personalizada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleCreate} className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Nome</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Slack #marketing" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Provider</label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">URL do Webhook</label>
              <Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.slack.com/..." required />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Eventos (vazio = todos)</label>
              <div className="flex flex-wrap gap-2">
                {EVENTS.map((ev) => (
                  <label key={ev.value} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" checked={events.includes(ev.value)} onChange={() => toggleEvent(ev.value)} className="rounded" />
                    {ev.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" size="sm" disabled={saving}>{saving ? "Salvando..." : "Criar"}</Button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : hooks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum webhook configurado.</p>
        ) : (
          <div className="space-y-3">
            {hooks.map((hook) => (
              <div key={hook.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{hook.name}</span>
                    <Badge variant="outline" className="text-xs shrink-0">{hook.provider}</Badge>
                    {!hook.is_active && <Badge variant="outline" className="text-xs bg-red-50 text-red-600">Inativo</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{hook.url}</p>
                  {hook.events.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hook.events.map((ev) => (
                        <Badge key={ev} variant="secondary" className="text-xs px-1 py-0">
                          {EVENTS.find((e) => e.value === ev)?.label || ev}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleTest(hook.id)} disabled={testingId === hook.id}>
                    <Send className="h-3 w-3 mr-1" />
                    {testingId === hook.id ? "..." : "Testar"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => handleDelete(hook.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
