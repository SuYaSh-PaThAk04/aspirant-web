"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, MessageCircle } from "lucide-react";
import { AppBanner, OpenAppPopup } from "@/components/AppBanner";
import { useAuth } from "@/components/AuthProvider";
import { JoinPanel } from "@/components/JoinPanel";
import type { WebAction } from "@/components/LoginSheet";
import { openInApp } from "@/components/OpenInApp";
import { isPdf, PdfPreview } from "@/components/PdfPreview";
import { PostActions } from "@/components/PostActions";
import { SiteHeader } from "@/components/SiteHeader";
import type { PublicComment, PublicPost } from "@/lib/posts";
import { postHref } from "@/lib/site";
import { track, trackMixpanel } from "@/lib/track";

let lastPost = "";
let lastPostAt = 0;

function displayName(author: { name: string; username: string } | null) {
  return author?.name || author?.username || "Aspirant";
}

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatWhen(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

function initials(name: string) {
  return name.slice(0, 1).toUpperCase();
}

function attachmentName(url: string) {
  const file = decodeURIComponent(url.split("?")[0]?.split("/").pop() ?? "");
  const named = file.includes("_aa_") ? (file.split("_aa_").pop() ?? file) : file;
  const label = named
    .replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_/i, "")
    .replaceAll("_", " ")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return label || "Attachment";
}

function Avatar({ author }: { author: { name: string; username: string; imageUrl: string } | null }) {
  const name = displayName(author);
  if (author?.imageUrl) {
    return <img src={author.imageUrl} alt="" className="size-10 rounded-full object-cover" />;
  }
  return (
    <span className="bg-accent-soft text-heading flex size-10 items-center justify-center rounded-full text-base font-bold">
      {initials(name)}
    </span>
  );
}

