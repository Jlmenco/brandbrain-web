"use client";

import { Heart, MessageCircle, Share2, Send, ThumbsUp, Repeat2, BookmarkIcon, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PostPreviewProps {
  provider: string;
  text: string;
  influencerName: string;
  influencerNiche?: string;
  avatarUrl?: string;
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-10 w-10 rounded-full object-cover shrink-0"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
      {initials}
    </div>
  );
}

function LinkedInPreview({ text, influencerName, influencerNiche, avatarUrl }: Omit<PostPreviewProps, "provider">) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar name={influencerName} avatarUrl={avatarUrl} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{influencerName}</p>
            <p className="text-xs text-muted-foreground">{influencerNiche}</p>
            <p className="text-xs text-muted-foreground">agora</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{text}</p>
      </div>
      <div className="border-t px-4 py-2 flex items-center justify-between text-muted-foreground">
        <button className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors">
          <ThumbsUp className="h-4 w-4" /> Gostei
        </button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors">
          <MessageCircle className="h-4 w-4" /> Comentar
        </button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors">
          <Repeat2 className="h-4 w-4" /> Repost
        </button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors">
          <Send className="h-4 w-4" /> Enviar
        </button>
      </div>
    </div>
  );
}

function InstagramPreview({ text, influencerName, avatarUrl }: Omit<PostPreviewProps, "provider">) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm overflow-hidden">
      <div className="p-3 flex items-center gap-3">
        <Avatar name={influencerName} avatarUrl={avatarUrl} />
        <p className="font-semibold text-sm">{influencerName.toLowerCase().replace(/\s+/g, "")}</p>
        <MoreHorizontal className="h-5 w-5 text-muted-foreground ml-auto" />
      </div>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 aspect-square flex items-center justify-center p-6">
        <p className="text-sm text-center whitespace-pre-wrap leading-relaxed line-clamp-[12]">{text}</p>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="h-5 w-5" />
            <MessageCircle className="h-5 w-5" />
            <Send className="h-5 w-5" />
          </div>
          <BookmarkIcon className="h-5 w-5" />
        </div>
        <p className="text-sm">
          <span className="font-semibold">{influencerName.toLowerCase().replace(/\s+/g, "")}</span>{" "}
          <span className="line-clamp-2">{text}</span>
        </p>
      </div>
    </div>
  );
}

function FacebookPreview({ text, influencerName, influencerNiche, avatarUrl }: Omit<PostPreviewProps, "provider">) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar name={influencerName} avatarUrl={avatarUrl} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{influencerName}</p>
            <p className="text-xs text-muted-foreground">agora</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{text}</p>
      </div>
      <div className="border-t px-4 py-2 flex items-center justify-around text-muted-foreground">
        <button className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors">
          <ThumbsUp className="h-4 w-4" /> Curtir
        </button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors">
          <MessageCircle className="h-4 w-4" /> Comentar
        </button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors">
          <Share2 className="h-4 w-4" /> Compartilhar
        </button>
      </div>
    </div>
  );
}

function TikTokPreview({ text, influencerName, avatarUrl }: Omit<PostPreviewProps, "provider">) {
  return (
    <div className="bg-black text-white rounded-lg overflow-hidden" style={{ maxWidth: 280 }}>
      <div className="aspect-[9/16] bg-gradient-to-b from-zinc-800 to-zinc-900 relative flex items-end p-4">
        <div className="space-y-2 w-full">
          <p className="font-semibold text-sm">@{influencerName.toLowerCase().replace(/\s+/g, "")}</p>
          <p className="text-xs whitespace-pre-wrap leading-relaxed line-clamp-4">{text}</p>
        </div>
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Heart className="h-6 w-6" />
            <span className="text-[10px]">0</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MessageCircle className="h-6 w-6" />
            <span className="text-[10px]">0</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Share2 className="h-6 w-6" />
            <span className="text-[10px]">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function YouTubePreview({ text, influencerName, avatarUrl }: Omit<PostPreviewProps, "provider">) {
  const title = text.split("\n")[0]?.slice(0, 100) || "Video";
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-zinc-800 dark:to-zinc-700 aspect-video flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
        </div>
      </div>
      <div className="p-3 flex gap-3">
        <Avatar name={influencerName} avatarUrl={avatarUrl} />
        <div className="space-y-1 min-w-0">
          <p className="font-semibold text-sm line-clamp-2">{title}</p>
          <p className="text-xs text-muted-foreground">{influencerName}</p>
          <p className="text-xs text-muted-foreground">0 visualizacoes - agora</p>
        </div>
      </div>
    </div>
  );
}

export function PostPreview({ provider, text, influencerName, influencerNiche, avatarUrl }: PostPreviewProps) {
  const PROVIDER_DISPLAY: Record<string, string> = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Preview — {PROVIDER_DISPLAY[provider] || provider}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            Simulacao
          </span>
        </div>

        {provider === "linkedin" && (
          <LinkedInPreview text={text} influencerName={influencerName} influencerNiche={influencerNiche} avatarUrl={avatarUrl} />
        )}
        {provider === "instagram" && (
          <InstagramPreview text={text} influencerName={influencerName} influencerNiche={influencerNiche} avatarUrl={avatarUrl} />
        )}
        {provider === "facebook" && (
          <FacebookPreview text={text} influencerName={influencerName} influencerNiche={influencerNiche} avatarUrl={avatarUrl} />
        )}
        {provider === "tiktok" && (
          <TikTokPreview text={text} influencerName={influencerName} influencerNiche={influencerNiche} avatarUrl={avatarUrl} />
        )}
        {provider === "youtube" && (
          <YouTubePreview text={text} influencerName={influencerName} influencerNiche={influencerNiche} avatarUrl={avatarUrl} />
        )}
        {!["linkedin", "instagram", "facebook", "tiktok", "youtube"].includes(provider) && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={influencerName} avatarUrl={avatarUrl} />
              <div>
                <p className="font-semibold text-sm">{influencerName}</p>
                <p className="text-xs text-muted-foreground">agora</p>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{text}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
