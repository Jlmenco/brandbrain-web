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
import { api } from "@/lib/api-client";
import { useWorkspace } from "@/contexts/workspace-context";
import type { AccountType } from "@/lib/types";

interface OnboardingWizardProps {
  onComplete: () => void;
}

interface SoloFormData {
  brandName: string;
  niche: string;
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

const PROFILE_OPTIONS: { type: AccountType; icon: string; title: string; description: string }[] = [
  {
    type: "solo",
    icon: "🧑‍💼",
    title: "Solo",
    description: "Empreendedor ou criador que cuida das próprias mídias sociais",
  },
  {
    type: "agency",
    icon: "🏢",
    title: "Agência",
    description: "Agência ou equipe de marketing gerenciando marcas e clientes",
  },
  {
    type: "group",
    icon: "🏗️",
    title: "Grupo",
    description: "Holding ou grupo com múltiplas filiais e marcas",
  },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { selectedOrg, refreshOrgs } = useWorkspace();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(false);

  // Solo setup data (step 2 for solo)
  const [soloData, setSoloData] = useState<SoloFormData>({ brandName: "", niche: "" });

  // Agency: step 2
  const [brandData, setBrandData] = useState<BrandFormData>({
    name: "",
    code: "",
    mediaBudget: "",
    aiBudget: "",
  });

  // Agency: step 3
  const [influencerData, setInfluencerData] = useState<InfluencerFormData>({
    name: "",
    type: "master",
    niche: "",
    tone: "",
    language: "pt-BR",
  });

  // Group: step 2 = group name (org already has name), step 3 = first filial name
  const [groupFilialName, setGroupFilialName] = useState("");

  const isSolo = selectedProfile === "solo";
  const isGroup = selectedProfile === "group";
  const totalSteps = isSolo ? 2 : 3;

  const canAdvanceStep1 = selectedProfile !== null;
  const canAdvanceStep2Solo = soloData.brandName.trim() !== "" && soloData.niche.trim() !== "";
  const canAdvanceStep2Agency = brandData.name.trim() !== "" && brandData.code.trim() !== "";
  const canAdvanceStep3Agency = influencerData.name.trim() !== "" && influencerData.niche.trim() !== "";
  const canAdvanceStep3Group = groupFilialName.trim() !== "";

  function handleNext() {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrevious() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }

  async function handleComplete() {
    setLoading(true);
    try {
      if (isSolo && selectedOrg) {
        await api.updateOrg(selectedOrg.id, { account_type: "solo" });
        await api.setupSolo(selectedOrg.id, {
          brand_name: soloData.brandName,
          niche: soloData.niche,
        });
        await refreshOrgs();
      } else if (isGroup && selectedOrg) {
        await api.updateOrg(selectedOrg.id, { account_type: "group" });
        if (groupFilialName.trim()) {
          await api.createFilial(selectedOrg.id, { name: groupFilialName.trim() });
        }
        await refreshOrgs();
      }
      localStorage.setItem("bb_onboarding_done", "true");
      onComplete();
    } catch {
      localStorage.setItem("bb_onboarding_done", "true");
      onComplete();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-[600px]">
        <CardContent className="p-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
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
                {i < totalSteps - 1 && (
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
            Passo {currentStep} de {totalSteps}
          </p>

          {/* Step 1: Profile selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Bem-vindo ao Brand Brain</h2>
                <p className="text-muted-foreground">
                  Qual é o seu perfil? Isso personaliza sua experiência.
                </p>
              </div>

              <div className="grid gap-3 mt-6">
                {PROFILE_OPTIONS.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedProfile(option.type)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all w-full",
                      selectedProfile === option.type
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/40 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <div className="font-semibold">{option.title}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                    {selectedProfile === option.type && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={!canAdvanceStep1} size="lg">
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 Solo: Minha Marca */}
          {currentStep === 2 && isSolo && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Configure sua marca</h2>
                <p className="text-muted-foreground">
                  Vamos criar o perfil da sua marca automaticamente.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nome da sua marca <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Joao Silva Consultoria"
                    value={soloData.brandName}
                    onChange={(e) => setSoloData({ ...soloData, brandName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nicho / Segmento <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Consultoria financeira, Moda, Saude e bem-estar"
                    value={soloData.niche}
                    onChange={(e) => setSoloData({ ...soloData, niche: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Isso ajuda a IA a gerar conteúdo relevante para o seu público.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button onClick={handleComplete} disabled={!canAdvanceStep2Solo || loading}>
                  {loading ? "Configurando..." : "Concluir"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 Group: info sobre estrutura */}
          {currentStep === 2 && isGroup && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Configure seu Grupo</h2>
                <p className="text-muted-foreground">
                  Seu grupo já está criado. Agora vamos adicionar a primeira filial.
                </p>
              </div>

              <div className="grid gap-4 mt-6">
                {[
                  { icon: "🏗️", text: "O grupo é a organização central que consolida todas as filiais" },
                  { icon: "🏢", text: "Cada filial opera de forma independente com seu próprio time" },
                  { icon: "📊", text: "O painel /grupo mostra métricas consolidadas de todas as filiais" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious}>Anterior</Button>
                <Button onClick={handleNext}>Próximo</Button>
              </div>
            </div>
          )}

          {/* Step 3 Group: primeira filial */}
          {currentStep === 3 && isGroup && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Primeira Filial</h2>
                <p className="text-muted-foreground">
                  Crie a primeira filial do seu grupo. Você pode adicionar mais depois.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nome da filial <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Loja Centro, Unidade SP, Filial Norte"
                    value={groupFilialName}
                    onChange={(e) => setGroupFilialName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious}>Anterior</Button>
                <Button onClick={handleComplete} disabled={!canAdvanceStep3Group || loading}>
                  {loading ? "Criando..." : "Concluir"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 Agency: Configure brand */}
          {currentStep === 2 && !isSolo && !isGroup && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Configure sua primeira marca</h2>
                <p className="text-muted-foreground">
                  Informe os dados básicos da marca que você deseja gerenciar.
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
                    onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Código <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ex: MRK"
                    value={brandData.code}
                    maxLength={10}
                    onChange={(e) =>
                      setBrandData({ ...brandData, code: e.target.value.toUpperCase() })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Código curto para identificar a marca (ex: MRK, BB)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Orçamento mensal mídia</label>
                    <Input
                      type="number"
                      placeholder="R$ 0,00"
                      value={brandData.mediaBudget}
                      onChange={(e) => setBrandData({ ...brandData, mediaBudget: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Orçamento mensal IA</label>
                    <Input
                      type="number"
                      placeholder="R$ 0,00"
                      value={brandData.aiBudget}
                      onChange={(e) => setBrandData({ ...brandData, aiBudget: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button onClick={handleNext} disabled={!canAdvanceStep2Agency}>
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 Agency: Create influencer */}
          {currentStep === 3 && !isSolo && !isGroup && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  Crie seu primeiro influenciador
                </h2>
                <p className="text-muted-foreground">
                  Configure o perfil do influenciador que representará sua marca.
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
                    onChange={(e) => setInfluencerData({ ...influencerData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={influencerData.type}
                    onValueChange={(value) => setInfluencerData({ ...influencerData, type: value })}
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
                    onChange={(e) => setInfluencerData({ ...influencerData, niche: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tom</label>
                  <Input
                    placeholder="Profissional, informal..."
                    value={influencerData.tone}
                    onChange={(e) => setInfluencerData({ ...influencerData, tone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Idioma</label>
                  <Select
                    value={influencerData.language}
                    onValueChange={(value) => setInfluencerData({ ...influencerData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (pt-BR)</SelectItem>
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
                <Button onClick={handleComplete} disabled={!canAdvanceStep3Agency || loading}>
                  {loading ? "Concluindo..." : "Concluir"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
