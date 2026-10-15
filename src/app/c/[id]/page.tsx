import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/current-user";
import { DiscussionsView } from "@/components/DiscussionsView";
import { getChannel, listChannels, type PublicChannel } from "@/lib/channels";
import { listChannelPosts, type PublicPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const channel = await getChannel(id).catch(() => null);
  if (!channel) return { title: "Community" };
  return {
    title: channel.name,
    description: channel.description || `Posts in ${channel.name} on Aspirant Adda.`,
  };
}

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let channel: PublicChannel | null = null;
  let lookupFailed = false;
  try {
    channel = await getChannel(id);
  } catch {
    lookupFailed = true;
  }
  if (!lookupFailed && !channel) notFound();

  let posts: PublicPost[] = [];
  let cursor: string | null = null;
  let channels: Awaited<ReturnType<typeof listChannels>> = [];
  let unavailable = false;
  if (lookupFailed || !channel) {
    unavailable = true;
  } else {
    try {
      const page = await listChannelPosts(channel.id, null, (await currentUser())?.id ?? null);
      posts = page.posts;
      cursor = page.cursor;
    } catch {
      unavailable = true;
    }
  }
  try {
    channels = await listChannels();
  } catch {
    channels = [];
  }

  return (
    <DiscussionsView
      key={channel?.id || "channel"}
      posts={posts}
      cursor={cursor}
      channels={channels}
      unavailable={unavailable}
      channel={channel}
    />
  );
}
