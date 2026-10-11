import type { UserRole } from "./types";
import { PUBLIC_SIGNUP_ROLES, STAFF_ROLES } from "./types";

export function isPublicSignupRole(role: string): role is UserRole {
  return (PUBLIC_SIGNUP_ROLES as string[]).includes(role);
}

export function isStaffOrAdmin(role: UserRole | string | null | undefined): boolean {
  if (!role) return false;
  return role === "admin" || role === "instructor" || role === "org_manager";
}

export function isAdministrator(role: UserRole | string | null | undefined): boolean {
  return role === "admin";
}

export function isInstructor(role: UserRole | string | null | undefined): boolean {
  return role === "instructor";
}

export function isOrgManager(role: UserRole | string | null | undefined): boolean {
  return role === "org_manager";
}

export function displayRoleName(role: UserRole | string): string {
  const map: Record<string, string> = {
    student: "Student",
    instructor: "Instructor",
    org_manager: "Organization Manager",
    admin: "Administrator",
  };
  return map[role] ?? role;
}

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "instructor":
      return "/instructor";
    case "org_manager":
      return "/org-manager";
    case "admin":
      return "/admin";
    default:
      return "/dashboard";
  }
}

export function canAccessAdminRoutes(role: UserRole | string | null | undefined): boolean {
  return role === "admin";
}

export function canAccessInstructorRoutes(role: UserRole | string | null | undefined): boolean {
  return role === "admin" || role === "instructor";
}

export function canAccessOrgManagerRoutes(role: UserRole | string | null | undefined): boolean {
  return role === "admin" || role === "org_manager";
}

export function canAccessStaffRoutes(role: UserRole | string | null | undefined): boolean {
  return isStaffOrAdmin(role);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  instructor: "Instructor",
  org_manager: "Organization Manager",
  admin: "Admin",
};
