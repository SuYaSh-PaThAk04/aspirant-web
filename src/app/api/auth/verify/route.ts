import { cookies } from "next/headers";
import { apiPost } from "@/lib/api";
import { captureEvent, setUserId } from "@/lib/analytics";
import { sessionUser, TOKEN_COOKIE } from "@/lib/session";

const phonePattern = /^[6-9]\d{9}$/;
const otpPattern = /^\d{6}$/;
const idPattern = /^[a-f0-9]{24}$/i;

type Action =
  | { type: "like" }
  | { type: "comment"; text: string; parentCommentId?: string }
  | { type: "continue" };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    phone?: unknown;
    otp?: unknown;
    pendingPostId?: unknown;
    action?: Action;
  } | null;
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const otp = typeof body?.otp === "string" ? body.otp.trim() : "";
  const pendingPostId = typeof body?.pendingPostId === "string" ? body.pendingPostId : "";
  const needsPost = body?.action?.type === "like" || body?.action?.type === "comment";
  if (!phonePattern.test(phone) || !otpPattern.test(otp)) {
    return Response.json({ message: "Check the code and try again." }, { status: 400 });
  }
  if ((pendingPostId || needsPost) && !idPattern.test(pendingPostId)) {
    return Response.json({ message: "Check the code and try again." }, { status: 400 });
  }

  try {
    const verified = await apiPost("/api/public/user/verify-otp", {
      phone,
      otp,
      ...(idPattern.test(pendingPostId) ? { pendingPostId } : {}),
    });
    if (!verified.ok) {
      const message = typeof verified.data.message === "string" ? verified.data.message : "That code is not valid.";
      return Response.json({ message }, { status: verified.status });
    }
    const token = typeof verified.data.token === "string" ? verified.data.token : "";
    const user = sessionUser(verified.data.user);
    const isNew = user.name === "";
    if (token) {
      (await cookies()).set(TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    if (user.id) await setUserId(user.id);
    if (isNew) await captureEvent({ request, event: "signup_completed", userId: user.id });
    let actionError: string | null = null;
    if (token && body?.action?.type === "like") {
      const liked = await apiPost(`/api/user/room-message/${pendingPostId}/like`, {}, token);
      if (!liked.ok) actionError = "Your account is ready. Open the app to finish this like.";
      else await captureEvent({ request, event: "post_liked", postId: pendingPostId, userId: user.id });
    } else if (token && body?.action?.type === "comment") {
      const text = body.action.text.trim();
      const parentCommentId = body.action.parentCommentId;
      const commented = await apiPost(
        `/api/user/room-message/${pendingPostId}/comment`,
        {
          text,
          ...(parentCommentId && idPattern.test(parentCommentId) ? { parentCommentId } : {}),
        },
        token,
      );
      if (!commented.ok) actionError = "Your account is ready. Open the app to finish this comment.";
      else await captureEvent({ request, event: "post_commented", postId: pendingPostId, userId: user.id });
    }
    return Response.json({ ok: true, actionError, user, isNew });
  } catch {
    return Response.json({ message: "Could not verify the code." }, { status: 502 });
  }
}
