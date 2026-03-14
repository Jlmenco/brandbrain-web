"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import type { ContentItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/workspace-context";

interface Props {
  item: ContentItem;
  onUpdate: (updated: ContentItem) => void;
}

export function ContentEditor({ item, onUpdate }: Props) {
  const { can } = useWorkspace();
  const [text, setText] = useState(item.text);
  const [saving, setSaving] = useState(false);
  const isEditable = item.status === "draft" && can("content:edit_draft");

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api.updateContentItem(item.id, { text });
      onUpdate(updated);
    } catch {
      // handled by api-client
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Texto do Conteúdo</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!isEditable}
        className="w-full min-h-[200px] p-3 border rounded-md text-sm resize-y bg-background disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Texto do conteúdo..."
      />
      {isEditable && (
        <Button
          onClick={handleSave}
          disabled={saving || text === item.text}
          size="sm"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      )}
    </div>
  );
}
