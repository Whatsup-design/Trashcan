import { normalizeRole } from "./normalizeRole";

export function getRedirectPath(role?: string | null) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  if (normalizedRole === "student") {
    return "/user/dashboard";
  }

  return null;
}
