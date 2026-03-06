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

export function CreateCampaignDialog({
  open,
  onClose,
  onCreated,
  costCenterId,
}: Props) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("leads");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setObjective("leads");
    setStartDate("");
    setEndDate("");
    setError("");
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await api.createCampaign({
        cost_center_id: costCenterId,
        name: name.trim(),
        objective,
        start_date: startDate || null,
        end_date: endDate || null,
      });
      reset();
      onCreated();
      onClose();
      toast.success("Campanha criada com sucesso");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erro ao criar campanha";
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
          <DialogTitle>Nova Campanha</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nome da campanha"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Objetivo</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className={inputClass}
            >
              <option value="leads">Leads</option>
              <option value="awareness">Reconhecimento</option>
              <option value="traffic">Trafego</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            <Button
              onClick={handleSubmit}
              disabled={saving || !name.trim()}
            >
              {saving ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
