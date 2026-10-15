"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { AppBanner } from "@/components/AppBanner";
import { useAuth } from "@/components/AuthProvider";
import { JoinPanel } from "@/components/JoinPanel";
import { PostActions } from "@/components/PostActions";
import { FeedCardSkeleton } from "@/components/Shimmer";
import { SiteHeader } from "@/components/SiteHeader";
import type { PublicChannel } from "@/lib/channels";
import type { PublicAuthor, PublicPost } from "@/lib/posts";
import { channelPath, postPath } from "@/lib/site";

function displayName(author: PublicAuthor | null) {
  return author?.name || author?.username || "Aspirant";
}

function formatWhen(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function memberLabel(count: number) {
  if (count < 1000) return String(count);
  if (count < 10000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  if (count < 1000000) return `${Math.round(count / 1000)}k`;
  return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}m`;
}

function Avatar({ author, size = "size-10" }: { author: PublicAuthor | null; size?: string }) {
  const name = displayName(author);
  if (author?.imageUrl) {
    return <img src={author.imageUrl} alt="" className={`${size} rounded-full object-cover`} />;
  }
  return (
    <span className={`bg-accent-soft text-heading flex ${size} items-center justify-center rounded-full text-sm font-bold`}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function FeedCard({ post }: { post: PublicPost }) {
  const name = displayName(post.author);
  const images = post.attachments.filter((item) => item.type === "image");
  return (
    <li>
      <div className="border-line rounded-2xl border bg-card p-4 shadow-sm">
        <Link href={postPath(post.postId)} className="block">
          <div className="flex gap-3">
            <Avatar author={post.author} />
            <div className="min-w-0">
              <p className="text-heading truncate text-sm font-bold">
                {name}
                {post.author?.verified ? <span className="text-success"> ✓</span> : null}
              </p>
              <p className="text-muted truncate text-xs">
                {[post.author?.username ? `@${post.author.username}` : "", post.room, formatWhen(post.createdAt)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-5 whitespace-pre-wrap">{post.text}</p>
          {images.length ? (
            <img src={images[0].url} alt="" className="mt-3 block h-auto max-w-full rounded-xl" />
          ) : null}
        </Link>
        <PostActions
          likes={post.likes}
          liked={post.liked}
          commentCount={post.commentCount}
          href={postPath(post.postId)}
        />
      </div>
    </li>
  );
}

function PostComposer({
  channels,
  defaultRoomId,
  onCreated,
}: {
  channels: PublicChannel[];
  defaultRoomId?: string;
  onCreated: (post: PublicPost) => void;
}) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const tapri = channels.find((item) => item.name.trim().toLowerCase() === "aspirant tapri");
  const [roomId, setRoomId] = useState(defaultRoomId || tapri?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  if (!user) return null;

  const author = {
    name: user.name,
    username: user.username,
    imageUrl: user.imageUrl,
    verified: false,
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, roomId }),
      });
      const data = (await response.json()) as { post?: PublicPost; message?: string };
      if (!response.ok || !data.post) {
        setError(data.message || "Could not create the post.");
        return;
      }
      setText("");
      setNotice("Posted.");
      onCreated(data.post);
    } catch {
      setError("Could not create the post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="border-line mt-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <label className="min-w-0">
          <span className="sr-only">Community</span>
          <select
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            className="border-line bg-sunken max-w-full rounded-full border px-3 py-1.5 text-sm"
          >
            <option value="">Choose a community</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={busy || !text.trim() || !roomId}
          className="bg-accent text-on-primary rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap disabled:opacity-50"
        >
          {busy ? "Posting" : "Post"}
        </button>
      </div>
      <div className="flex gap-3">
        <Avatar author={author} />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Start a discussion"
          rows={2}
          maxLength={4000}
          className="border-line placeholder:text-muted focus:border-accent bg-sunken w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none"
        />
      </div>
      {error ? <p className="text-danger mt-2 text-sm">{error}</p> : null}
      {notice ? <p className="text-success mt-2 text-sm">{notice}</p> : null}
    </form>
  );
}

export function DiscussionsView({
  posts: initialPosts,
  cursor: initialCursor,
  channels,
  unavailable,
  query = "",
  channel = null,
}: {
  posts: PublicPost[];
  cursor: string | null;
  channels: PublicChannel[];
  unavailable: boolean;
  query?: string;
  channel?: PublicChannel | null;
}) {
  const { login, user } = useAuth();
  const pathname = usePathname();
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const roomId = channel?.id ?? "";

  const loadMore = useCallback(async () => {
    if (!cursor || pending.current) return;
    pending.current = true;
    setLoading(true);
    setFailed(false);
    try {
      const params = new URLSearchParams({ cursor });
      if (query) params.set("q", query);
      if (roomId) params.set("room", roomId);
      const response = await fetch(`/api/posts?${params}`);
      if (!response.ok) throw new Error("Could not load posts.");
      const data = (await response.json()) as { posts?: PublicPost[]; cursor?: string | null };
      const next = Array.isArray(data.posts) ? data.posts : [];
      setPosts((current) => {
        const seen = new Set(current.map((post) => post.postId));
        return [...current, ...next.filter((post) => post.postId && !seen.has(post.postId))];
      });
      setCursor(typeof data.cursor === "string" && data.cursor ? data.cursor : null);
    } catch {
      setFailed(true);
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }, [cursor, query, roomId]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !cursor || failed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: "480px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [cursor, failed, loadMore]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="grid w-full gap-3 px-3 py-3 lg:grid-cols-[360px_minmax(0,1fr)_260px]">
        <aside className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-16 lg:h-[calc(100vh-5.5rem)] lg:self-start">
          {user ? null : <JoinPanel onContinue={() => login()} />}
          <AppBanner tall={Boolean(user)} />
        </aside>

        <main className="min-w-0">
          <h1 className="px-1 text-2xl tracking-tight">{channel ? channel.name : "Discussions"}</h1>
          <p className="text-muted mt-1 px-1 text-sm">
            {channel
              ? channel.description || "Posts in this community."
              : query
                ? `Results for “${query}”`
                : "What aspirants are talking about right now."}
          </p>
          {channel ? (
            <p className="text-accent mt-1 inline-flex items-center gap-1 px-1 text-xs font-medium">
              <Users size={12} />
              {memberLabel(channel.memberCount)}
            </p>
          ) : null}
          {channel || query ? (
            <Link href="/" className="text-accent mt-2 inline-block px-1 text-sm font-medium">
              {query ? "Clear search" : "All discussions"}
            </Link>
          ) : null}
          {!unavailable && user ? (
            <PostComposer
              channels={
                channel && !channels.some((item) => item.id === channel.id) ? [channel, ...channels] : channels
              }
              defaultRoomId={channel?.id}
              onCreated={(post) => {
                const matchesQuery = !query || post.text.toLowerCase().includes(query.toLowerCase());
                const matchesChannel = !channel || post.roomId === channel.id;
                if (!matchesQuery || !matchesChannel) return;
                setPosts((current) => [post, ...current.filter((item) => item.postId !== post.postId)]);
              }}
            />
          ) : null}
          {unavailable ? (
            <p className="border-line mt-3 rounded-2xl border bg-card p-4 text-sm">Discussions are unavailable right now.</p>
          ) : null}
          {!unavailable && query.length === 1 ? (
            <p className="border-line mt-3 rounded-2xl border bg-card p-4 text-sm">Type at least 2 characters to search.</p>
          ) : null}
          {!unavailable && query.length !== 1 && posts.length === 0 ? (
            <p className="border-line mt-3 rounded-2xl border bg-card p-4 text-sm">
              {query ? `No posts match “${query}”.` : channel ? "No posts in this community yet." : "No public posts yet."}
            </p>
          ) : null}
          <ul className="mt-3 space-y-3">
            {posts.map((post) => (
              <FeedCard key={post.postId} post={post} />
            ))}
          </ul>
          {loading ? (
            <div className="mt-3 space-y-3" aria-busy="true">
              <span className="sr-only">Loading more</span>
              <FeedCardSkeleton />
              <FeedCardSkeleton />
            </div>
          ) : null}
          {cursor ? (
            <div ref={sentinel} className="flex justify-center py-4">
              {failed ? (
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  className="border-line rounded-full border bg-card px-4 py-2 text-sm font-bold"
                >
                  Load more
                </button>
              ) : loading ? null : (
                <p className="text-muted text-sm">Load more</p>
              )}
            </div>
          ) : null}
        </main>

        <aside className="lg:sticky lg:top-16 lg:self-start">
          <h2 className="px-1 text-sm">Communities</h2>
          <ul className="border-line mt-2 max-h-[calc(100vh-5.5rem)] divide-y divide-line overflow-y-auto rounded-2xl border bg-card">
            {channels.length === 0 ? (
              <li className="text-muted px-4 py-3 text-sm">No communities yet.</li>
            ) : (
              channels.map((item) => {
                const href = channelPath(item.id);
                const active = pathname === href;
                return (
                  <li key={item.id} className={`flex items-center gap-2 pr-3 ${active ? "bg-accent-soft" : ""}`}>
                    <Link href={href} aria-current={active ? "page" : undefined} className="hover:bg-white/5 flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="size-11 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span className="bg-accent-soft text-heading flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                          {item.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-heading truncate text-sm font-medium">{item.name}</p>
                        <p className="text-accent mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium">
                          <Users size={12} />
                          {memberLabel(item.memberCount)}
                        </p>
                        {item.description ? <p className="text-muted truncate text-xs">{item.description}</p> : null}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        login({
                          openApp: true,
                          appNote: `Your number is on Aspirant Adda. Open the app to join ${item.name}.`,
                        })
                      }
                      className="bg-accent text-on-primary shrink-0 rounded-full px-3 py-1.5 text-xs font-bold"
                    >
                      Join
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}
