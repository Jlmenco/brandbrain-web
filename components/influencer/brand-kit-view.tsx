"use client";

import type { BrandKit } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function BrandKitView({ kit }: { kit: BrandKit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Brand Kit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {kit.description && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Descricao</p>
            <p className="text-sm">{kit.description}</p>
          </div>
        )}

        {Object.keys(kit.value_props).length > 0 && (
          <>
            <Separator />
            <DictSection
              title="Proposta de Valor"
              data={kit.value_props}
            />
          </>
        )}

        {Object.keys(kit.products).length > 0 && (
          <>
            <Separator />
            <DictSection title="Produtos" data={kit.products} />
          </>
        )}

        {Object.keys(kit.audience).length > 0 && (
          <>
            <Separator />
            <DictSection title="Publico-alvo" data={kit.audience} />
          </>
        )}

        {Object.keys(kit.style_guidelines).length > 0 && (
          <>
            <Separator />
            <DictSection
              title="Diretrizes de Estilo"
              data={kit.style_guidelines}
            />
          </>
        )}

        {Object.keys(kit.links).length > 0 && (
          <>
            <Separator />
            <DictSection title="Links" data={kit.links} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function DictSection({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown>;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="text-sm font-medium min-w-[100px]">{key}:</span>
            <span className="text-sm text-muted-foreground">
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
