"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import type { ContentItem } from "@/lib/types";
import { STATUS_LABELS, STATUS_COLORS, PROVIDER_LABELS } from "@/lib/constants";
import { truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentContent({ ccId }: { ccId: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    api
      .listContentItems({ cc_id: ccId, limit: 10 })
      .then((data) => setItems(data.items))
      .catch(() => {});
  }, [ccId]);

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum conteudo encontrado.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Texto</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Status</TableHead>
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
            <TableCell className="max-w-[300px]">
              <span className="text-sm">{truncate(item.text)}</span>
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
                v{item.version}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
