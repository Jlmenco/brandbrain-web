"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingProgress {
  id: string;
  steps_completed: string[];
  steps_total: string[];
  is_dismissed: boolean;
  is_complete: boolean;
}

const STEP_CONFIG: Record<string, { label: string; description: string; href: string }> = {
  profile_setup: {
    label: "Configurar perfil",
    description: "Crie sua conta e organizacao",
    href: "/configuracoes",
  },
  first_influencer: {
    label: "Adicionar influenciador",
    description: "Cadastre seu primeiro influenciador ou marca",
    href: "/influenciadores",
  },
  brand_kit: {
    label: "Configurar Brand Kit",
    description: "Defina tom de voz, cores e diretrizes da marca",
    href: "/influenciadores",
  },
  first_content: {
    label: "Criar primeiro conteudo",
    description: "Crie seu primeiro conteudo para redes sociais",
    href: "/conteudos",
  },
  first_publish: {
    label: "Publicar conteudo",
    description: "Publique ou agende seu primeiro conteudo",
    href: "/conteudos",
  },
  connect_social: {
    label: "Conectar rede social",
    description: "Integre sua conta do Instagram, LinkedIn ou outra rede",
    href: "/configuracoes",
  },
};

export function OnboardingChecklist() {
  const { selectedOrg } = useWorkspace();
  const router = useRouter();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [hidden, setHidden] = useState(false);

  const fetchProgress = useCallback(() => {
    if (!selectedOrg) return;
    api
      .getOnboardingProgress(selectedOrg.id)
      .then((p) => {
        setProgress(p);
        if (p.is_complete || p.is_dismissed) setHidden(true);
      })
      .catch(() => setHidden(true));
  }, [selectedOrg]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleDismiss = async () => {
    if (!selectedOrg) return;
    try {
      await api.dismissOnboarding(selectedOrg.id);
      setHidden(true);
    } catch {}
  };

  if (hidden || !progress || progress.is_complete || progress.is_dismissed) {
    return null;
  }

  const completedCount = progress.steps_completed.length;
  const totalCount = progress.steps_total.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="mx-4 lg:mx-6 mt-2 border-primary/20 bg-primary/[0.02]">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            Primeiros passos
            <span className="text-xs font-normal text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDismiss}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
          {progress.steps_total.map((step) => {
            const config = STEP_CONFIG[step];
            if (!config) return null;
            const done = progress.steps_completed.includes(step);
            return (
              <button
                key={step}
                onClick={() => !done && router.push(config.href)}
                disabled={done}
                className={`flex items-start gap-2 text-left p-2 rounded-md transition-colors ${
                  done
                    ? "opacity-60"
                    : "hover:bg-muted/50 cursor-pointer"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-xs font-medium ${done ? "line-through" : ""}`}>
                    {config.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
