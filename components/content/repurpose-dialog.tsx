"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";

const ALL_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "Twitter/X" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
];

interface RepurposeDialogProps {
  open: boolean;
  onClose: () => void;
  contentId: string;
  currentPlatform: string;
  onSuccess?: (created: Array<{ id: string; platform: string; preview: string }>) => void;
}

export function RepurposeDialog({
  open,
  onClose,
  contentId,
  currentPlatform,
  onSuccess,
}: RepurposeDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Array<{ id: string; platform: string; preview: string }> | null>(null);

  const availablePlatforms = ALL_PLATFORMS.filter((p) => p.id !== currentPlatform);

  const togglePlatform = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleRepurpose = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const resp = await api.repurposeContent(contentId, selected);
      setResult(resp.created);
      onSuccess?.(resp.created);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelected([]);
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adaptar para outras plataformas</DialogTitle>
          <DialogDescription>
            Selecione as plataformas para gerar versoes adaptadas automaticamente.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                {result.length} versao(oes) criada(s)!
              </span>
            </div>
            <div className="space-y-2">
              {result.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{item.platform}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.preview}
                  </p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Fechar</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selected.includes(p.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {selected.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selected.length} plataforma(s) selecionada(s). Cada adaptacao
                sera criada como rascunho para revisao.
              </p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleRepurpose}
                disabled={loading || selected.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  `Adaptar (${selected.length})`
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
