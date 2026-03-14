import type { OrgRole } from "./types";

export type Permission =
  | "content:create"
  | "content:edit_draft"
  | "content:submit_review"
  | "content:approve"
  | "content:reject"
  | "content:request_changes"
  | "content:schedule"
  | "content:publish"
  | "influencer:create"
  | "influencer:edit"
  | "brandkit:edit"
  | "campaign:create"
  | "campaign:edit"
  | "lead:create"
  | "lead:edit"
  | "org:manage";

const ALL_PERMISSIONS: Permission[] = [
  "content:create",
  "content:edit_draft",
  "content:submit_review",
  "content:approve",
  "content:reject",
  "content:request_changes",
  "content:schedule",
  "content:publish",
  "influencer:create",
  "influencer:edit",
  "brandkit:edit",
  "campaign:create",
  "campaign:edit",
  "lead:create",
  "lead:edit",
  "org:manage",
];

const EDITOR_PERMISSIONS: Permission[] = [
  "content:create",
  "content:edit_draft",
  "content:submit_review",
  "lead:create",
  "lead:edit",
];

const ROLE_PERMISSIONS: Record<OrgRole, Set<Permission>> = {
  owner: new Set(ALL_PERMISSIONS),
  admin: new Set(ALL_PERMISSIONS),
  editor: new Set(EDITOR_PERMISSIONS),
  viewer: new Set(),
};

export function hasPermission(
  role: OrgRole | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}
