import { cookies } from "next/headers";
import { apiPost } from "@/lib/api";
import { captureEvent } from "@/lib/analytics";
import { TOKEN_COOKIE } from "@/lib/session";

const idPattern = /^[a-f0-9]{24}$/i;

type Action =
  | { type: "like" }
  | { type: "comment"; text: string; parentCommentId?: string };

export async function POST(request: Request) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return Response.json({ message: "Log in to continue." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    pendingPostId?: unknown;
    action?: Action;
  } | null;
  const pendingPostId = typeof body?.pendingPostId === "string" ? body.pendingPostId : "";
  const action = body?.action;
  if (!idPattern.test(pendingPostId) || !action) {
    return Response.json({ message: "Could not finish that." }, { status: 400 });
  }

  try {
    if (action.type === "like") {
      const liked = await apiPost(`/api/user/room-message/${pendingPostId}/like`, {}, token);
      if (!liked.ok) {
        return Response.json({ actionError: "Your account is ready. Open the app to finish this like." });
      }
      await captureEvent({ request, event: "post_liked", postId: pendingPostId });
      return Response.json({ actionError: null, isLiked: liked.data.isLiked === true });
    }
    const text = action.text.trim();
    if (!text) return Response.json({ message: "Write a comment first." }, { status: 400 });
    const parentCommentId = action.parentCommentId;
    const commented = await apiPost(
      `/api/user/room-message/${pendingPostId}/comment`,
      {
        text,
        ...(parentCommentId && idPattern.test(parentCommentId) ? { parentCommentId } : {}),
      },
      token,
    );
    if (!commented.ok) {
      return Response.json({ actionError: "Your account is ready. Open the app to finish this comment." });
    }
    await captureEvent({ request, event: "post_commented", postId: pendingPostId });
    return Response.json({ actionError: null });
  } catch {
    return Response.json({ message: "Could not finish that." }, { status: 502 });
  }
}
