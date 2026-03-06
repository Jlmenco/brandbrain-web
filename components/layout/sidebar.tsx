"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Megaphone, UserPlus, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/conteudos", label: "Conteudos", icon: FileText },
  { href: "/influenciadores", label: "Influenciadores", icon: Users },
  { href: "/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/leads", label: "Leads", icon: UserPlus },
  { href: "/historico", label: "Historico", icon: ClipboardList },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

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
        {NAV_ITEMS.map((item) => {
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
