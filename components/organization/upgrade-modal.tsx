"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  targetType?: "agency" | "group";
}

const BENEFITS: Record<string, { icon: string; text: string }[]> = {
  agency: [
    { icon: "👥", text: "Convide membros com roles (editor, admin)" },
    { icon: "🏷️", text: "Gerencie multiplos centros de custo" },
    { icon: "📊", text: "Fluxo de revisão e aprovação de conteúdo" },
    { icon: "📣", text: "Campanhas e pipeline de leads completo" },
    { icon: "🔗", text: "Integrações avançadas e webhooks" },
  ],
  group: [
    { icon: "🏗️", text: "Dashboard consolidado do grupo" },
    { icon: "🏢", text: "Gerencie multiplas filiais como sub-orgs" },
    { icon: "📈", text: "Metricas agregadas por grupo" },
    { icon: "🔐", text: "Permissoes granulares por filial" },
  ],
};

const LABELS: Record<string, string> = {
  agency: "Agencia",
  group: "Grupo",
};

export function UpgradeModal({ open, onClose, targetType = "agency" }: UpgradeModalProps) {
  const { selectedOrg, refreshOrgs } = useWorkspace();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!selectedOrg) return;
    setLoading(true);
    try {
      await api.upgradeOrg(selectedOrg.id, targetType);
      await refreshOrgs();
      toast.success(`Upgrade para ${LABELS[targetType]} realizado com sucesso!`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao fazer upgrade";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade para {LABELS[targetType]}</DialogTitle>
          <DialogDescription>
            Desbloqueie recursos avançados para sua conta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2">
          {(BENEFITS[targetType] ?? []).map((b, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-xl">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleUpgrade} disabled={loading}>
            {loading ? "Atualizando..." : `Fazer Upgrade para ${LABELS[targetType]}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
