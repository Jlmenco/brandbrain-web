"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Webhook, Send, Save, Info } from "lucide-react";

interface WebhookConfig {
  url: string;
  events: {
    "content:published": boolean;
    "content:approved": boolean;
    "content:rejected": boolean;
    "lead:created": boolean;
  };
}

const STORAGE_KEY = "bb_webhook_config";

const EVENT_LABELS: Record<keyof WebhookConfig["events"], string> = {
  "content:published": "Conteudo publicado",
  "content:approved": "Conteudo aprovado",
  "content:rejected": "Conteudo rejeitado",
  "lead:created": "Novo lead capturado",
};

const DEFAULT_CONFIG: WebhookConfig = {
  url: "",
  events: {
    "content:published": false,
    "content:approved": false,
    "content:rejected": false,
    "lead:created": false,
  },
};

export function WebhookSettings() {
  const [config, setConfig] = useState<WebhookConfig>(DEFAULT_CONFIG);
  const [testing, setTesting] = useState(false);

  // Carrega config salva do localStorage ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WebhookConfig;
        setConfig(parsed);
      }
    } catch {
      // localStorage indisponivel ou JSON invalido — usa defaults
    }
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({ ...prev, url: e.target.value }));
  };

  const handleEventToggle = (event: keyof WebhookConfig["events"]) => {
    setConfig((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: !prev.events[event],
      },
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      toast.success("Configuracao de webhook salva com sucesso");
    } catch {
      toast.error("Erro ao salvar configuracao");
    }
  };

  const handleTest = async () => {
    if (!config.url) {
      toast.error("Informe a URL do webhook antes de testar");
      return;
    }

    setTesting(true);

    // Simula envio de teste (sem backend real)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Webhook de teste enviado com sucesso (simulacao)");
    setTesting(false);
  };

  const selectedCount = Object.values(config.events).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Integracoes</CardTitle>
        </div>
        <CardDescription>
          Configure webhooks para receber notificacoes externas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL do Webhook */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Webhook URL</label>
          <Input
            type="url"
            placeholder="https://hooks.slack.com/services/..."
            value={config.url}
            onChange={handleUrlChange}
          />
        </div>

        <Separator />

        {/* Eventos */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Eventos</p>
            <p className="text-sm text-muted-foreground">
              Selecione quais eventos disparam notificacoes
            </p>
          </div>
          <div className="space-y-2">
            {(
              Object.entries(EVENT_LABELS) as [
                keyof WebhookConfig["events"],
                string,
              ][]
            ).map(([event, label]) => (
              <label
                key={event}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={config.events[event]}
                  onChange={() => handleEventToggle(event)}
                  className="rounded border-input"
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {event}
                </span>
                <span className="text-muted-foreground">—</span>
                <span>{label}</span>
              </label>
            ))}
          </div>
          {selectedCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedCount} evento{selectedCount !== 1 ? "s" : ""}{" "}
              selecionado{selectedCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Separator />

        {/* Acoes */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testing || !config.url}
          >
            <Send className="h-4 w-4 mr-2" />
            {testing ? "Enviando..." : "Testar Webhook"}
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>

        <Separator />

        {/* Nota informativa */}
        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 p-3">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Integracao com Slack, Discord e Microsoft Teams. Backend em
            desenvolvimento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
