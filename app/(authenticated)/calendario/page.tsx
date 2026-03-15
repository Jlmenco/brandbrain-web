"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Loader2, FileText } from "lucide-react";
import { api } from "@/lib/api-client";
import type { ContentItem } from "@/lib/types";
import { useWorkspace } from "@/contexts/workspace-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_COLORS, STATUS_LABELS, PROVIDER_LABELS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const PILLAR_COLORS: Record<string, string> = {
  "Educacao": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Prova Social": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Bastidores": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Oferta": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Comunidade": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

interface EditorialSlot {
  id: string;
  plan_id: string;
  date: string;
  time_slot: string;
  platform: string;
  pillar: string;
  theme: string;
  objective: string;
  content_item_id: string | null;
}

function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function CalendarioPage() {
  const { selectedCostCenter, selectedOrg } = useWorkspace();
  const router = useRouter();
  const [today] = useState(new Date());
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Editorial planning state
  const [editorialSlots, setEditorialSlots] = useState<EditorialSlot[]>([]);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [periodType, setPeriodType] = useState("week");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin", "instagram"]);
  const [generatingSlotId, setGeneratingSlotId] = useState<string | null>(null);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const fromDate = isoDate(firstDay);
  const toDate = isoDate(lastDay);

  useEffect(() => {
    if (!selectedCostCenter) return;
    setLoading(true);
    api.listContentItems({
      cc_id: selectedCostCenter.id,
      date_from: fromDate,
      date_to: toDate,
      limit: 200,
    })
      .then((d) => setItems(d.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [selectedCostCenter, fromDate, toDate]);

  // Load editorial plans for the visible month
  const loadEditorialSlots = useCallback(() => {
    if (!selectedOrg || !selectedCostCenter) return;
    api.listEditorialPlans(selectedOrg.id, selectedCostCenter.id)
      .then((plans) => {
        const allSlots = plans.flatMap((p) => p.slots);
        setEditorialSlots(allSlots);
      })
      .catch(() => setEditorialSlots([]));
  }, [selectedOrg, selectedCostCenter]);

  useEffect(() => {
    loadEditorialSlots();
  }, [loadEditorialSlots]);

  // Index items by date
  const byDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const item of items) {
      const date = item.scheduled_at?.split("T")[0] || item.posted_at?.split("T")[0];
      if (!date) continue;
      if (!map[date]) map[date] = [];
      map[date].push(item);
    }
    return map;
  }, [items]);

  // Index editorial slots by date
  const slotsByDate = useMemo(() => {
    const map: Record<string, EditorialSlot[]> = {};
    for (const slot of editorialSlots) {
      if (!map[slot.date]) map[slot.date] = [];
      map[slot.date].push(slot);
    }
    return map;
  }, [editorialSlots]);

  const startDow = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() { setCurrent(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurrent(new Date(year, month + 1, 1)); }

  function dateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const todayKey = isoDate(today);

  async function handleGenerate() {
    if (!selectedOrg || !selectedCostCenter) return;
    setGenerating(true);
    try {
      const plan = await api.generateEditorialPlan({
        org_id: selectedOrg.id,
        cc_id: selectedCostCenter.id,
        period_type: periodType,
        platforms: selectedPlatforms,
        objectives: ["awareness", "engagement"],
      });
      toast.success(`Plano editorial gerado com ${plan.slots.length} slots`);
      setShowGenerateDialog(false);
      loadEditorialSlots();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar plano");
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateContent(slotId: string) {
    setGeneratingSlotId(slotId);
    try {
      const result = await api.generateContentFromSlot(slotId);
      toast.success("Conteudo gerado como rascunho");
      loadEditorialSlots();
      // Reload content items
      if (selectedCostCenter) {
        const d = await api.listContentItems({
          cc_id: selectedCostCenter.id,
          date_from: fromDate,
          date_to: toDate,
          limit: 200,
        });
        setItems(d.items);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar conteudo");
    } finally {
      setGeneratingSlotId(null);
    }
  }

  function togglePlatform(p: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendario Editorial</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualize conteudos agendados, publicados e slots do plano editorial
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCostCenter && (
            <Button size="sm" onClick={() => setShowGenerateDialog(true)}>
              <Sparkles className="h-4 w-4 mr-1" />
              Gerar Plano Editorial
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold w-36 text-center">
            {MONTHS[month]} {year}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))}>
            Hoje
          </Button>
        </div>
      </div>

      {!selectedCostCenter ? (
        <p className="text-muted-foreground">Selecione uma marca no menu superior.</p>
      ) : loading ? (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-md" />
          ))}
        </div>
      ) : (
        <>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-28 rounded-md bg-muted/30" />;
              }
              const key = dateKey(day);
              const dayItems = byDate[key] || [];
              const daySlots = slotsByDate[key] || [];
              const isToday = key === todayKey;

              return (
                <div
                  key={key}
                  className={`min-h-28 rounded-md border p-1.5 flex flex-col gap-0.5 ${
                    isToday ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span className={`text-xs font-semibold self-end ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    {day}
                  </span>
                  {/* Content items */}
                  {dayItems.slice(0, 2).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => router.push(`/conteudos/${item.id}`)}
                      className="text-left w-full"
                    >
                      <div className={`rounded px-1 py-0.5 text-xs truncate ${STATUS_COLORS[item.status]}`}>
                        {PROVIDER_LABELS[item.provider_target] || item.provider_target}: {item.text.slice(0, 20)}
                      </div>
                    </button>
                  ))}
                  {/* Editorial slots (dashed border to differentiate) */}
                  {daySlots.filter((s) => !s.content_item_id).slice(0, 2).map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleGenerateContent(slot.id)}
                      disabled={generatingSlotId === slot.id}
                      className="text-left w-full"
                      title={`${slot.theme} — Clique para gerar conteudo`}
                    >
                      <div className={`rounded px-1 py-0.5 text-xs truncate border border-dashed border-muted-foreground/50 ${PILLAR_COLORS[slot.pillar] || "bg-muted"}`}>
                        {generatingSlotId === slot.id ? (
                          <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                        ) : (
                          <FileText className="h-3 w-3 inline mr-0.5" />
                        )}
                        {slot.theme.slice(0, 18)}
                      </div>
                    </button>
                  ))}
                  {(dayItems.length + daySlots.length) > 4 && (
                    <span className="text-xs text-muted-foreground px-1">
                      +{dayItems.length + daySlots.length - 4} mais
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-2">
            {(["draft","review","approved","scheduled","posted","failed"] as const).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <Badge variant="outline" className={`text-xs ${STATUS_COLORS[s]}`}>
                  {STATUS_LABELS[s]}
                </Badge>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-4">
              <div className="w-4 h-4 rounded border border-dashed border-muted-foreground/50 bg-muted" />
              <span className="text-xs text-muted-foreground">Slot editorial (IA)</span>
            </div>
          </div>
        </>
      )}

      {/* Generate Plan Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Plano Editorial com IA</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Periodo</label>
              <Select value={periodType} onValueChange={setPeriodType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semanal</SelectItem>
                  <SelectItem value="month">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Plataformas</label>
              <div className="flex flex-wrap gap-2">
                {["linkedin", "instagram", "facebook", "twitter", "tiktok", "youtube"].map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedPlatforms.includes(p)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {PROVIDER_LABELS[p] || p}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              A IA ira analisar o contexto da marca, conteudos recentes e metricas para sugerir
              um plano editorial otimizado para o periodo selecionado.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)} disabled={generating}>
              Cancelar
            </Button>
            <Button onClick={handleGenerate} disabled={generating || selectedPlatforms.length === 0}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Plano
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
