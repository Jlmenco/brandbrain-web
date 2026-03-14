"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface HealthStatus {
  api: "ok" | "error" | "loading";
  apiVersion?: string;
  apiLatency?: number;
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus>({ api: "loading" });
  const [checkedAt, setCheckedAt] = useState<string>("");

  useEffect(() => {
    checkHealth();
  }, []);

  async function checkHealth() {
    setStatus({ api: "loading" });
    const start = Date.now();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
      const res = await fetch(`${baseUrl}/health`, { cache: "no-store" });
      const latency = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        setStatus({ api: "ok", apiVersion: data.version, apiLatency: latency });
      } else {
        setStatus({ api: "error" });
      }
    } catch {
      setStatus({ api: "error" });
    }
    setCheckedAt(new Date().toLocaleString("pt-BR"));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <span className="text-lg font-bold text-violet-600">Brand Brain</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Status dos Serviços</h1>
          <button
            onClick={checkHealth}
            className="text-sm px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
          >
            Verificar novamente
          </button>
        </div>

        <div className="space-y-4">
          {/* API */}
          <div className="border rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">API Backend</p>
              <p className="text-sm text-muted-foreground">
                {status.apiVersion ? `v${status.apiVersion}` : "FastAPI"}
                {status.apiLatency != null && ` — ${status.apiLatency}ms`}
              </p>
            </div>
            <StatusIcon state={status.api} />
          </div>

          {/* Frontend */}
          <div className="border rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">Frontend Web</p>
              <p className="text-sm text-muted-foreground">Next.js 14</p>
            </div>
            <StatusIcon state="ok" />
          </div>
        </div>

        {checkedAt && (
          <p className="text-xs text-muted-foreground mt-6">
            Última verificação: {checkedAt}
          </p>
        )}
      </main>
    </div>
  );
}

function StatusIcon({ state }: { state: "ok" | "error" | "loading" }) {
  if (state === "loading") return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />;
  if (state === "ok") return <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle className="h-5 w-5" /><span className="text-sm font-medium">Operacional</span></div>;
  return <div className="flex items-center gap-1.5 text-red-500"><XCircle className="h-5 w-5" /><span className="text-sm font-medium">Indisponível</span></div>;
}
