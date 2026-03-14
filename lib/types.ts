// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  is_superadmin: boolean;
}

// Organization
export type OrgRole = "owner" | "admin" | "editor" | "viewer";
export type AccountType = "solo" | "agency" | "group";
export type PlanType = "trial" | "solo_monthly" | "agency_monthly" | "group_monthly" | "active";

export interface Organization {
  id: string;
  name: string;
  role: OrgRole | null;
  billing_alert_threshold: number | null;
  account_type: AccountType;
  parent_org_id: string | null;
  plan: PlanType;
  trial_ends_at: string | null; // ISO datetime string
}

// Cost Center
export interface CostCenter {
  id: string;
  org_id: string;
  name: string;
  code: string;
  monthly_budget_media: number;
  monthly_budget_ai: number;
}

// Content Item
export type ContentStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "publishing"
  | "posted"
  | "failed"
  | "rejected";

export interface ContentItem {
  id: string;
  cost_center_id: string;
  influencer_id: string;
  campaign_id: string | null;
  source_macro_id: string | null;
  provider_target: string;
  text: string;
  media_refs: unknown[];
  status: ContentStatus;
  scheduled_at: string | null;
  posted_at: string | null;
  provider_post_id: string | null;
  provider_post_url: string | null;
  version: number;
  retry_count: number;
  next_retry_at: string | null;
  last_error: string | null;
  video_job_status: "pending" | "processing" | "done" | "failed" | null;
  video_job_error: string | null;
}

export interface PaginatedContent {
  items: ContentItem[];
  total: number;
}

export interface ContentItemCreate {
  cost_center_id: string;
  influencer_id: string;
  campaign_id?: string;
  provider_target: string;
  text: string;
  media_refs?: unknown[];
}

export interface ContentItemUpdate {
  text?: string;
  media_refs?: unknown[];
  provider_target?: string;
}

export interface ScheduleRequest {
  scheduled_at: string;
}

// Influencer
export interface Influencer {
  id: string;
  org_id: string;
  cost_center_id: string | null;
  type: "master" | "brand";
  name: string;
  niche: string;
  tone: string;
  emoji_level: string;
  forbidden_topics: string[];
  forbidden_words: string[];
  allowed_words: string[];
  cta_style: string;
  language: string;
  voice_id: string | null;
  is_active: boolean;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  labels: Record<string, string>;
}

// Content Templates
export interface ContentTemplate {
  id: string;
  org_id: string;
  name: string;
  description: string;
  provider_target: string;
  text_template: string;
  tags: string[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentTemplateCreate {
  name: string;
  description?: string;
  provider_target?: string;
  text_template: string;
  tags?: string[];
}

export interface ContentTemplateUpdate {
  name?: string;
  description?: string;
  provider_target?: string;
  text_template?: string;
  tags?: string[];
  is_active?: boolean;
}

export interface SocialAccount {
  id: string;
  org_id: string;
  cost_center_id: string;
  provider: string;
  account_name: string;
  status: string;
}

export interface InfluencerCreate {
  name: string;
  type: "master" | "brand";
  niche: string;
  tone: string;
  emoji_level: string;
  language: string;
  cta_style?: string;
  cost_center_id?: string;
  voice_id?: string | null;
}

export interface BrandKit {
  id: string;
  influencer_id: string;
  description: string;
  value_props: Record<string, unknown>;
  products: Record<string, unknown>;
  audience: Record<string, unknown>;
  style_guidelines: Record<string, unknown>;
  links: Record<string, unknown>;
}

export interface BrandKitUpdate {
  description: string;
  value_props: Record<string, unknown>;
  products: Record<string, unknown>;
  audience: Record<string, unknown>;
  style_guidelines: Record<string, unknown>;
  links: Record<string, unknown>;
}

// Metrics
export interface MetricsOverview {
  total_impressions: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_clicks: number;
  total_followers_delta: number;
  total_posts: number;
}

export interface MetricsDaily {
  date: string;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  followers_delta: number;
}

// Audit Log
export interface AuditLog {
  id: string;
  org_id: string;
  cost_center_id: string | null;
  actor_user_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata_json: Record<string, unknown>;
  created_at: string;
}

export interface PaginatedAuditLogs {
  items: AuditLog[];
  total: number;
}

// Notification
export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  target_type: string;
  target_id: string;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedNotifications {
  items: AppNotification[];
  total: number;
}

// Campaign
export interface Campaign {
  id: string;
  cost_center_id: string;
  name: string;
  objective: string;
  start_date: string | null;
  end_date: string | null;
}

export interface CampaignCreate {
  cost_center_id: string;
  name: string;
  objective: string;
  start_date?: string | null;
  end_date?: string | null;
}

export interface CampaignUpdate {
  name?: string;
  objective?: string;
  start_date?: string | null;
  end_date?: string | null;
}

// Lead
export interface Lead {
  id: string;
  cost_center_id: string;
  source: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  status: string;
}

export interface LeadCreate {
  cost_center_id: string;
  source: string;
  name: string;
  email?: string;
  phone?: string;
  score?: number;
}

export interface LeadUpdate {
  name?: string;
  email?: string;
  phone?: string;
  score?: number;
  status?: string;
}
