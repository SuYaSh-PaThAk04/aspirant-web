import { cookies } from "next/headers";
import { apiGet } from "@/lib/api";
import { clearUserId, setUserId } from "@/lib/analytics";
import { sessionUser, TOKEN_COOKIE } from "@/lib/session";

export async function GET() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    await clearUserId();
    return Response.json({ user: null });
  }
  try {
    const result = await apiGet("/api/user/get-user", token);
    if (!result.ok) {
      (await cookies()).delete(TOKEN_COOKIE);
      await clearUserId();
      return Response.json({ user: null });
    }
    const user = sessionUser(result.data);
    if (user.id) await setUserId(user.id);
    else await clearUserId();
    return Response.json({ user });
  } catch {
    return Response.json({ user: null });
  }
}
