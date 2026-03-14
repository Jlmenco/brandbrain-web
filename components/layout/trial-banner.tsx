"use client";

import { useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { X, Clock } from "lucide-react";

export function TrialBanner() {
  const { plan, trialDaysRemaining, isTrialExpired } = useWorkspace();
  const [dismissed, setDismissed] = useState(false);

  // Só exibe para contas em trial ativo (não expirado)
  if (plan !== "trial" || isTrialExpired || trialDaysRemaining === null || dismissed) {
    return null;
  }

  const isUrgent = trialDaysRemaining <= 7;

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 text-sm ${
        isUrgent
          ? "bg-destructive/10 text-destructive border-b border-destructive/20"
          : "bg-amber-50 text-amber-800 border-b border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 shrink-0" />
        {trialDaysRemaining === 0 ? (
          <span>
            <strong>Seu trial expira hoje.</strong> Assine agora para continuar usando o Brand Brain.
          </span>
        ) : (
          <span>
            <strong>{trialDaysRemaining} {trialDaysRemaining === 1 ? "dia restante" : "dias restantes"}</strong> no seu trial gratuito.{" "}
            {isUrgent && "Assine agora para não perder o acesso."}
          </span>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="ml-4 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
