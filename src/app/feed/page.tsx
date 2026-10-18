import type { Metadata } from "next";
import { currentUser } from "@/lib/current-user";
import { DiscussionsView } from "@/components/DiscussionsView";
import { listChannels } from "@/lib/channels";
import { cleanQuery, listPublicPosts, searchPublicPosts, type PublicPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discussions",
  description: "Exam discussions from aspirants on Aspirant Adda.",
  alternates: {
    canonical: "/feed",
  },
};

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = cleanQuery(typeof raw === "string" ? raw : "");
  const viewerId = (await currentUser())?.id ?? null;
  let posts: PublicPost[] = [];
  let cursor: string | null = null;
  let channels: Awaited<ReturnType<typeof listChannels>> = [];
  let unavailable = false;
  try {
    const page = query ? await searchPublicPosts(query, null, viewerId) : await listPublicPosts(null, viewerId);
    posts = page.posts;
    cursor = page.cursor;
  } catch {
    unavailable = true;
  }
  try {
    channels = await listChannels();
  } catch {
    channels = [];
  }

  return (
    <DiscussionsView
      key={query || "feed"}
      posts={posts}
      cursor={cursor}
      channels={channels}
      unavailable={unavailable}
      query={query}
    />
  );
}
