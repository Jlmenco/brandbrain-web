"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InviteMemberDialog({ open, onClose }: Props) {
  const { selectedOrg } = useWorkspace();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrg) return;
    setLoading(true);
    try {
      await api.inviteMember(selectedOrg.id, email, role);
      toast.success(`Convite enviado para ${email}`);
      setEmail("");
      setRole("editor");
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar convite");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convidar membro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email do convidado</label>
            <Input
              type="email"
              placeholder="colaborador@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador — gerencia tudo exceto billing</SelectItem>
                <SelectItem value="editor">Editor — cria e edita conteúdo</SelectItem>
                <SelectItem value="viewer">Visualizador — somente leitura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? "Enviando..." : "Enviar convite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
