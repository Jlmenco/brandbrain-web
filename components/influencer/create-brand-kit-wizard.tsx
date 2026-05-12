"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import type { BrandKit, Influencer } from "@/lib/types";
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
  onSaved: (kit: BrandKit) => void;
  influencer: Influencer;
  existing: BrandKit | null;
}

type AiField = "description" | "value_props" | "products" | "audience" | "style_guidelines";

const STEP_TITLES = [
  "Vamos lá!",
  "Descrição da marca",
  "Proposta de valor",
  "Produtos e serviços",
  "Público-alvo",
  "Diretrizes de estilo",
  "Links",
  "Revisão",
] as const;

export function CreateBrandKitWizard({
  open,
  onClose,
  onSaved,
  influencer,
  existing,
}: Props) {
  const [step, setStep] = useState(0);

  const [description, setDescription] = useState("");
  const [valueProps, setValueProps] = useState<Pair[]>([]);
  const [products, setProducts] = useState<Pair[]>([]);
  const [audience, setAudience] = useState<Pair[]>([]);
  const [styleGuidelines, setStyleGuidelines] = useState<Pair[]>([]);
  const [links, setLinks] = useState<Pair[]>([]);

  const [suggesting, setSuggesting] = useState<AiField | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setDescription(existing?.description || "");
    setValueProps(toPairs(existing?.value_props));
    setProducts(toPairs(existing?.products));
    setAudience(toPairs(existing?.audience));
    setStyleGuidelines(toPairs(existing?.style_guidelines));
    setLinks(toPairs(existing?.links));
  }, [open, existing]);

  async function suggest(field: AiField) {
    setSuggesting(field);
    try {
      const { suggestion } = await api.suggestBrandKitField(influencer.id, field);
      if (field === "description" && typeof suggestion === "string") {
        setDescription(suggestion);
      } else if (typeof suggestion === "object" && suggestion !== null) {
        const pairs = toPairs(suggestion as Record<string, string>);
        if (field === "value_props") setValueProps(pairs);
        else if (field === "products") setProducts(pairs);
        else if (field === "audience") setAudience(pairs);
        else if (field === "style_guidelines") setStyleGuidelines(pairs);
      }
      toast.success("Sugestão aplicada — edite à vontade");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Falha ao gerar sugestão";
      toast.error(msg);
    } finally {
      setSuggesting(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const kit = await api.upsertBrandKit(influencer.id, {
        description: description.trim(),
        value_props: fromPairs(valueProps),
        products: fromPairs(products),
        audience: fromPairs(audience),
        style_guidelines: fromPairs(styleGuidelines),
        links: fromPairs(links),
      });
      onSaved(kit);
      onClose();
      toast.success("Brand Kit criado!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erro ao salvar brand kit";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  const totalSteps = STEP_TITLES.length;
  const isLast = step === totalSteps - 1;
  const isFirst = step === 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{STEP_TITLES[step]}</span>
            <span className="text-xs font-normal text-muted-foreground">
              Passo {step + 1} de {totalSteps}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {step === 0 && (
            <div className="space-y-3 text-sm">
              <p>
                Vamos criar o Brand Kit de <strong>{influencer.name}</strong>{" "}
                em 7 passos curtos.
              </p>
              <p className="text-muted-foreground">
                Em cada passo, você pode escrever manualmente ou clicar em{" "}
                <strong>Sugerir com IA</strong> para gerar uma proposta inicial
                que você pode editar.
              </p>
              <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
                <div>
                  <span className="font-medium">Nicho:</span>{" "}
                  {influencer.niche || "(não informado)"}
                </div>
                <div>
                  <span className="font-medium">Tom de voz:</span>{" "}
                  {influencer.tone || "(não informado)"}
                </div>
                <div>
                  <span className="font-medium">Idioma:</span>{" "}
                  {influencer.language}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Você pode pular qualquer passo e editar depois.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Em 2 ou 3 frases, descreva o que a marca faz e para quem.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Ex: Escritório de engenharia especializado em cálculo estrutural para construtoras de médio porte..."
              />
              <SuggestButton
                onClick={() => suggest("description")}
                loading={suggesting === "description"}
              />
            </div>
          )}

          {step === 2 && (
            <WizardListStep
              help="O que torna esta marca única? Liste 3-5 diferenciais."
              keyPlaceholder="diferencial"
              valuePlaceholder="cálculo estrutural especializado"
              value={valueProps}
              onChange={setValueProps}
              inputClass={inputClass}
              onSuggest={() => suggest("value_props")}
              suggesting={suggesting === "value_props"}
            />
          )}

          {step === 3 && (
            <WizardListStep
              help="Produtos ou serviços principais que a marca oferece."
              keyPlaceholder="laudo_estrutural"
              valuePlaceholder="análise técnica completa"
              value={products}
              onChange={setProducts}
              inputClass={inputClass}
              onSuggest={() => suggest("products")}
              suggesting={suggesting === "products"}
            />
          )}

          {step === 4 && (
            <WizardListStep
              help="Quem é o público desta marca? Perfil, idade, interesses, dores."
              keyPlaceholder="perfil"
              valuePlaceholder="engenheiros e construtoras"
              value={audience}
              onChange={setAudience}
              inputClass={inputClass}
              onSuggest={() => suggest("audience")}
              suggesting={suggesting === "audience"}
            />
          )}

          {step === 5 && (
            <WizardListStep
              help="Tom de voz, palavras-chave, palavras a evitar, uso de emojis."
              keyPlaceholder="tom_voz"
              valuePlaceholder="técnico e direto"
              value={styleGuidelines}
              onChange={setStyleGuidelines}
              inputClass={inputClass}
              onSuggest={() => suggest("style_guidelines")}
              suggesting={suggesting === "style_guidelines"}
            />
          )}

          {step === 6 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Site, redes sociais, materiais de referência. Sem IA aqui — só
                cole as URLs.
              </p>
              <KeyValueListField
                keyPlaceholder="site"
                valuePlaceholder="https://exemplo.com.br"
                value={links}
                onChange={setLinks}
                inputClass={inputClass}
              />
            </div>
          )}

          {step === 7 && (
            <ReviewStep
              description={description}
              valueProps={valueProps}
              products={products}
              audience={audience}
              styleGuidelines={styleGuidelines}
              links={links}
              onJumpTo={setStep}
            />
          )}
        </div>

        <div className="flex justify-between gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            onClick={() => (isFirst ? onClose() : setStep(step - 1))}
          >
            {isFirst ? "Cancelar" : "Voltar"}
          </Button>
          {isLast ? (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Brand Kit"}
            </Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>
              {step === 0 ? "Começar" : "Próximo"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SuggestButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Gerando..." : "Sugerir com IA"}
    </Button>
  );
}

function WizardListStep({
  help,
  keyPlaceholder,
  valuePlaceholder,
  value,
  onChange,
  inputClass,
  onSuggest,
  suggesting,
}: {
  help: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  value: Pair[];
  onChange: (v: Pair[]) => void;
  inputClass: string;
  onSuggest: () => void;
  suggesting: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{help}</p>
      <KeyValueListField
        keyPlaceholder={keyPlaceholder}
        valuePlaceholder={valuePlaceholder}
        value={value}
        onChange={onChange}
        inputClass={inputClass}
      />
      <SuggestButton onClick={onSuggest} loading={suggesting} />
    </div>
  );
}

function ReviewStep({
  description,
  valueProps,
  products,
  audience,
  styleGuidelines,
  links,
  onJumpTo,
}: {
  description: string;
  valueProps: Pair[];
  products: Pair[];
  audience: Pair[];
  styleGuidelines: Pair[];
  links: Pair[];
  onJumpTo: (step: number) => void;
}) {
  const sections: { title: string; pairs: Pair[]; step: number; isText?: false }[] = [
    { title: "Proposta de valor", pairs: valueProps, step: 2 },
    { title: "Produtos", pairs: products, step: 3 },
    { title: "Público-alvo", pairs: audience, step: 4 },
    { title: "Estilo", pairs: styleGuidelines, step: 5 },
    { title: "Links", pairs: links, step: 6 },
  ];

  return (
    <div className="space-y-4 text-sm">
      <p className="text-muted-foreground">
        Revise tudo antes de salvar. Clique em qualquer seção para voltar e
        editar.
      </p>

      <button
        type="button"
        onClick={() => onJumpTo(1)}
        className="block w-full text-left rounded-md border p-3 hover:bg-muted/30 transition"
      >
        <div className="text-xs font-medium text-muted-foreground mb-1">
          Descrição
        </div>
        <div>
          {description || (
            <span className="text-muted-foreground italic">(vazio)</span>
          )}
        </div>
      </button>

      {sections.map((section) => (
        <button
          key={section.title}
          type="button"
          onClick={() => onJumpTo(section.step)}
          className="block w-full text-left rounded-md border p-3 hover:bg-muted/30 transition"
        >
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {section.title}
          </div>
          {section.pairs.length === 0 ? (
            <div className="text-muted-foreground italic">(vazio)</div>
          ) : (
            <ul className="space-y-0.5">
              {section.pairs.map((p, i) => (
                <li key={i} className="text-xs">
                  <span className="font-medium">{p.key}:</span> {p.value}
                </li>
              ))}
            </ul>
          )}
        </button>
      ))}
    </div>
  );
}
