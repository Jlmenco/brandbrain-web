import type { ContentStatus } from "./types";

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Rascunho",
  review: "Em Revisão",
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
  submit_review: "Enviou para revisão",
  approve: "Aprovou",
  request_changes: "Solicitou alterações",
  reject: "Rejeitou",
  schedule: "Agendou",
  publish_now: "Publicou",
};

export const TARGET_TYPE_LABELS: Record<string, string> = {
  content_item: "Conteúdo",
  influencer: "Influenciador",
  brand_kit: "Identidade de Marca",
  campaign: "Campanha",
  lead: "Lead",
};

export const OBJECTIVE_LABELS: Record<string, string> = {
  leads: "Captação de Leads",
  awareness: "Reconhecimento de Marca",
  traffic: "Tráfego",
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
  form: "Formulário",
  whatsapp: "WhatsApp",
  dm: "Mensagem Direta",
  manual: "Manual",
};

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/conteudos", label: "Conteúdos", icon: "FileText" as const },
  { href: "/templates", label: "Templates", icon: "LayoutTemplate" as const },
  { href: "/calendario", label: "Calendário", icon: "CalendarDays" as const },
  {
    href: "/influenciadores",
    label: "Influenciadores",
    icon: "Users" as const,
  },
  { href: "/campanhas", label: "Campanhas", icon: "Megaphone" as const },
  { href: "/leads", label: "Leads", icon: "UserPlus" as const },
  { href: "/historico", label: "Histórico", icon: "ClipboardList" as const },
  { href: "/billing", label: "Faturamento", icon: "DollarSign" as const },
  { href: "/integracoes", label: "Integrações", icon: "Share2" as const },
];
