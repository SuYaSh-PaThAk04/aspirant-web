import { currentUser } from "@/lib/current-user";
import { createPost, listChannelPosts, listPublicPosts, searchPublicPosts } from "@/lib/posts";

const idPattern = /^[a-f0-9]{24}$/i;
const TEXT_MAX = 4000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const query = url.searchParams.get("q");
  const room = url.searchParams.get("room");
  if (!cursor) return Response.json({ message: "Missing cursor." }, { status: 400 });

  try {
    const viewerId = (await currentUser())?.id ?? null;
    if (query?.trim()) return Response.json(await searchPublicPosts(query, cursor, viewerId));
    if (room) {
      if (!idPattern.test(room)) return Response.json({ message: "That community is not available." }, { status: 400 });
      return Response.json(await listChannelPosts(room, cursor, viewerId));
    }
    return Response.json(await listPublicPosts(cursor, viewerId));
  } catch (error) {
    console.error("Could not load more discussions", error);
    return Response.json({ message: "Could not load posts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ message: "Log in to post." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { text?: unknown; roomId?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const roomId = typeof body?.roomId === "string" ? body.roomId.trim() : "";
  if (!text) return Response.json({ message: "Write something to post." }, { status: 400 });
  if (text.length > TEXT_MAX) return Response.json({ message: "That post is too long." }, { status: 400 });
  if (!idPattern.test(roomId)) return Response.json({ message: "Choose a community." }, { status: 400 });

  try {
    const post = await createPost({ roomId, senderId: user.id, text });
    if (!post) return Response.json({ message: "That community is not available." }, { status: 404 });
    return Response.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Could not create a discussion", error);
    return Response.json({ message: "Could not create the post." }, { status: 500 });
  }
}
