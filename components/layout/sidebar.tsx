"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, LayoutTemplate, CalendarDays, Users, Megaphone, UserPlus, ClipboardList, DollarSign, Share2, Settings, Building2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/contexts/workspace-context";
import { useAuth } from "@/contexts/auth-context";

const SOLO_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/conteudos", label: "Conteúdos", icon: FileText },
  { href: "/minha-marca", label: "Minha Marca", icon: Users },
  { href: "/billing", label: "Faturamento", icon: DollarSign },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const AGENCY_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/conteudos", label: "Conteúdos", icon: FileText },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/influenciadores", label: "Influenciadores", icon: Users },
  { href: "/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/leads", label: "Leads", icon: UserPlus },
  { href: "/historico", label: "Histórico", icon: ClipboardList },
  { href: "/billing", label: "Faturamento", icon: DollarSign },
  { href: "/integracoes", label: "Integrações", icon: Share2 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const GROUP_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/grupo", label: "Grupo", icon: Building2 },
  { href: "/conteudos", label: "Conteúdos", icon: FileText },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/influenciadores", label: "Influenciadores", icon: Users },
  { href: "/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/leads", label: "Leads", icon: UserPlus },
  { href: "/historico", label: "Histórico", icon: ClipboardList },
  { href: "/billing", label: "Faturamento", icon: DollarSign },
  { href: "/integracoes", label: "Integrações", icon: Share2 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isSolo, isGroup } = useWorkspace();
  const { user } = useAuth();
  const navItems = isSolo ? SOLO_NAV_ITEMS : isGroup ? GROUP_NAV_ITEMS : AGENCY_NAV_ITEMS;

  return (
    <>
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">
              BB
            </span>
          </div>
          <span className="font-semibold text-foreground">Brand Brain</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        {user?.is_superadmin && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mt-2 border-t pt-3",
              pathname.startsWith("/admin")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        )}
      </nav>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r bg-card h-screen sticky top-0 flex flex-col">
      <SidebarContent />
    </aside>
  );
}
