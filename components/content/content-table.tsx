"use client";

import { useRouter } from "next/navigation";
import type { ContentItem, Influencer } from "@/lib/types";
import { STATUS_LABELS, STATUS_COLORS, PROVIDER_LABELS } from "@/lib/constants";
import { EmptyState } from "@/components/ui/empty-state";
import { truncate, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContentTableProps {
  items: ContentItem[];
  influencers?: Influencer[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function ContentTable({ items, influencers = [], selectedIds = [], onSelectionChange }: ContentTableProps) {
  const router = useRouter();
  const allSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  function toggleAll() {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : items.map((i) => i.id));
  }

  function toggleItem(id: string, e: React.MouseEvent) {
    if (!onSelectionChange) return;
    e.stopPropagation();
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="Nenhum conteúdo encontrado"
        description="Crie seu primeiro conteúdo para começar."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectionChange && (
              <TableHead className="w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
              </TableHead>
            )}
            <TableHead className="w-[35%]">Texto</TableHead>
            <TableHead>Influenciador</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Agendado</TableHead>
            <TableHead>Versão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <TableRow
                key={item.id}
                className={`cursor-pointer ${isSelected ? "bg-primary/5" : ""}`}
                onClick={() => router.push(`/conteudos/${item.id}`)}
              >
                {onSelectionChange && (
                  <TableCell onClick={(e) => toggleItem(item.id, e)}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                    />
                  </TableCell>
                )}
                <TableCell className="max-w-[400px]">
                  <span className="text-sm">{truncate(item.text, 100)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {influencers.find((i) => i.id === item.influencer_id)?.name || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {PROVIDER_LABELS[item.provider_target] || item.provider_target}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_COLORS[item.status] || ""}>
                    {STATUS_LABELS[item.status] || item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item.scheduled_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">v{item.version}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
