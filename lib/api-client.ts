import type {
  TokenResponse,
  User,
  Organization,
  CostCenter,
  ContentItem,
  ContentItemCreate,
  ContentItemUpdate,
  PaginatedContent,
  PaginatedAuditLogs,
  PaginatedNotifications,
  Influencer,
  InfluencerCreate,
  BrandKit,
  BrandKitUpdate,
  MetricsOverview,
  MetricsDaily,
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  Lead,
  LeadCreate,
  LeadUpdate,
  ElevenLabsVoice,
  ContentTemplate,
  ContentTemplateCreate,
  ContentTemplateUpdate,
  SocialAccount,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    const detail =
      typeof body === "object" && body !== null && "detail" in body
        ? String((body as Record<string, unknown>).detail)
        : `Erro ${status}`;
    super(detail);
    this.status = status;
    this.body = body;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bb_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => ({ detail: "Sessao expirada" }));
    if (typeof window !== "undefined") {
      localStorage.removeItem("bb_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new ApiError(res.status, body);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params)
    .filter((e): e is [string, string | number] => e[1] !== undefined)
    .map(([k, v]) => [k, String(v)] as [string, string]);
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries).toString();
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; org_name: string }) =>
    request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (email: string, password: string) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request<User>("/auth/me"),

  // Organizations
  listOrgs: () => request<Organization[]>("/orgs"),
  updateOrg: (orgId: string, data: { billing_alert_threshold?: number | null; account_type?: string }) =>
    request<Organization>(`/orgs/${orgId}`, { method: "PATCH", body: JSON.stringify(data) }),
  activatePlan: (orgId: string, plan: string) =>
    request<Organization>(`/orgs/${orgId}/activate`, { method: "POST", body: JSON.stringify({ plan }) }),
  setupSolo: (orgId: string, data: { brand_name: string; niche: string }) =>
    request<Organization>(`/orgs/${orgId}/setup-solo`, { method: "POST", body: JSON.stringify(data) }),
  upgradeOrg: (orgId: string, targetType: string) =>
    request<Organization>(`/orgs/${orgId}/upgrade`, { method: "POST", body: JSON.stringify({ target_type: targetType }) }),
  createOrg: (data: { name: string; account_type: string }) =>
    request<Organization>("/orgs", { method: "POST", body: JSON.stringify(data) }),
  createFilial: (orgId: string, data: { name: string }) =>
    request<Organization>(`/orgs/${orgId}/filiais`, { method: "POST", body: JSON.stringify({ name: data.name, account_type: "agency" }) }),
  groupSummary: (orgId: string) =>
    request<{ group_id: string; group_name: string; total_filiais: number; filiais: { org_id: string; name: string; total_content: number; posted_content: number; total_leads: number }[] }>(`/orgs/${orgId}/group-summary`),

  // Cost Centers
  listCostCenters: (orgId: string) =>
    request<CostCenter[]>(`/cost-centers${qs({ org_id: orgId })}`),

  // Content Items
  listContentItems: (params: {
    cc_id?: string;
    status?: string;
    provider?: string;
    influencer_id?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }) => request<PaginatedContent>(`/content-items${qs(params)}`),

  getContentItem: (id: string) => request<ContentItem>(`/content-items/${id}`),

  createContentItem: (body: ContentItemCreate) =>
    request<ContentItem>("/content-items", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateContentItem: (id: string, body: ContentItemUpdate) =>
    request<ContentItem>(`/content-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  submitReview: (id: string) =>
    request(`/content-items/${id}/submit-review`, { method: "POST" }),

  approve: (id: string, notes?: string) =>
    request(`/content-items/${id}/approve${qs({ notes })}`, {
      method: "POST",
    }),

  requestChanges: (id: string, notes?: string) =>
    request(`/content-items/${id}/request-changes${qs({ notes })}`, {
      method: "POST",
    }),

  reject: (id: string, notes?: string) =>
    request(`/content-items/${id}/reject${qs({ notes })}`, {
      method: "POST",
    }),

  schedule: (id: string, scheduledAt: string) =>
    request(`/content-items/${id}/schedule`, {
      method: "POST",
      body: JSON.stringify({ scheduled_at: scheduledAt }),
    }),

  publishNow: (id: string) =>
    request(`/content-items/${id}/publish-now`, { method: "POST" }),

  // Influencers
  listInfluencers: (orgId: string) =>
    request<Influencer[]>(`/influencers${qs({ org_id: orgId })}`),

  getInfluencer: (id: string) => request<Influencer>(`/influencers/${id}`),

  createInfluencer: (orgId: string, body: InfluencerCreate) =>
    request<Influencer>(`/influencers${qs({ org_id: orgId })}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateInfluencer: (id: string, body: Partial<InfluencerCreate>) =>
    request<Influencer>(`/influencers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  getBrandKit: (id: string) =>
    request<BrandKit>(`/influencers/${id}/brand-kit`),

  upsertBrandKit: (influencerId: string, body: BrandKitUpdate) =>
    request<BrandKit>(`/influencers/${influencerId}/brand-kit`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  generateAvatar: (influencerId: string) =>
    request<{ url: string; filename: string; revised_prompt: string }>(
      `/influencers/${influencerId}/generate-avatar`,
      { method: "POST" }
    ),

  getAvatarUrl: (influencerId: string) =>
    `${API_BASE}/influencers/${influencerId}/avatar`,

  listVoices: () =>
    request<{ voices: ElevenLabsVoice[] }>(`/influencers/voices`),

  // Video generation
  generateVideo: (contentId: string) =>
    request<{ status: string; video_url: string; filename: string }>(
      `/content/${contentId}/generate-video`,
      { method: "POST" }
    ),

  getVideoUrl: (contentId: string) =>
    `${API_BASE}/content/${contentId}/video`,

  // Campaigns
  listCampaigns: (ccId: string) =>
    request<Campaign[]>(`/campaigns${qs({ cc_id: ccId })}`),

  createCampaign: (body: CampaignCreate) =>
    request<Campaign>("/campaigns", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateCampaign: (id: string, body: CampaignUpdate) =>
    request<Campaign>(`/campaigns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Leads
  listLeads: (ccId: string, status?: string) =>
    request<Lead[]>(`/leads${qs({ cc_id: ccId, status })}`),

  createLead: (body: LeadCreate) =>
    request<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateLead: (id: string, body: LeadUpdate) =>
    request<Lead>(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Metrics
  syncMetrics: (ccId: string) =>
    request<{ synced: number; errors: number; total: number }>(
      `/metrics/sync${qs({ cc_id: ccId })}`,
      { method: "POST" }
    ),

  getMetricsOverview: (ccId: string) =>
    request<MetricsOverview>(`/metrics/overview${qs({ cc_id: ccId })}`),

  getMetricsDaily: (ccId: string, fromDate: string, toDate: string) =>
    request<MetricsDaily[]>(`/metrics/daily${qs({ cc_id: ccId, from_date: fromDate, to_date: toDate })}`),

  // Audit Logs
  listAuditLogs: (params: {
    org_id: string;
    cc_id?: string;
    action?: string;
    target_type?: string;
    skip?: number;
    limit?: number;
  }) => request<PaginatedAuditLogs>(`/audit-logs${qs(params)}`),

  // Notifications
  listNotifications: (params: {
    org_id: string;
    unread_only?: boolean;
    skip?: number;
    limit?: number;
  }) => {
    const p: Record<string, string | number | undefined> = {
      org_id: params.org_id,
      skip: params.skip,
      limit: params.limit,
    };
    if (params.unread_only) p.unread_only = "true";
    return request<PaginatedNotifications>(`/notifications${qs(p)}`);
  },

  getUnreadCount: (orgId: string) =>
    request<{ count: number }>(`/notifications/unread-count${qs({ org_id: orgId })}`),

  markAsRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllAsRead: (orgId: string) =>
    request(`/notifications/read-all${qs({ org_id: orgId })}`, { method: "POST" }),

  // Webhooks
  listWebhooks: (orgId: string) =>
    request<Array<{ id: string; name: string; provider: string; url: string; events: string[]; is_active: boolean; created_at: string }>>(
      `/webhooks${qs({ org_id: orgId })}`
    ),

  createWebhook: (orgId: string, body: { name: string; provider: string; url: string; events: string[] }) =>
    request<{ id: string; name: string; provider: string; url: string; events: string[]; is_active: boolean; created_at: string }>(
      `/webhooks${qs({ org_id: orgId })}`,
      { method: "POST", body: JSON.stringify(body) }
    ),

  testWebhook: (id: string) =>
    request<{ status: string; message: string }>(`/webhooks/${id}/test`, { method: "POST" }),

  deleteWebhook: (id: string) =>
    request(`/webhooks/${id}`, { method: "DELETE" }),

  // Batch actions
  batchAction: (ids: string[], action: string, notes?: string) =>
    request<{ success: string[]; failed: Array<{ id: string; reason: string }> }>(
      "/content-items/batch-action",
      { method: "POST", body: JSON.stringify({ ids, action, notes }) }
    ),

  // Templates
  listTemplates: (orgId: string, provider?: string) =>
    request<ContentTemplate[]>(`/templates${qs({ org_id: orgId, provider })}`),

  createTemplate: (orgId: string, body: ContentTemplateCreate) =>
    request<ContentTemplate>(`/templates${qs({ org_id: orgId })}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateTemplate: (id: string, body: ContentTemplateUpdate) =>
    request<ContentTemplate>(`/templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteTemplate: (id: string) =>
    request(`/templates/${id}`, { method: "DELETE" }),

  // Auth extras
  forgotPassword: (email: string) =>
    request<{ detail: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, new_password: string) =>
    request<{ detail: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password }),
    }),

  // Invites
  getInvite: (token: string) =>
    request<{ org_name: string; email: string; role: string; inviter_name: string; expired: boolean }>(
      `/invite/${token}`
    ),

  checkUserExists: (email: string) =>
    request<{ exists: boolean }>(`/auth/check-email${qs({ email })}`),

  acceptInvite: (token: string, data: { name?: string; password?: string }) =>
    request<TokenResponse>(`/invite/${token}/accept`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  inviteMember: (orgId: string, email: string, role: string) =>
    request<{ detail: string }>(`/orgs/${orgId}/invite`, {
      method: "POST",
      body: JSON.stringify({ user_id: email, role }),
    }),

  // Admin
  adminListOrgs: (skip = 0, limit = 100) =>
    request<{ items: Array<{ id: string; name: string; account_type: string; plan: string; trial_ends_at: string | null; member_count: number; created_at: string }>; total: number }>(
      `/admin/orgs${qs({ skip, limit })}`
    ),

  adminListUsers: (skip = 0, limit = 100) =>
    request<{ items: Array<{ id: string; email: string; name: string; is_superadmin: boolean; created_at: string }>; total: number }>(
      `/admin/users${qs({ skip, limit })}`
    ),

  adminActivatePlan: (orgId: string, plan: string) =>
    request<{ detail: string }>(`/admin/orgs/${orgId}/activate`, {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),

  // Billing (Asaas)
  billingPlans: () =>
    request<{ id: string; label: string; value_brl: number }[]>("/billing/plans"),

  billingCheckout: (plan: string) =>
    request<{ url: string; plan: string; org_id: string }>(`/billing/checkout?plan=${plan}`, {
      method: "POST",
    }),

  getQuota: (orgId: string) =>
    request<Record<string, { used: number; limit: number | null }>>(`/usage/quota${qs({ org_id: orgId })}`),

  // Social Integrations
  listSocialAccounts: (ccId: string) =>
    request<SocialAccount[]>(`/integrations/accounts?cc_id=${ccId}`),

  disconnectSocialAccount: (accountId: string) =>
    request(`/integrations/accounts/${accountId}/disconnect`, { method: "POST" }),

  deleteSocialAccount: (accountId: string) =>
    request(`/integrations/accounts/${accountId}`, { method: "DELETE" }),
};
