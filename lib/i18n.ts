// Sistema de internacionalizacao (i18n) leve, sem dependencias externas.
// Locales suportados: pt-BR (primario), en-US, es.

export type Locale = "pt-BR" | "en-US" | "es";

const LOCALE_STORAGE_KEY = "bb_locale";
const DEFAULT_LOCALE: Locale = "pt-BR";

// ---------------------------------------------------------------------------
// Dicionarios de traducao
// ---------------------------------------------------------------------------

type TranslationDict = Record<string, string>;

const ptBR: TranslationDict = {
  // Navigation
  "nav.dashboard": "Dashboard",
  "nav.conteudos": "Conteudos",
  "nav.influenciadores": "Influenciadores",
  "nav.campanhas": "Campanhas",
  "nav.leads": "Leads",
  "nav.historico": "Historico",
  "nav.configuracoes": "Configuracoes",

  // Common actions
  "action.save": "Salvar",
  "action.cancel": "Cancelar",
  "action.delete": "Excluir",
  "action.edit": "Editar",
  "action.create": "Criar",
  "action.export": "Exportar",
  "action.search": "Buscar",
  "action.back": "Voltar",
  "action.next": "Proximo",
  "action.previous": "Anterior",
  "action.confirm": "Confirmar",

  // Content workflow
  "content.draft": "Rascunho",
  "content.review": "Em revisao",
  "content.approved": "Aprovado",
  "content.scheduled": "Agendado",
  "content.posted": "Publicado",
  "content.failed": "Falhou",
  "content.rejected": "Rejeitado",

  // Common labels
  "label.name": "Nome",
  "label.email": "Email",
  "label.phone": "Telefone",
  "label.status": "Status",
  "label.date": "Data",
  "label.actions": "Acoes",
  "label.loading": "Carregando...",

  // Messages
  "msg.no_items": "Nenhum item encontrado",
  "msg.confirm_delete": "Tem certeza que deseja excluir?",
  "msg.saved": "Salvo com sucesso",
  "msg.error": "Ocorreu um erro. Tente novamente.",
};

const enUS: TranslationDict = {
  // Navigation
  "nav.dashboard": "Dashboard",
  "nav.conteudos": "Content",
  "nav.influenciadores": "Influencers",
  "nav.campanhas": "Campaigns",
  "nav.leads": "Leads",
  "nav.historico": "History",
  "nav.configuracoes": "Settings",

  // Common actions
  "action.save": "Save",
  "action.cancel": "Cancel",
  "action.delete": "Delete",
  "action.edit": "Edit",
  "action.create": "Create",
  "action.export": "Export",
  "action.search": "Search",
  "action.back": "Back",
  "action.next": "Next",
  "action.previous": "Previous",
  "action.confirm": "Confirm",

  // Content workflow
  "content.draft": "Draft",
  "content.review": "In review",
  "content.approved": "Approved",
  "content.scheduled": "Scheduled",
  "content.posted": "Posted",
  "content.failed": "Failed",
  "content.rejected": "Rejected",

  // Common labels
  "label.name": "Name",
  "label.email": "Email",
  "label.phone": "Phone",
  "label.status": "Status",
  "label.date": "Date",
  "label.actions": "Actions",
  "label.loading": "Loading...",

  // Messages
  "msg.no_items": "No items found",
  "msg.confirm_delete": "Are you sure you want to delete?",
  "msg.saved": "Saved successfully",
  "msg.error": "An error occurred. Please try again.",
};

const es: TranslationDict = {
  // Navigation
  "nav.dashboard": "Panel",
  "nav.conteudos": "Contenidos",
  "nav.influenciadores": "Influenciadores",
  "nav.campanhas": "Campanas",
  "nav.leads": "Leads",
  "nav.historico": "Historial",
  "nav.configuracoes": "Configuracion",

  // Common actions
  "action.save": "Guardar",
  "action.cancel": "Cancelar",
  "action.delete": "Eliminar",
  "action.edit": "Editar",
  "action.create": "Crear",
  "action.export": "Exportar",
  "action.search": "Buscar",
  "action.back": "Volver",
  "action.next": "Siguiente",
  "action.previous": "Anterior",
  "action.confirm": "Confirmar",

  // Content workflow
  "content.draft": "Borrador",
  "content.review": "En revision",
  "content.approved": "Aprobado",
  "content.scheduled": "Programado",
  "content.posted": "Publicado",
  "content.failed": "Fallido",
  "content.rejected": "Rechazado",

  // Common labels
  "label.name": "Nombre",
  "label.email": "Correo",
  "label.phone": "Telefono",
  "label.status": "Estado",
  "label.date": "Fecha",
  "label.actions": "Acciones",
  "label.loading": "Cargando...",

  // Messages
  "msg.no_items": "No se encontraron elementos",
  "msg.confirm_delete": "Esta seguro de que desea eliminar?",
  "msg.saved": "Guardado con exito",
  "msg.error": "Ocurrio un error. Intentelo de nuevo.",
};

// ---------------------------------------------------------------------------
// Mapa de dicionarios por locale
// ---------------------------------------------------------------------------

const dictionaries: Record<Locale, TranslationDict> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  es: es,
};

// ---------------------------------------------------------------------------
// Funcoes publicas
// ---------------------------------------------------------------------------

/**
 * Le o locale salvo no localStorage. Se nao houver ou for invalido,
 * retorna o locale padrao (pt-BR).
 */
export function getLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && stored in dictionaries) {
    return stored as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Salva o locale escolhido no localStorage.
 */
export function setLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

/**
 * Retorna a traducao para a chave informada usando o locale atual.
 * Fallback: pt-BR -> chave crua.
 */
export function t(key: string): string {
  const locale = getLocale();
  const dict = dictionaries[locale];

  // Tenta o locale atual
  if (dict && key in dict) return dict[key];

  // Fallback para pt-BR
  if (locale !== DEFAULT_LOCALE && key in ptBR) return ptBR[key];

  // Ultimo recurso: retorna a propria chave
  return key;
}

/**
 * Retorna a traducao para a chave usando um locale especifico
 * (util dentro do contexto reativo).
 */
export function tWithLocale(key: string, locale: Locale): string {
  const dict = dictionaries[locale];

  if (dict && key in dict) return dict[key];
  if (locale !== DEFAULT_LOCALE && key in ptBR) return ptBR[key];

  return key;
}

/**
 * Retorna a lista de locales disponiveis com seus nomes de exibicao.
 */
export function getAvailableLocales(): { code: Locale; label: string }[] {
  return [
    { code: "pt-BR", label: "Portugues" },
    { code: "en-US", label: "English" },
    { code: "es", label: "Espanol" },
  ];
}
