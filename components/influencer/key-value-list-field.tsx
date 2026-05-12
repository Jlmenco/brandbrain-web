"use client";

import { Button } from "@/components/ui/button";

export type Pair = { key: string; value: string };

export function toPairs(value: Record<string, unknown> | null | undefined): Pair[] {
  if (!value) return [];
  return Object.entries(value).map(([k, v]) => ({
    key: k,
    value: typeof v === "string" ? v : JSON.stringify(v),
  }));
}

export function fromPairs(pairs: Pair[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const { key, value } of pairs) {
    const k = key.trim();
    if (!k) continue;
    result[k] = value;
  }
  return result;
}

const DEFAULT_INPUT_CLASS =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function KeyValueListField({
  label,
  help,
  keyPlaceholder,
  valuePlaceholder,
  value,
  onChange,
  inputClass = DEFAULT_INPUT_CLASS,
}: {
  label?: string;
  help?: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  value: Pair[];
  onChange: (v: Pair[]) => void;
  inputClass?: string;
}) {
  function update(i: number, patch: Partial<Pair>) {
    onChange(value.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, { key: "", value: "" }]);
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
      <div className="space-y-2">
        {value.map((pair, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={pair.key}
              onChange={(e) => update(i, { key: e.target.value })}
              placeholder={keyPlaceholder}
              className={`${inputClass} flex-1`}
            />
            <input
              type="text"
              value={pair.value}
              onChange={(e) => update(i, { value: e.target.value })}
              placeholder={valuePlaceholder}
              className={`${inputClass} flex-[2]`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              aria-label={`Remover ${label ?? "item"}`}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Adicionar
      </Button>
    </div>
  );
}
