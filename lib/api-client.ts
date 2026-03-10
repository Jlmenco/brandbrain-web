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
  login: (email: string, password: string) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request<User>("/auth/me"),

  // Organizations
  listOrgs: () => request<Organization[]>("/orgs"),

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
};