function CommentRow({
  comment,
  onReply,
}: {
  comment: PublicComment;
  onReply: (comment: PublicComment, text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const name = displayName(comment.author);
  const replies = showReplies ? comment.replies : comment.replies.slice(0, 1);
  const hiddenReplies = comment.replies.length - replies.length;
  return (
    <li className="flex gap-3">
      <Avatar author={comment.author} />
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="text-heading font-bold">{name}</span>
          {comment.author.verified ? <span className="text-success"> ✓</span> : null}
          <span className="text-muted"> · {formatWhen(comment.createdAt)}</span>
        </p>
        <p className="mt-1 text-sm leading-5 whitespace-pre-wrap">{comment.text}</p>
        <button
          type="button"
          className="text-muted mt-1 text-xs font-medium"
          onClick={() => setOpen(true)}
        >
          Reply
        </button>
        {open ? (
          <form
            className="mt-2 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const text = draft.trim();
              if (!text) return;
              onReply(comment, text);
              setDraft("");
              setOpen(false);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Reply to ${name}`}
              className="border-line bg-sunken w-full rounded-full border px-3 py-2 text-sm"
            />
            <button type="submit" className="text-accent text-sm font-medium">
              Reply
            </button>
          </form>
        ) : null}
        {replies.length ? (
          <ul className="mt-3 space-y-3">
            {replies.map((reply) => (
              <CommentRow key={reply.id || reply.text} comment={reply} onReply={onReply} />
            ))}
          </ul>
        ) : null}
        {hiddenReplies > 0 ? (
          <button
            type="button"
            className="text-muted mt-2 text-xs font-medium"
            onClick={() => setShowReplies(true)}
          >
            Show more replies
          </button>
        ) : null}
      </div>
    </li>
  );
}

export function PostView({ post, related }: { post: PublicPost; related: PublicPost[] }) {
  const router = useRouter();
  const { user, login } = useAuth();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [draft, setDraft] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    setLiked(post.liked);
    setLikeCount(post.likes);
  }, [post.postId, post.liked, post.likes]);

  useEffect(() => {
    const now = Date.now();
    if (lastPost === post.postId && now - lastPostAt < 1000) return;
    lastPost = post.postId;
    lastPostAt = now;
    track("post_viewed", { postId: post.postId });
  }, [post.postId]);

  function finish(next: WebAction, actionError: string | null, isLiked?: boolean) {
    if (next.type === "like" && !actionError) {
      const nextLiked = typeof isLiked === "boolean" ? isLiked : !liked;
      setLikeCount((count) => Math.max(0, count + (nextLiked === liked ? 0 : nextLiked ? 1 : -1)));
      setLiked(nextLiked);
      if (nextLiked) trackMixpanel("post_liked", { postId: post.postId });
    }
    if (next.type === "comment" && !actionError) setDraft("");
    router.refresh();
  }

  async function ask(next: WebAction) {
    if (user && next.type === "continue") {
      openInApp(post.postId);
      return;
    }
    if (user) {
      const response = await fetch("/api/auth/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingPostId: post.postId, action: next }),
      });
      if (response.status === 401) {
        login({
          pendingPostId: post.postId,
          action: next,
          appNote: "Your number is on Aspirant Adda. Open the app to pick up this post.",
          onDone: (result) => finish(next, result.actionError),
        });
        return;
      }
      const data = (await response.json()) as { actionError?: string | null; isLiked?: boolean };
      finish(next, data.actionError ?? null, data.isLiked);
      return;
    }
    login({
      pendingPostId: post.postId,
      action: next,
      openApp: next.type === "continue",
      appNote: "Your number is on Aspirant Adda. Open the app to pick up this post.",
      onDone: (result) => finish(next, result.actionError),
    });
  }

  const name = displayName(post.author);
  const href = postHref(post);
  const visibleComments = showAllComments ? post.comments : post.comments.slice(0, 10);

  return (
    <div className="min-h-screen w-full">
      <SiteHeader />
      <OpenAppPopup />

      <div
        className={`grid w-full gap-3 px-3 py-3 ${
          related.length
            ? "lg:grid-cols-[360px_minmax(0,1fr)_260px]"
            : "lg:grid-cols-[360px_minmax(0,1fr)]"
        }`}
      >
        <aside className="hidden min-w-0 flex-col gap-3 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-5.5rem)] lg:self-start">
          {user ? null : <JoinPanel onContinue={() => login()} />}
          <AppBanner tall={Boolean(user)} />
        </aside>

        <div className="min-w-0">
      <article className="border-line rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Link href="/" className="text-muted mt-1 shrink-0" aria-label="Back to discussions">
            <ChevronLeft size={20} />
          </Link>
          <Avatar author={post.author} />
          <div className="min-w-0">
            <p className="text-heading truncate text-sm font-bold">
              {name}
              {post.author?.verified ? <span className="text-success"> ✓</span> : null}
            </p>
            <p className="text-muted truncate text-xs">
              {[post.author?.username ? `@${post.author.username}` : "", post.room, formatDate(post.createdAt)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>

        {post.title ? <h1 className="text-heading mt-3 text-lg leading-6 font-bold">{post.title}</h1> : null}
        <p className={`${post.title ? "mt-2" : "mt-3"} text-sm leading-5 whitespace-pre-wrap`}>{post.text}</p>

        {post.attachments.length ? (
          <div className="mt-3 space-y-2">
            {post.attachments.map((item) => {
              if (item.type === "image") {
                return <img key={item.url} src={item.url} alt="" className="block h-auto max-w-full rounded-xl" />;
              }
              if (item.type === "video") {
                return <video key={item.url} src={item.url} controls className="w-full rounded-xl" />;
              }
              if (isPdf(item)) return <PdfPreview key={item.url} url={item.url} />;
              return (
                <a key={item.url} href={item.url} className="text-accent block text-sm font-medium" rel="noreferrer">
                  {attachmentName(item.url)}
                </a>
              );
            })}
          </div>
        ) : null}

        {post.options.length ? (
          <ul className="mt-4 space-y-2">
            {post.options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => ask({ type: "continue" })}
                  className="border-line hover:bg-accent-soft flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm"
                >
                  <span>{option.value}</span>
                  <span className="text-muted">{option.votes}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <PostActions
          likes={likeCount}
          commentCount={post.commentCount}
          liked={liked}
          href={href}
          postId={post.postId}
          onLike={() => ask({ type: "like" })}
          variant="pills"
        />
      </article>

      <section id="comments" className="border-line mt-3 rounded-2xl border bg-card p-4 shadow-sm">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const text = draft.trim();
            if (!text) return;
            ask({ type: "comment", text });
          }}
        >
          <label className="text-heading text-sm font-bold" htmlFor="comment">
            Add a comment
          </label>
          <textarea
            id="comment"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Join the conversation"
            className="border-line mt-2 w-full resize-none rounded-xl border px-3 py-2 text-sm"
          />
          <button type="submit" className="bg-accent text-on-primary mt-2 rounded-xl px-4 py-2 text-sm font-bold">
            Comment
          </button>
        </form>

        <ul className="mt-6 space-y-4">
          {visibleComments.map((comment) => (
            <CommentRow
              key={comment.id || comment.text}
              comment={comment}
              onReply={(target, text) => ask({ type: "comment", text, parentCommentId: target.id })}
            />
          ))}
        </ul>
        {post.comments.length > visibleComments.length ? (
          <button
            type="button"
            className="text-muted mt-4 text-sm font-medium"
            onClick={() => setShowAllComments(true)}
          >
            Show all comments
          </button>
        ) : null}
      </section>
        </div>

        {related.length ? (
          <aside className="lg:sticky lg:top-16 lg:self-start">
            <h2 className="px-1 text-sm">Related posts</h2>
            <ul className="border-line mt-2 divide-y divide-line overflow-hidden rounded-2xl border bg-card">
              {related.map((item) => (
                <li key={item.postId}>
                  <Link href={postHref(item)} className="block px-4 py-3">
                    <p className="text-muted truncate text-xs">
                      {[item.room || displayName(item.author), formatWhen(item.createdAt)].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm leading-5 font-medium">{item.title || item.text}</p>
                    <p className="text-muted mt-2 flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Heart size={14} className={item.liked ? "fill-like text-like" : undefined} />
                        {item.likes}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={14} />
                        {item.commentCount}
                      </span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
