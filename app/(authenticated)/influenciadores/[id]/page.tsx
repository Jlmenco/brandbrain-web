"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Influencer, BrandKit } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BrandKitView } from "@/components/influencer/brand-kit-view";
import { EditBrandKitDialog } from "@/components/influencer/edit-brand-kit-dialog";
import { AvatarGenerator } from "@/components/influencer/avatar-generator";
import { VoiceSelector } from "@/components/influencer/voice-selector";
import { Gate } from "@/components/ui/gate";
import { Skeleton } from "@/components/ui/skeleton";

export default function InfluencerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [error, setError] = useState("");
  const [showBrandKitDialog, setShowBrandKitDialog] = useState(false);

  useEffect(() => {
    api
      .getInfluencer(id)
      .then(setInfluencer)
      .catch((err: Error) => setError(err.message));

    api.getBrandKit(id).then(setBrandKit).catch(() => {});
  }, [id]);

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!influencer) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/influenciadores"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{influencer.name}</h1>
          <p className="text-sm text-muted-foreground">{influencer.niche}</p>
        </div>
        <Badge
          variant="outline"
          className={
            influencer.type === "master"
              ? "bg-amber-100 text-amber-800"
              : "bg-blue-100 text-blue-800"
          }
        >
          {influencer.type === "master" ? "Master" : "Marca"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Gate permission="brandkit:edit">
          <AvatarGenerator
            influencerId={influencer.id}
            influencerName={influencer.name}
          />
        </Gate>

        <Gate permission="brandkit:edit">
          <VoiceSelector
            influencerId={influencer.id}
            currentVoiceId={influencer.voice_id}
            onSaved={(voiceId) =>
              setInfluencer((prev) => prev ? { ...prev, voice_id: voiceId } : prev)
            }
          />
        </Gate>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Tom de Voz" value={influencer.tone} />
            <Separator />
            <InfoRow label="Nível de Emoji" value={influencer.emoji_level} />
            <Separator />
            <InfoRow label="CTA" value={influencer.cta_style || "--"} />
            <Separator />
            <InfoRow label="Idioma" value={influencer.language} />
            <Separator />
            <InfoRow
              label="Status"
              value={influencer.is_active ? "Ativo" : "Inativo"}
            />

            {influencer.forbidden_topics.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Tópicos Proibidos
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {influencer.forbidden_topics.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="bg-red-50 text-red-600"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {influencer.forbidden_words.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Palavras Proibidas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {influencer.forbidden_words.map((w) => (
                      <Badge
                        key={w}
                        variant="outline"
                        className="bg-red-50 text-red-600"
                      >
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {influencer.allowed_words.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Palavras Permitidas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {influencer.allowed_words.map((w) => (
                      <Badge
                        key={w}
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700"
                      >
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {brandKit ? (
          <div className="space-y-2">
            <Gate permission="brandkit:edit">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBrandKitDialog(true)}
                >
                  Editar Brand Kit
                </Button>
              </div>
            </Gate>
            <BrandKitView kit={brandKit} />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Nenhum Brand Kit configurado.
              </p>
              <Gate permission="brandkit:edit">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBrandKitDialog(true)}
                >
                  Criar Brand Kit
                </Button>
              </Gate>
            </CardContent>
          </Card>
        )}

        <Gate permission="brandkit:edit">
          <EditBrandKitDialog
            open={showBrandKitDialog}
            onClose={() => setShowBrandKitDialog(false)}
            onUpdated={(kit) => setBrandKit(kit)}
            influencerId={id}
            existing={brandKit}
          />
        </Gate>
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
