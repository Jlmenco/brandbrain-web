"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { AuditLog } from "@/lib/types";
import { ACTION_LABELS, TARGET_TYPE_LABELS } from "@/lib/constants";
import {
  PlusCircle,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Activity,
} from "lucide-react";

const ACTION_ICONS: Record<string, typeof Activity> = {
  create: PlusCircle,
  update: Edit,
  submit_review: Send,
  approve: CheckCircle,
  request_changes: Edit,
  reject: XCircle,
  schedule: Clock,
  publish_now: Zap,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min atras`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

interface Props {
  orgId: string;
  ccId: string;
}

export function RecentActivity({ orgId, ccId }: Props) {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api
      .listAuditLogs({ org_id: orgId, cc_id: ccId, limit: 5 })
      .then((data) => setLogs(data.items))
      .catch(() => {});
  }, [orgId, ccId]);

  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const Icon = ACTION_ICONS[log.action] || Activity;
        return (
          <div key={log.id} className="flex items-center gap-3">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                {ACTION_LABELS[log.action] || log.action}{" "}
                <span className="text-muted-foreground">
                  {TARGET_TYPE_LABELS[log.target_type] || log.target_type}
                </span>
              </p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {timeAgo(log.created_at)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
