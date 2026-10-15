import { cookies } from "next/headers";
import { apiGet } from "@/lib/api";
import { sessionUser, TOKEN_COOKIE, type SessionUser } from "@/lib/session";

export async function currentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    const result = await apiGet("/api/user/get-user", token);
    if (!result.ok) return null;
    const user = sessionUser(result.data);
    return user.id ? user : null;
  } catch {
    return null;
  }
}
