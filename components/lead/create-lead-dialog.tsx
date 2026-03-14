"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  costCenterId: string;
}

export function CreateLeadDialog({
  open,
  onClose,
  onCreated,
  costCenterId,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("manual");
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setSource("manual");
    setScore(0);
    setError("");
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await api.createLead({
        cost_center_id: costCenterId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        source,
        score,
      });
      reset();
      onCreated();
      onClose();
      toast.success("Lead criado com sucesso");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erro ao criar lead";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nome do lead"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="11999001122"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fonte</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={inputClass}
              >
                <option value="manual">Manual</option>
                <option value="form">Formulário</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="dm">Mensagem Direta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Score</label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
              {saving ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
