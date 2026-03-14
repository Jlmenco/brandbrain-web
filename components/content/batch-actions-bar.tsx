"use client";

import { useState } from "react";
import { CheckCheck, X, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BatchActionsBarProps {
  selectedIds: string[];
  onDone: () => void;
  onClear: () => void;
}

export function BatchActionsBar({ selectedIds, onDone, onClear }: BatchActionsBarProps) {
  const [loading, setLoading] = useState(false);

  async function execAction(action: string, label: string) {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const result = await api.batchAction(selectedIds, action);
      const ok = result.success.length;
      const fail = result.failed.length;
      if (ok > 0) toast.success(`${label}: ${ok} item(s) atualizados`);
      if (fail > 0) toast.warning(`${fail} item(s) nao puderam ser processados`);
      onDone();
    } catch {
      toast.error(`Erro ao executar ${label}`);
    } finally {
      setLoading(false);
    }
  }

  if (selectedIds.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium text-primary flex items-center gap-1.5">
        <CheckCheck className="h-4 w-4" />
        {selectedIds.length} selecionado(s)
      </span>

      <div className="flex-1" />

      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs"
        disabled={loading}
        onClick={() => execAction("submit_review", "Enviar para revisão")}
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Enviar Revisão
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        disabled={loading}
        onClick={() => execAction("approve", "Aprovar")}
      >
        <ThumbsUp className="h-3 w-3 mr-1" />
        Aprovar
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs border-red-300 text-red-700 hover:bg-red-50"
        disabled={loading}
        onClick={() => execAction("reject", "Rejeitar")}
      >
        <ThumbsDown className="h-3 w-3 mr-1" />
        Rejeitar
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-muted-foreground"
        onClick={onClear}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
