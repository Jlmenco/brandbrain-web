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

export function ContentTable({ items, influencers = [] }: { items: ContentItem[]; influencers?: Influencer[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="Nenhum conteudo encontrado"
        description="Crie seu primeiro conteudo para comecar."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[35%]">Texto</TableHead>
          <TableHead>Influenciador</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Agendado</TableHead>
          <TableHead>Versao</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id}
            className="cursor-pointer"
            onClick={() => router.push(`/conteudos/${item.id}`)}
          >
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
                {PROVIDER_LABELS[item.provider_target] ||
                  item.provider_target}
              </span>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={STATUS_COLORS[item.status] || ""}
              >
                {STATUS_LABELS[item.status] || item.status}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {formatDate(item.scheduled_at)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                v{item.version}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
