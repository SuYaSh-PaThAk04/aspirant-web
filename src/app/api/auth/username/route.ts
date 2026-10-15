import { cookies } from "next/headers";
import { apiPost } from "@/lib/api";
import { sessionUser, TOKEN_COOKIE } from "@/lib/session";
import { normalizeUsername } from "@/lib/username";

export async function POST(request: Request) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return Response.json({ message: "Log in to continue." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { username?: unknown } | null;
  const username = normalizeUsername(typeof body?.username === "string" ? body.username : "");
  if (username.length < 3) {
    return Response.json({ message: "Username must be at least 3 characters." }, { status: 400 });
  }

  try {
    const result = await apiPost("/api/user/update", { username }, token);
    if (!result.ok) {
      const raw = typeof result.data.message === "string" ? result.data.message : "";
      const taken = /exist|available|username/i.test(raw);
      return Response.json(
        { message: taken ? "Not available" : raw || "Could not save that username." },
        { status: result.status },
      );
    }
    const user = sessionUser(result.data.user ?? result.data);
    return Response.json({ user });
  } catch (error) {
    console.error("Could not save a username", error);
    return Response.json({ message: "Could not save that username." }, { status: 502 });
  }
}
