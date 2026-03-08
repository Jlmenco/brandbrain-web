"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  onComplete: () => void;
}

interface BrandFormData {
  name: string;
  code: string;
  mediaBudget: string;
  aiBudget: string;
}

interface InfluencerFormData {
  name: string;
  type: string;
  niche: string;
  tone: string;
  language: string;
}

const TOTAL_STEPS = 3;

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 2: Brand form data
  const [brandData, setBrandData] = useState<BrandFormData>({
    name: "",
    code: "",
    mediaBudget: "",
    aiBudget: "",
  });

  // Step 3: Influencer form data
  const [influencerData, setInfluencerData] = useState<InfluencerFormData>({
    name: "",
    type: "master",
    niche: "",
    tone: "",
    language: "pt-BR",
  });

  const canAdvanceStep2 = brandData.name.trim() !== "" && brandData.code.trim() !== "";
  const canAdvanceStep3 = influencerData.name.trim() !== "" && influencerData.niche.trim() !== "";

  function handleNext() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrevious() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleComplete() {
    localStorage.setItem("bb_onboarding_done", "true");
    onComplete();
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-[600px]">
        <CardContent className="p-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    i + 1 === currentStep
                      ? "bg-primary text-primary-foreground"
                      : i + 1 < currentStep
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 transition-colors",
                      i + 1 < currentStep ? "bg-primary/40" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mb-6">
            Passo {currentStep} de {TOTAL_STEPS}
          </p>

          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Bem-vindo ao Brand Brain</h2>
                <p className="text-muted-foreground">
                  Sua plataforma de inteligencia de marca autonoma. Vamos configurar
                  tudo em poucos passos.
                </p>
              </div>

              <div className="grid gap-4 mt-6">
                {[
                  {
                    icon: "\u{1F4CA}",
                    text: "Gerencie multiplas marcas e influenciadores",
                  },
                  {
                    icon: "\u{1F916}",
                    text: "Gere conteudo com IA",
                  },
                  {
                    icon: "\u{1F4C5}",
                    text: "Agende e publique automaticamente",
                  },
                  {
                    icon: "\u{1F4C8}",
                    text: "Acompanhe metricas e resultados",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} size="lg">
                  Proximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Configure brand */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Configure sua primeira marca</h2>
                <p className="text-muted-foreground">
                  Informe os dados basicos da marca que voce deseja gerenciar.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nome da marca <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Minha Marca"
                    value={brandData.name}
                    onChange={(e) =>
                      setBrandData({ ...brandData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Codigo <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: MRK"
                    value={brandData.code}
                    maxLength={10}
                    onChange={(e) =>
                      setBrandData({
                        ...brandData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Codigo curto para identificar a marca (ex: MRK, BB)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Orcamento mensal midia
                    </label>
                    <Input
                      type="number"
                      placeholder="R$ 0,00"
                      value={brandData.mediaBudget}
                      onChange={(e) =>
                        setBrandData({ ...brandData, mediaBudget: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Orcamento mensal IA
                    </label>
                    <Input
                      type="number"
                      placeholder="R$ 0,00"
                      value={brandData.aiBudget}
                      onChange={(e) =>
                        setBrandData({ ...brandData, aiBudget: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button onClick={handleNext} disabled={!canAdvanceStep2}>
                  Proximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Create influencer */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  Crie seu primeiro influenciador
                </h2>
                <p className="text-muted-foreground">
                  Configure o perfil do influenciador que representara sua marca.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nome <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Ana Digital"
                    value={influencerData.name}
                    onChange={(e) =>
                      setInfluencerData({
                        ...influencerData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={influencerData.type}
                    onValueChange={(value) =>
                      setInfluencerData({ ...influencerData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="brand">Brand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nicho <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Tecnologia, Moda, Saude"
                    value={influencerData.niche}
                    onChange={(e) =>
                      setInfluencerData({
                        ...influencerData,
                        niche: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tom</label>
                  <Input
                    placeholder="Profissional, informal..."
                    value={influencerData.tone}
                    onChange={(e) =>
                      setInfluencerData({
                        ...influencerData,
                        tone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Idioma</label>
                  <Select
                    value={influencerData.language}
                    onValueChange={(value) =>
                      setInfluencerData({ ...influencerData, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Portugues (pt-BR)</SelectItem>
                      <SelectItem value="en-US">English (en-US)</SelectItem>
                      <SelectItem value="es">Espanol (es)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button onClick={handleComplete} disabled={!canAdvanceStep3}>
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
