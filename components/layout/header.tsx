"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { BrandSelector } from "./brand-selector";
import { NotificationBell } from "./notification-bell";
import { LogOut, Menu, Sun, Moon } from "lucide-react";
import { CommandPaletteTrigger } from "@/components/ui/command-palette";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("bb_theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground transition-colors"
      title={dark ? "Modo claro" : "Modo escuro"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <BrandSelector />
      </div>

      <div className="flex items-center gap-4">
        <CommandPaletteTrigger />
        <ThemeToggle />
        <NotificationBell />
        <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
        <button
          onClick={logout}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
