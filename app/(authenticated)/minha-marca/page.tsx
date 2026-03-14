"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { Influencer, BrandKit } from "@/lib/types";
import { useWorkspace } from "@/contexts/workspace-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandKitView } from "@/components/influencer/brand-kit-view";
import { EditBrandKitDialog } from "@/components/influencer/edit-brand-kit-dialog";
import { AvatarGenerator } from "@/components/influencer/avatar-generator";
import { VoiceSelector } from "@/components/influencer/voice-selector";

export default function MinhaMarcaPage() {
  const { selectedOrg } = useWorkspace();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBrandKitDialog, setShowBrandKitDialog] = useState(false);

  useEffect(() => {
    if (!selectedOrg) return;
    api
      .listInfluencers(selectedOrg.id)
      .then((list) => {
        const master = list.find((i) => i.type === "master") ?? list[0] ?? null;
        setInfluencer(master);
        if (master) {
          api.getBrandKit(master.id).then(setBrandKit).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedOrg]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Minha Marca</h1>
        <p className="text-muted-foreground">
          Nenhuma marca configurada. Complete o onboarding para configurar sua marca.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{influencer.name}</h1>
          <p className="text-sm text-muted-foreground">{influencer.niche}</p>
        </div>
        <Badge variant="outline" className="bg-amber-100 text-amber-800">
          Minha Marca
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar */}
        <AvatarGenerator
          influencerId={influencer.id}
          influencerName={influencer.name}
        />

        {/* Voice */}
        <VoiceSelector
          influencerId={influencer.id}
          currentVoiceId={influencer.voice_id}
          onSaved={(voiceId) =>
            setInfluencer((prev) => prev ? { ...prev, voice_id: voiceId } : prev)
          }
        />

        {/* Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Perfil da Marca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Nicho" value={influencer.niche} />
            <Separator />
            <InfoRow label="Tom de Voz" value={influencer.tone || "--"} />
            <Separator />
            <InfoRow label="Nivel de Emoji" value={influencer.emoji_level || "--"} />
            <Separator />
            <InfoRow label="Idioma" value={influencer.language} />
          </CardContent>
        </Card>

        {/* Brand Kit */}
        {brandKit ? (
          <div className="space-y-2 lg:col-span-3">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBrandKitDialog(true)}
              >
                Editar Identidade da Marca
              </Button>
            </div>
            <BrandKitView kit={brandKit} />
          </div>
        ) : (
          <Card className="lg:col-span-3">
            <CardContent className="pt-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Nenhuma identidade de marca configurada ainda.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBrandKitDialog(true)}
              >
                Configurar Identidade da Marca
              </Button>
            </CardContent>
          </Card>
        )}

        <EditBrandKitDialog
          open={showBrandKitDialog}
          onClose={() => setShowBrandKitDialog(false)}
          onUpdated={(kit) => setBrandKit(kit)}
          influencerId={influencer.id}
          existing={brandKit}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
