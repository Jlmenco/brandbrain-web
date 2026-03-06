"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import type { AuditLog } from "@/lib/types";
import { ACTION_LABELS, TARGET_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 30;

export default function HistoricoPage() {
  const { selectedOrg, loading: wsLoading } = useWorkspace();
  const router = useRouter();
  const [items, setItems] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState("all");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedOrg) return;
    setLoading(true);
    api
      .listAuditLogs({
        org_id: selectedOrg.id,
        action: action === "all" ? undefined : action,
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      })
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedOrg, action, page]);

  useEffect(() => {
    setPage(0);
  }, [action]);

  if (wsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-36" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedOrg) {
    return (
      <p className="text-muted-foreground">
        Selecione uma organizacao no menu superior.
      </p>
    );
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showFrom = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const showTo = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historico</h1>
        <p className="text-sm text-muted-foreground">
          {total} acoes registradas
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Acao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as acoes</SelectItem>
            {Object.entries(ACTION_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhuma acao encontrada.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Data/Hora</TableHead>
              <TableHead>Acao</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={
                  item.target_type === "content_item"
                    ? "cursor-pointer"
                    : ""
                }
                onClick={() => {
                  if (item.target_type === "content_item") {
                    router.push(`/conteudos/${item.target_id}`);
                  }
                }}
              >
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item.created_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {ACTION_LABELS[item.action] || item.action}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {TARGET_TYPE_LABELS[item.target_type] || item.target_type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {item.metadata_json?.notes
                      ? String(item.metadata_json.notes)
                      : item.metadata_json?.scheduled_at
                        ? `Para ${formatDate(String(item.metadata_json.scheduled_at))}`
                        : "—"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {showFrom}-{showTo} de {total} acoes
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Proximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
