"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";

function AceitarConviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [info, setInfo] = useState<{ org_name: string; email: string; role: string; inviter_name: string; expired: boolean } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleLabels: Record<string, string> = {
    owner: "Dono", admin: "Administrador", editor: "Editor", viewer: "Visualizador",
  };

  useEffect(() => {
    if (!token) { setLoadingInfo(false); return; }
    api.getInvite(token)
      .then((data) => {
        setInfo(data);
        api.checkUserExists(data.email).then((exists) => setIsNewUser(!exists)).catch(() => setIsNewUser(false));
      })
      .catch(() => setError("Convite nao encontrado ou invalido"))
      .finally(() => setLoadingInfo(false));
  }, [token]);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api.acceptInvite(token, isNewUser ? { name, password } : {});
      localStorage.setItem("bb_token", result.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao aceitar convite");
    } finally {
      setLoading(false);
    }
  }

  if (loadingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Carregando convite...</p>
      </div>
    );
  }

  if (error && !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="bg-card border rounded-lg p-8 max-w-sm w-full text-center space-y-4">
          <p className="text-destructive font-medium">{error}</p>
          <a href="/login" className="text-sm text-primary hover:underline">Ir para o login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-card rounded-lg border shadow-sm p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Brand Brain</h1>
            <p className="text-sm text-muted-foreground mt-1">Convite de membro</p>
          </div>

          {info && (
            <div className="bg-muted/40 rounded-lg p-4 text-sm space-y-1">
              <p><strong>{info.inviter_name}</strong> convidou voce para</p>
              <p className="text-base font-semibold">{info.org_name}</p>
              <p className="text-muted-foreground">Como: <strong>{roleLabels[info.role] ?? info.role}</strong></p>
            </div>
          )}

          {info?.expired ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-destructive">Este convite expirou ou ja foi utilizado.</p>
              <a href="/login" className="text-sm text-primary hover:underline">Ir para o login</a>
            </div>
          ) : (
            <form onSubmit={handleAccept} className="space-y-4">
              {isNewUser && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Seu nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Criar senha</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimo 6 caracteres"
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Aceitando..." : "Aceitar convite e entrar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AceitarConvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    }>
      <AceitarConviteContent />
    </Suspense>
  );
}
