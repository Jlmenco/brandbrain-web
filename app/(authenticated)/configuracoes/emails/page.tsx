"use client";

import { useCallback, useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Gate } from "@/components/ui/gate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Mail, Plus, Power, Trash2 } from "lucide-react";
import Link from "next/link";

interface DripStep {
  id?: string;
  step_order: number;
  delay_hours: number;
  subject: string;
  body_template: string;
}

interface DripCampaign {
  id: string;
  org_id: string | null;
  name: string;
  trigger_event: string;
  is_active: boolean;
  created_at: string;
  steps: DripStep[];
}

const TRIGGER_LABELS: Record<string, string> = {
  welcome: "Boas-vindas",
  trial_expiring: "Trial expirando",
  inactive: "Inatividade",
  custom: "Personalizado",
};

export default function DripEmailsPage() {
  const { selectedOrg } = useWorkspace();
  const [campaigns, setCampaigns] = useState<DripCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<DripCampaign | null>(null);

  const fetchCampaigns = useCallback(() => {
    if (!selectedOrg) return;
    setLoading(true);
    api
      .listDripCampaigns(selectedOrg.id)
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedOrg]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const toggleActive = async (campaign: DripCampaign) => {
    try {
      await api.updateDripCampaign(campaign.id, { is_active: !campaign.is_active });
      fetchCampaigns();
    } catch {}
  };

  const deactivate = async (id: string) => {
    try {
      await api.deactivateDripCampaign(id);
      fetchCampaigns();
    } catch {}
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/configuracoes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Campanhas de Email</h1>
            <p className="text-sm text-muted-foreground">
              Sequencias automaticas de email para engajamento
            </p>
          </div>
        </div>
        <Gate permission="org:manage">
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </Gate>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhuma campanha criada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crie campanhas de drip email para engajar seus usuarios automaticamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{c.name}</CardTitle>
                    <Badge variant={c.is_active ? "default" : "secondary"}>
                      {c.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                    <Badge variant="outline">
                      {TRIGGER_LABELS[c.trigger_event] || c.trigger_event}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(c)}
                      title={c.is_active ? "Desativar" : "Ativar"}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCampaign(c)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deactivate(c.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {c.steps.length} step(s) | Criada em{" "}
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {c.steps
                    .sort((a, b) => a.step_order - b.step_order)
                    .map((s, i) => (
                      <div
                        key={s.id || i}
                        className="text-xs bg-muted px-3 py-1.5 rounded-md"
                      >
                        Step {i + 1}: {s.subject || "(sem assunto)"} —{" "}
                        {s.delay_hours}h delay
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CampaignDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSaved={fetchCampaigns}
        orgId={selectedOrg?.id}
      />

      {editingCampaign && (
        <CampaignDialog
          open={true}
          onClose={() => setEditingCampaign(null)}
          onSaved={fetchCampaigns}
          orgId={selectedOrg?.id}
          campaign={editingCampaign}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Campaign Create/Edit Dialog
// ---------------------------------------------------------------------------

function CampaignDialog({
  open,
  onClose,
  onSaved,
  orgId,
  campaign,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  orgId?: string;
  campaign?: DripCampaign;
}) {
  const [name, setName] = useState(campaign?.name || "");
  const [trigger, setTrigger] = useState(campaign?.trigger_event || "welcome");
  const [steps, setSteps] = useState<DripStep[]>(
    campaign?.steps.length
      ? campaign.steps.sort((a, b) => a.step_order - b.step_order)
      : [{ step_order: 0, delay_hours: 0, subject: "", body_template: "" }]
  );
  const [saving, setSaving] = useState(false);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        step_order: steps.length,
        delay_hours: 24,
        subject: "",
        body_template: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_order: i })));
  };

  const updateStep = (index: number, field: keyof DripStep, value: string | number) => {
    setSteps(steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const stepsPayload = steps.map((s, i) => ({
        step_order: i,
        delay_hours: s.delay_hours,
        subject: s.subject,
        body_template: s.body_template,
      }));

      if (campaign) {
        await api.updateDripCampaign(campaign.id, {
          name,
          trigger_event: trigger,
          steps: stepsPayload,
        });
      } else {
        await api.createDripCampaign({
          name,
          trigger_event: trigger,
          org_id: orgId,
          steps: stepsPayload,
        });
      }
      onSaved();
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{campaign ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
          <DialogDescription>
            Configure a sequencia de emails que sera enviada automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Boas-vindas"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Gatilho</label>
              <Select value={trigger} onValueChange={setTrigger}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Boas-vindas</SelectItem>
                  <SelectItem value="trial_expiring">Trial expirando</SelectItem>
                  <SelectItem value="inactive">Inatividade</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Steps</label>
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-3 w-3 mr-1" />
                Adicionar Step
              </Button>
            </div>

            {steps.map((step, i) => (
              <Card key={i}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Step {i + 1}
                    </span>
                    {steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(i)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs text-muted-foreground">Assunto</label>
                      <Input
                        value={step.subject}
                        onChange={(e) => updateStep(i, "subject", e.target.value)}
                        placeholder="Assunto do email"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Delay (horas)</label>
                      <Input
                        type="number"
                        min={0}
                        value={step.delay_hours}
                        onChange={(e) =>
                          updateStep(i, "delay_hours", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Corpo do email (HTML)
                    </label>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm resize-y"
                      value={step.body_template}
                      onChange={(e) => updateStep(i, "body_template", e.target.value)}
                      placeholder="<p>Ola, {name}!</p>"
                    />
                    <p className="text-xs text-muted-foreground">
                      Variaveis: {"{name}"}, {"{org_name}"}, {"{email}"}, {"{upgrade_url}"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? "Salvando..." : campaign ? "Salvar" : "Criar Campanha"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
