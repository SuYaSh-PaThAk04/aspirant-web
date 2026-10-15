import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/session";
import { clearUserId } from "@/lib/analytics";

export async function POST() {
  (await cookies()).delete(TOKEN_COOKIE);
  await clearUserId();
  return Response.json({ ok: true });
}
