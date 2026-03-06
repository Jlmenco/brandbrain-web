import type { ContentStatus } from "./types";

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Rascunho",
  review: "Em Revisao",
  approved: "Aprovado",
  scheduled: "Agendado",
  publishing: "Publicando",
  posted: "Publicado",
  failed: "Falhou",
  rejected: "Rejeitado",
};

export const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  review: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  scheduled: "bg-purple-100 text-purple-800",
  publishing: "bg-indigo-100 text-indigo-800",
  posted: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  rejected: "bg-red-50 text-red-600",
};

export const PROVIDER_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  twitter: "Twitter",
  tiktok: "TikTok",
};

export const ACTION_LABELS: Record<string, string> = {
  create: "Criou",
  update: "Editou",
  submit_review: "Enviou para revisao",
  approve: "Aprovou",
  request_changes: "Solicitou alteracoes",
  reject: "Rejeitou",
  schedule: "Agendou",
  publish_now: "Publicou",
};

export const TARGET_TYPE_LABELS: Record<string, string> = {
  content_item: "Conteudo",
  influencer: "Influenciador",
  brand_kit: "Brand Kit",
  campaign: "Campanha",
  lead: "Lead",
};

export const OBJECTIVE_LABELS: Record<string, string> = {
  leads: "Leads",
  awareness: "Reconhecimento",
  traffic: "Trafego",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "Novo",
  qualified: "Qualificado",
  won: "Ganho",
  lost: "Perdido",
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  qualified: "bg-yellow-100 text-yellow-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-700",
};

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  form: "Formulario",
  whatsapp: "WhatsApp",
  dm: "DM",
  manual: "Manual",
};

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/conteudos", label: "Conteudos", icon: "FileText" as const },
  {
    href: "/influenciadores",
    label: "Influenciadores",
    icon: "Users" as const,
  },
  { href: "/campanhas", label: "Campanhas", icon: "Megaphone" as const },
  { href: "/leads", label: "Leads", icon: "UserPlus" as const },
  { href: "/historico", label: "Historico", icon: "ClipboardList" as const },
];
