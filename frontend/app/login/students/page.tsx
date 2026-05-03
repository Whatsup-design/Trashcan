import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRedirectPath } from "@/lib/auth/getRedirectPath";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth/sessionConfig";
import StudentLoginClient from "./StudentLoginClient";

export default async function StudentLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value;
  const redirectPath = token ? getRedirectPath(role) : null;

  if (redirectPath) {
    redirect(redirectPath);
  }

  return <StudentLoginClient />;
}
