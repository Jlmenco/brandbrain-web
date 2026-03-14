"use client";

import { useEffect, useState } from "react";
import { Plus, FileText, Pencil, Trash2, Copy } from "lucide-react";
import { api } from "@/lib/api-client";
import type { ContentTemplate } from "@/lib/types";
import { useWorkspace } from "@/contexts/workspace-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gate } from "@/components/ui/gate";
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

const PROVIDER_LABELS: Record<string, string> = {
  "": "Todos",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const PROVIDER_COLORS: Record<string, string> = {
  "": "bg-gray-100 text-gray-700",
  linkedin: "bg-blue-100 text-blue-800",
  instagram: "bg-pink-100 text-pink-800",
  facebook: "bg-indigo-100 text-indigo-800",
  tiktok: "bg-neutral-100 text-neutral-800",
  youtube: "bg-red-100 text-red-800",
};

export default function TemplatesPage() {
  const { selectedOrg } = useWorkspace();
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContentTemplate | null>(null);

  useEffect(() => {
    if (!selectedOrg) return;
    setLoading(true);
    api.listTemplates(selectedOrg.id)
      .then(setTemplates)
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, [selectedOrg]);

  function handleCopy(tpl: ContentTemplate) {
    navigator.clipboard.writeText(tpl.text_template);
    toast.success("Texto copiado!");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.deleteTemplate(deleteTarget.id);
      setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success("Template removido");
    } catch {
      toast.error("Erro ao remover template");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates de Conteúdo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Textos reutilizáveis com placeholders para gerar conteúdo rapidamente
          </p>
        </div>
        <Gate permission="content:create">
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </Gate>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum template criado</p>
          <p className="text-sm mt-1">Crie templates para reutilizar estruturas de texto</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold leading-tight">{tpl.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${PROVIDER_COLORS[tpl.provider_target] || PROVIDER_COLORS[""]}`}
                  >
                    {PROVIDER_LABELS[tpl.provider_target] || tpl.provider_target}
                  </Badge>
                </div>
                {tpl.description && (
                  <p className="text-xs text-muted-foreground mt-1">{tpl.description}</p>
                )}
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {tpl.text_template}
                  </p>
                </div>

                {tpl.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-1 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                    onClick={() => handleCopy(tpl)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                  <Gate permission="content:create">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground"
                      onClick={() => setDeleteTarget(tpl)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Gate>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedOrg && (
        <CreateTemplateDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={(tpl) => setTemplates((prev) => [tpl, ...prev])}
          orgId={selectedOrg.id}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remover Template"
        description={`Tem certeza que deseja remover "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
