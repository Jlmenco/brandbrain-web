"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useWorkspace } from "@/contexts/workspace-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Moon, Monitor, User, Lock, Settings, Info, Globe } from "lucide-react";
import { WebhookSettings } from "@/components/settings/webhook-settings";
import {
  type Locale,
  getLocale,
  setLocale as persistLocale,
  getAvailableLocales,
} from "@/lib/i18n";

// Mapa de labels para roles
const ROLE_LABELS: Record<string, string> = {
  owner: "Proprietário",
  admin: "Administrador",
  editor: "Editor",
  viewer: "Visualizador",
};

type ThemeOption = "light" | "dark" | "system";

export default function ConfiguracoesPage() {
  const { user, loading: authLoading } = useAuth();
  const { selectedOrg, currentRole, loading: wsLoading } = useWorkspace();

  // --- Alterar Senha ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // --- Tema ---
  const [theme, setTheme] = useState<ThemeOption>("system");

  // --- Idioma ---
  const [locale, setLocaleState] = useState<Locale>("pt-BR");
  const availableLocales = getAvailableLocales();

  // --- API Status ---
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">(
    "loading"
  );

  // Inicializa o tema a partir do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bb_theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      setTheme("system");
    }
  }, []);

  // Inicializa o idioma a partir do localStorage
  useEffect(() => {
    setLocaleState(getLocale());
  }, []);

  // Aplica o idioma selecionado
  const applyLocale = useCallback((newLocale: Locale) => {
    persistLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  // Verifica o status da API
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const res = await fetch(`${base}/health`);
        setApiStatus(res.ok ? "online" : "offline");
      } catch {
        setApiStatus("offline");
      }
    };
    checkHealth();
  }, []);

  // Aplica o tema selecionado
  const applyTheme = useCallback((option: ThemeOption) => {
    setTheme(option);

    if (option === "system") {
      localStorage.removeItem("bb_theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      localStorage.setItem("bb_theme", option);
      document.documentElement.classList.toggle("dark", option === "dark");
    }
  }, []);

  // Validacao de senha client-side
  const validatePasswords = useCallback(() => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Preencha todos os campos");
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return false;
    }
    setPasswordError("");
    return true;
  }, [currentPassword, newPassword, confirmPassword]);

  // Limpa o erro ao digitar
  useEffect(() => {
    if (passwordError) {
      setPasswordError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPassword, newPassword, confirmPassword]);

  if (authLoading || wsLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seu perfil e preferências
        </p>
      </div>

      {/* ===== Perfil ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Perfil</CardTitle>
          </div>
          <CardDescription>Informações da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Nome
              </label>
              <Input value={user?.name || ""} disabled readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input value={user?.email || ""} disabled readOnly />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Organização
              </label>
              <Input value={selectedOrg?.name || "--"} disabled readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Função
              </label>
              <Input
                value={
                  currentRole ? ROLE_LABELS[currentRole] || currentRole : "--"
                }
                disabled
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Alterar Senha ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Alterar Senha</CardTitle>
          </div>
          <CardDescription>
            Atualize sua senha de acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Senha atual
            </label>
            <Input
              type="password"
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Nova senha
              </label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Confirmar nova senha
              </label>
              <Input
                type="password"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-destructive">{passwordError}</p>
          )}

          <div className="flex items-center gap-3">
            <Button
              disabled
              title="Em breve"
              onClick={() => {
                if (validatePasswords()) {
                  // API nao suporta alteracao de senha ainda
                }
              }}
            >
              Salvar senha
            </Button>
            <span className="text-xs text-muted-foreground">Em breve</span>
          </div>
        </CardContent>
      </Card>

      {/* ===== Preferencias ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Preferências</CardTitle>
          </div>
          <CardDescription>Personalize sua experiência</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tema */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Tema</p>
              <p className="text-sm text-muted-foreground">
                Escolha entre claro e escuro
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => applyTheme("light")}
              >
                <Sun className="h-4 w-4 mr-2" />
                Claro
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => applyTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-2" />
                Escuro
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => applyTheme("system")}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Sistema
              </Button>
            </div>
          </div>

          <Separator />

          {/* Idioma */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Idioma</p>
              <p className="text-sm text-muted-foreground">
                Selecione o idioma da interface
              </p>
            </div>
            <div className="flex gap-2">
              {availableLocales.map((loc) => (
                <Button
                  key={loc.code}
                  variant={locale === loc.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyLocale(loc.code)}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {loc.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notificacoes */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Notificações</p>
              <p className="text-sm text-muted-foreground">Em breve</p>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  disabled
                  className="rounded border-input"
                />
                Email
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  disabled
                  className="rounded border-input"
                />
                Push
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  disabled
                  className="rounded border-input"
                />
                In-App
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Integracoes (Webhooks) ===== */}
      <WebhookSettings />

      {/* ===== Informacoes do Sistema ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Informações do Sistema</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Versão</span>
              <span className="font-mono">v0.1.0-mvp</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ambiente</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_APP_ENV || "local"}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status da API</span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    apiStatus === "online"
                      ? "bg-green-500"
                      : apiStatus === "offline"
                        ? "bg-red-500"
                        : "bg-yellow-500 animate-pulse"
                  }`}
                />
                <span className="text-sm">
                  {apiStatus === "online"
                    ? "Online"
                    : apiStatus === "offline"
                      ? "Offline"
                      : "Verificando..."}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
