"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import type { AppNotification } from "@/lib/types";
import { timeAgo, truncate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationBell() {
  const { selectedOrg } = useWorkspace();
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUnread = useCallback(() => {
    if (!selectedOrg) return;
    api.getUnreadCount(selectedOrg.id).then((d) => setUnread(d.count)).catch(() => {});
  }, [selectedOrg]);

  const fetchItems = useCallback(() => {
    if (!selectedOrg) return;
    api
      .listNotifications({ org_id: selectedOrg.id, limit: 10 })
      .then((d) => setItems(d.items))
      .catch(() => {});
  }, [selectedOrg]);

  // Poll unread count every 30s
  useEffect(() => {
    fetchUnread();
    intervalRef.current = setInterval(fetchUnread, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchUnread]);

  // Fetch items when popover opens
  useEffect(() => {
    if (open) {
      fetchItems();
      fetchUnread();
    }
  }, [open, fetchItems, fetchUnread]);

  const handleClick = async (notif: AppNotification) => {
    if (!notif.is_read) {
      await api.markAsRead(notif.id).catch(() => {});
      setUnread((n) => Math.max(0, n - 1));
      setItems((prev) =>
        prev.map((i) => (i.id === notif.id ? { ...i, is_read: true } : i))
      );
    }
    setOpen(false);
    if (notif.target_type === "content_item") {
      router.push(`/conteudos/${notif.target_id}`);
    }
  };

  const handleMarkAll = async () => {
    if (!selectedOrg) return;
    await api.markAllAsRead(selectedOrg.id).catch(() => {});
    setUnread(0);
    setItems((prev) => prev.map((i) => ({ ...i, is_read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-semibold">Notificacoes</span>
          {unread > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-xs text-primary hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhuma notificacao.
            </p>
          ) : (
            items.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors ${
                  notif.is_read ? "" : "bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-2">
                  {!notif.is_read && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                  <div className={notif.is_read ? "pl-4" : ""}>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {truncate(notif.body, 60)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
