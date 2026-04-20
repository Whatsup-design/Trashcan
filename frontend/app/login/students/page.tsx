import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRedirectPath } from "@/lib/auth/getRedirectPath";
import StudentLoginClient from "./StudentLoginClient";

export default async function StudentLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const role = cookieStore.get("auth_role")?.value;
  const redirectPath = token ? getRedirectPath(role) : null;

  if (redirectPath) {
    redirect(redirectPath);
  }

  return <StudentLoginClient />;
}
