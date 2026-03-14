"use client";

import { useEffect, useState } from "react";
import { Link2, Link2Off, Trash2, CheckCircle2, AlertCircle, Wifi } from "lucide-react";
import { api } from "@/lib/api-client";
import { useWorkspace } from "@/contexts/workspace-context";
import type { SocialAccount } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gate } from "@/components/ui/gate";
import { toast } from "sonner";

const PROVIDERS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Publicar posts no perfil ou página da empresa",
    color: "bg-blue-100 text-blue-800",
    icon: "in",
  },
  {
    id: "meta",
    label: "Meta (Facebook + Instagram)",
    description: "Publicar no Facebook Pages e Instagram Business",
    color: "bg-indigo-100 text-indigo-800",
    icon: "fb",
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "Publicar vídeos e fotos no TikTok",
    color: "bg-neutral-100 text-neutral-800",
    icon: "tt",
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Fazer upload de vídeos no canal",
    color: "bg-red-100 text-red-800",
    icon: "yt",
  },
];

export default function IntegracoesPage() {
  const { selectedOrg, selectedCostCenter: selectedCC } = useWorkspace();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);

  function fetchAccounts() {
    if (!selectedCC) return;
    setLoading(true);
    api.listSocialAccounts(selectedCC.id)
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchAccounts(); }, [selectedCC]);

  // Check if connected on page load (after OAuth redirect)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("social_connected");
    const error = params.get("social_error");
    if (connected) {
      toast.success(`${connected} conectado com sucesso!`);
      window.history.replaceState({}, "", window.location.pathname);
      fetchAccounts();
    }
    if (error) {
      toast.error(`Erro ao conectar: ${error}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  function getAccount(providerId: string) {
    return accounts.find((a) => a.provider === providerId && a.status === "connected");
  }

  async function handleDisconnect(account: SocialAccount) {
    try {
      await api.disconnectSocialAccount(account.id);
      setAccounts((prev) => prev.map((a) => a.id === account.id ? { ...a, status: "revoked" } : a));
      toast.success("Conta desconectada");
    } catch {
      toast.error("Erro ao desconectar conta");
    }
  }

  async function handleDelete(account: SocialAccount) {
    try {
      await api.deleteSocialAccount(account.id);
      setAccounts((prev) => prev.filter((a) => a.id !== account.id));
      toast.success("Conta removida");
    } catch {
      toast.error("Erro ao remover conta");
    }
  }

  function handleConnect(providerId: string) {
    if (!selectedCC || !selectedOrg) {
      toast.error("Selecione um centro de custo primeiro");
      return;
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
    window.location.href = `${base}/integrations/${providerId}/connect?cc_id=${selectedCC.id}&org_id=${selectedOrg.id}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Conecte contas de redes sociais para publicação automática
        </p>
      </div>

      {!selectedCC && (
        <p className="text-muted-foreground text-sm">Selecione um centro de custo no menu superior.</p>
      )}

      {selectedCC && (
        <Gate permission="org:manage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading
              ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)
              : PROVIDERS.map((provider) => {
                  const account = getAccount(provider.id);
                  const isConnected = !!account;

                  return (
                    <Card key={provider.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-md flex items-center justify-center text-xs font-bold ${provider.color}`}>
                              {provider.icon.toUpperCase()}
                            </div>
                            <div>
                              <CardTitle className="text-sm">{provider.label}</CardTitle>
                              <CardDescription className="text-xs mt-0.5">
                                {provider.description}
                              </CardDescription>
                            </div>
                          </div>
                          {isConnected ? (
                            <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Conectado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Não conectado
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isConnected && account ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Wifi className="h-3 w-3 text-emerald-500" />
                              <span>{account.account_name || "Conta conectada"}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-7 text-xs"
                                onClick={() => handleConnect(provider.id)}
                              >
                                <Link2 className="h-3 w-3 mr-1" />
                                Reconectar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-muted-foreground"
                                onClick={() => handleDisconnect(account)}
                              >
                                <Link2Off className="h-3 w-3 mr-1" />
                                Desconectar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground"
                                onClick={() => handleDelete(account)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full h-8 text-xs"
                            onClick={() => handleConnect(provider.id)}
                          >
                            <Link2 className="h-3 w-3 mr-1" />
                            Conectar {provider.label}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
          </div>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Modo de Publicação</CardTitle>
              <CardDescription className="text-xs">
                Configure <code className="text-xs bg-muted px-1 rounded">SOCIAL_PUBLISH_MODE=real</code> no Worker
                para publicar nas redes sociais reais. Por padrão é <code className="text-xs bg-muted px-1 rounded">mock</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-3 text-xs font-mono text-muted-foreground space-y-1">
                <p># .env ou compose.yml:</p>
                <p>SOCIAL_PUBLISH_MODE=real</p>
                <p>JWT_SECRET_KEY=&lt;mesma chave da API&gt;</p>
              </div>
            </CardContent>
          </Card>
        </Gate>
      )}
    </div>
  );
}
