"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { api } from "@/lib/api-client";
import type { ContentItem } from "@/lib/types";
import { useWorkspace } from "@/contexts/workspace-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_COLORS, STATUS_LABELS, PROVIDER_LABELS } from "@/lib/constants";
import { useRouter } from "next/navigation";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function CalendarioPage() {
  const { selectedCostCenter } = useWorkspace();
  const router = useRouter();
  const [today] = useState(new Date());
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const year = current.getFullYear();
  const month = current.getMonth();

  // Primeiro e último dia do mês visível
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

  // Indexar itens por data
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

  // Construir grid do mês
  const startDow = firstDay.getDay(); // 0=Dom
  const totalDays = lastDay.getDate();
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() { setCurrent(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurrent(new Date(year, month + 1, 1)); }

  function dateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const todayKey = isoDate(today);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendário Editorial</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualize conteúdos agendados e publicados por data
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          {/* Cabeçalho de dias */}
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-24 rounded-md bg-muted/30" />;
              }
              const key = dateKey(day);
              const dayItems = byDate[key] || [];
              const isToday = key === todayKey;

              return (
                <div
                  key={key}
                  className={`min-h-24 rounded-md border p-1.5 flex flex-col gap-1 ${
                    isToday ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span className={`text-xs font-semibold self-end ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    {day}
                  </span>
                  {dayItems.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => router.push(`/conteudos/${item.id}`)}
                      className="text-left w-full"
                    >
                      <div className={`rounded px-1 py-0.5 text-xs truncate ${STATUS_COLORS[item.status]}`}>
                        {PROVIDER_LABELS[item.provider_target] || item.provider_target}: {item.text.slice(0, 25)}…
                      </div>
                    </button>
                  ))}
                  {dayItems.length > 3 && (
                    <span className="text-xs text-muted-foreground px-1">
                      +{dayItems.length - 3} mais
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-3 pt-2">
            {(["draft","review","approved","scheduled","posted","failed"] as const).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <Badge variant="outline" className={`text-xs ${STATUS_COLORS[s]}`}>
                  {STATUS_LABELS[s]}
                </Badge>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
