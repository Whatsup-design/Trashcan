export function normalizeRole(role?: string | null) {
  return role?.trim().toLowerCase() ?? "";
}
