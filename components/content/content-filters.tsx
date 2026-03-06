"use client";

import { useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  status: string;
  provider: string;
  search: string;
  onStatusChange: (val: string) => void;
  onProviderChange: (val: string) => void;
  onSearchChange: (val: string) => void;
}

export function ContentFilters({
  status,
  provider,
  search,
  onStatusChange,
  onProviderChange,
  onSearchChange,
}: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (val: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearchChange(val), 300);
    },
    [onSearchChange]
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar conteudo..."
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 w-[220px]"
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="draft">Rascunho</SelectItem>
          <SelectItem value="review">Em Revisao</SelectItem>
          <SelectItem value="approved">Aprovado</SelectItem>
          <SelectItem value="scheduled">Agendado</SelectItem>
          <SelectItem value="publishing">Publicando</SelectItem>
          <SelectItem value="posted">Publicado</SelectItem>
          <SelectItem value="failed">Falhou</SelectItem>
          <SelectItem value="rejected">Rejeitado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={provider} onValueChange={onProviderChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Canal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os canais</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="twitter">Twitter</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
