"use client";

import { useWorkspace } from "@/contexts/workspace-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BrandSelector() {
  const { costCenters, selectedCostCenter, selectCostCenter } = useWorkspace();

  if (costCenters.length === 0) return null;

  return (
    <Select
      value={selectedCostCenter?.id || ""}
      onValueChange={(val) => {
        const cc = costCenters.find((c) => c.id === val);
        if (cc) selectCostCenter(cc);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecionar marca" />
      </SelectTrigger>
      <SelectContent>
        {costCenters.map((cc) => (
          <SelectItem key={cc.id} value={cc.id}>
            {cc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
