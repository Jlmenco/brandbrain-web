"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building2, FileText, Users, Plus } from "lucide-react";

interface FilialSummary {
  org_id: string;
  name: string;
  total_content: number;
  posted_content: number;
  total_leads: number;
}

interface GroupSummary {
  group_id: string;
  group_name: string;
  total_filiais: number;
  filiais: FilialSummary[];
}

export default function GrupoPage() {
  const { selectedOrg, can } = useWorkspace();
  const [summary, setSummary] = useState<GroupSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFilialName, setNewFilialName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  async function loadSummary() {
    if (!selectedOrg) return;
    try {
      const data = await api.groupSummary(selectedOrg.id);
      setSummary(data);
    } catch {
      // org may not be group type
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrg]);

  async function handleCreateFilial() {
    if (!selectedOrg || !newFilialName.trim()) return;
    setCreating(true);
    try {
      await api.createFilial(selectedOrg.id, { name: newFilialName.trim() });
      toast.success("Filial criada com sucesso");
      setNewFilialName("");
      setShowAdd(false);
      await loadSummary();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar filial");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Painel do Grupo</h1>
        <p className="text-muted-foreground">
          Esta página é exclusiva para organizações com perfil Grupo.
        </p>
      </div>
    );
  }

  const totalContent = summary.filiais.reduce((s, f) => s + f.total_content, 0);
  const totalPosted = summary.filiais.reduce((s, f) => s + f.posted_content, 0);
  const totalLeads = summary.filiais.reduce((s, f) => s + f.total_leads, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel do Grupo</h1>
          <p className="text-sm text-muted-foreground">{summary.group_name}</p>
        </div>
        {can("org:manage") && (
          <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova Filial
          </Button>
        )}
      </div>

      {/* Add filial inline form */}
      {showAdd && (
        <Card>
          <CardContent className="pt-5 flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">Nome da nova filial</label>
              <Input
                placeholder="Ex: Loja Sul, Unidade RJ"
                value={newFilialName}
                onChange={(e) => setNewFilialName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFilial()}
              />
            </div>
            <Button onClick={handleCreateFilial} disabled={!newFilialName.trim() || creating}>
              {creating ? "Criando..." : "Criar"}
            </Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancelar</Button>
          </CardContent>
        </Card>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Filiais</p>
              <p className="text-2xl font-bold">{summary.total_filiais}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <FileText className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-xs text-muted-foreground">Conteúdos Publicados</p>
              <p className="text-2xl font-bold">{totalPosted}</p>
              <p className="text-xs text-muted-foreground">de {totalContent} criados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Leads Totais</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filiais table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filiais</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.filiais.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma filial cadastrada.</p>
          ) : (
            <div className="divide-y">
              {summary.filiais.map((filial) => (
                <div key={filial.org_id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{filial.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <span className="font-medium text-foreground">{filial.posted_content}</span>/{filial.total_content} posts
                    </span>
                    <span>
                      <span className="font-medium text-foreground">{filial.total_leads}</span> leads
                    </span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                      Ativa
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
