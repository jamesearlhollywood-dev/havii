import type { UserRole } from "./types";
import { PUBLIC_SIGNUP_ROLES, STAFF_ROLES } from "./types";

export function isPublicSignupRole(role: string): role is UserRole {
  return (PUBLIC_SIGNUP_ROLES as string[]).includes(role);
}

export function isStaffOrAdmin(role: UserRole | string | null | undefined): boolean {
  if (!role) return false;
  return (STAFF_ROLES as string[]).includes(role);
}

export function isAdministrator(role: UserRole | string | null | undefined): boolean {
  return role === "administrator";
}

export function displayRoleName(role: UserRole | string): string {
  const map: Record<string, string> = {
    youth: "Youth",
    mentor: "Mentor",
    caregiver: "Caregiver",
    staff: "Staff",
    administrator: "Administrator",
    community_partner: "Community Partner",
  };
  return map[role] ?? role;
}

export function dashboardPathForRole(_role?: UserRole): string {
  void _role;
  return "/dashboard";
}

export function canAccessAdminRoutes(role: UserRole | string | null | undefined): boolean {
  return role === "administrator";
}

export function canAccessStaffRoutes(role: UserRole | string | null | undefined): boolean {
  return isStaffOrAdmin(role);
}
