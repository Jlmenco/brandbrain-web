"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Users, Building2, Home, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin sidebar */}
      <div className="w-56 shrink-0 border-r bg-card p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">
          <Home className="h-4 w-4" /> Dashboard
        </Link>
        <Link href="/admin/orgs" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">
          <Building2 className="h-4 w-4" /> Organizações
        </Link>
        <Link href="/admin/users" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">
          <Users className="h-4 w-4" /> Usuarios
        </Link>
        <div className="mt-auto pt-4 border-t">
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3">
            ← Voltar ao produto
          </Link>
        </div>
      </div>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
