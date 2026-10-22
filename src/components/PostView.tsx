"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { OpenAppPopup } from "@/components/AppBanner";
import { useAuth } from "@/components/AuthProvider";
import { JoinPanel } from "@/components/JoinPanel";
import { PostRail } from "@/components/PostRail";
import type { WebAction } from "@/components/LoginSheet";
import { openInApp } from "@/components/OpenInApp";
import { isPdf, PdfPreview } from "@/components/PdfPreview";
import { PostActions } from "@/components/PostActions";
import { PostImages } from "@/components/PostImages";
import { SiteHeader } from "@/components/SiteHeader";
import type { PublicAuthor, PublicComment, PublicPost } from "@/lib/posts";
import type { SessionUser } from "@/lib/session";
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

type PendingComment = {
  id: string;
  text: string;
  createdAt: string;
  author: PublicAuthor;
  parentCommentId?: string;
  postId: string;
  knownIds: string[];
};

function authorFromUser(user: SessionUser): PublicAuthor {
  return {
    username: user.username,
    name: user.name,
    imageUrl: user.imageUrl,
    verified: false,
  };
}

function collectIds(comments: PublicComment[], into = new Set<string>()) {
  for (const comment of comments) {
    if (comment.id) into.add(comment.id);
    collectIds(comment.replies, into);
  }
  return into;
}

function findNewMatch(
  comments: PublicComment[],
  pending: PendingComment,
  known: Set<string>,
  used: Set<string>,
): string | null {
  for (const comment of comments) {
    if (
      comment.id &&
      !known.has(comment.id) &&
      !used.has(comment.id) &&
      comment.text === pending.text &&
      comment.author.username === pending.author.username
    ) {
      return comment.id;
    }
    const nested = findNewMatch(comment.replies, pending, known, used);
    if (nested) return nested;
  }
  return null;
}

function openPending(comments: PublicComment[], pending: PendingComment[], postId: string) {
  const used = new Set<string>();
  return pending.filter((item) => {
    if (item.postId !== postId) return false;
    const match = findNewMatch(comments, item, new Set(item.knownIds), used);
    if (!match) return true;
    used.add(match);
    return false;
  });
}

function toPublic(item: PendingComment): PublicComment {
  return {
    id: item.id,
    text: item.text,
    createdAt: item.createdAt,
    author: item.author,
    replies: [],
  };
}

function mergeComments(comments: PublicComment[], pending: PendingComment[]): PublicComment[] {
  const attach = (list: PublicComment[]): PublicComment[] =>
    list.map((comment) => ({
      ...comment,
      replies: [
        ...pending.filter((item) => item.parentCommentId === comment.id).map(toPublic),
        ...attach(comment.replies),
      ],
    }));
  return [...pending.filter((item) => !item.parentCommentId).map(toPublic), ...attach(comments)];
}

function CommentRow({
  comment,
  onReply,
}: {
  comment: PublicComment;
  onReply: (comment: PublicComment, text: string) => boolean;
}) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const name = displayName(comment.author);
  const replies = showReplies ? comment.replies : comment.replies.slice(0, 1);
  const hiddenReplies = comment.replies.length - replies.length;
  const pending = comment.id.startsWith("pending-");
  return (
    <li className={`flex gap-3 ${pending ? "opacity-80" : ""}`}>
      <Avatar author={comment.author} />
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="text-heading font-bold">{name}</span>
          {comment.author.verified ? <span className="text-success"> ✓</span> : null}
          <span className="text-muted"> · {formatWhen(comment.createdAt)}</span>
        </p>
        <p className="mt-1 text-sm leading-5 whitespace-pre-wrap">{comment.text}</p>
        {pending ? null : (
          <button
            type="button"
            className="text-muted mt-1 text-xs font-medium"
            onClick={() => setOpen(true)}
          >
            Reply
          </button>
        )}
        {open ? (
          <form
            className="mt-2 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const text = draft.trim();
              if (!text) return;
              if (!onReply(comment, text)) return;
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
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [notice, setNotice] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const likedRef = useRef(post.liked);
  const likeCountRef = useRef(post.likes);
  const likePending = useRef(false);
  const commentPending = useRef(new Set<string>());

  useEffect(() => {
    if (likePending.current) return;
    likedRef.current = post.liked;
    likeCountRef.current = post.likes;
    setLiked(post.liked);
    setLikeCount(post.likes);
  }, [post.postId, post.liked, post.likes]);

  useEffect(() => {
    setPendingComments((current) => {
      const next = openPending(post.comments, current, post.postId);
      return next.length === current.length ? current : next;
    });
  }, [post.postId, post.comments]);

  useEffect(() => {
    const now = Date.now();
    if (lastPost === post.postId && now - lastPostAt < 1000) return;
    lastPost = post.postId;
    lastPostAt = now;
    track("post_viewed", { postId: post.postId });
  }, [post.postId]);

  function setLike(nextLiked: boolean, nextCount: number) {
    likedRef.current = nextLiked;
    likeCountRef.current = nextCount;
    setLiked(nextLiked);
    setLikeCount(nextCount);
  }

  function applyConfirmed(next: WebAction, actionError: string | null, isLiked?: boolean) {
    if (actionError) {
      setNotice(actionError);
      return;
    }
    setNotice("");
    if (next.type === "like") {
      const nextLiked = typeof isLiked === "boolean" ? isLiked : !likedRef.current;
      const nextCount = Math.max(0, likeCountRef.current + (nextLiked === likedRef.current ? 0 : nextLiked ? 1 : -1));
      setLike(nextLiked, nextCount);
      if (nextLiked) trackMixpanel("post_liked", { postId: post.postId });
    }
    if (next.type === "comment") setDraft("");
    router.refresh();
  }

  function beginOptimistic(next: WebAction) {
    if (next.type === "like") {
      const previousLiked = likedRef.current;
      const previousCount = likeCountRef.current;
      const nextLiked = !previousLiked;
      setLike(nextLiked, Math.max(0, previousCount + (nextLiked ? 1 : -1)));
      return {
        rollback(message?: string) {
          setLike(previousLiked, previousCount);
          if (message) setNotice(message);
        },
        confirm(isLiked?: boolean) {
          if (typeof isLiked === "boolean" && isLiked !== likedRef.current) {
            setLike(isLiked, Math.max(0, likeCountRef.current + (isLiked ? 1 : -1)));
          }
          if (likedRef.current) trackMixpanel("post_liked", { postId: post.postId });
        },
      };
    }
    if (next.type !== "comment" || !user) return null;
    const pendingId = `pending-${crypto.randomUUID()}`;
    const pending: PendingComment = {
      id: pendingId,
      text: next.text,
      createdAt: new Date().toISOString(),
      author: authorFromUser(user),
      parentCommentId: next.parentCommentId,
      postId: post.postId,
      knownIds: [...collectIds(post.comments)],
    };
    setPendingComments((current) => [pending, ...current]);
    if (!next.parentCommentId) setDraft("");
    return {
      rollback(message?: string) {
        setPendingComments((current) => current.filter((item) => item.id !== pendingId));
        if (!next.parentCommentId) setDraft((current) => current || next.text);
        setNotice(message || "Couldn't post that comment.");
      },
      confirm(_isLiked?: boolean) {
        router.refresh();
      },
    };
  }

  function ask(next: WebAction) {
    if (user && next.type === "continue") {
      openInApp(post.postId);
      return false;
    }
    const appNote = "Your number is on Aspirant Adda. Open the app to pick up this post.";
    if (!user) {
      login({
        pendingPostId: post.postId,
        action: next,
        openApp: next.type === "continue",
        appNote,
        onDone: (result) => applyConfirmed(next, result.actionError),
      });
      return false;
    }
    if (next.type === "like" && likePending.current) return true;
    if (next.type === "like") likePending.current = true;
    const commentKey = next.type === "comment" ? `${next.parentCommentId ?? ""}:${next.text}` : "";
    if (commentKey && commentPending.current.has(commentKey)) return true;
    if (commentKey) commentPending.current.add(commentKey);
    const optimistic = beginOptimistic(next);
    void (async () => {
      try {
        const response = await fetch("/api/auth/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pendingPostId: post.postId, action: next }),
        });
        if (response.status === 401) {
          optimistic?.rollback();
          login({
            pendingPostId: post.postId,
            action: next,
            appNote,
            onDone: (result) => applyConfirmed(next, result.actionError),
          });
          return;
        }
        const data = (await response.json().catch(() => ({}))) as { actionError?: string | null; isLiked?: boolean };
        if (!response.ok || data.actionError) {
          optimistic?.rollback(data.actionError || "Couldn't update. Try again.");
          return;
        }
        setNotice("");
        optimistic?.confirm(data.isLiked);
      } catch {
        optimistic?.rollback("Couldn't update. Try again.");
      } finally {
        if (next.type === "like") likePending.current = false;
        if (commentKey) commentPending.current.delete(commentKey);
      }
    })();
    return Boolean(optimistic);
  }

  const name = displayName(post.author);
  const href = postHref(post);
  const activePending = openPending(post.comments, pendingComments, post.postId);
  const comments = mergeComments(post.comments, activePending);
  const visibleComments = showAllComments ? comments : comments.slice(0, 10);
  const commentCount = post.commentCount + activePending.length;

  return (
    <div className="min-h-screen w-full">
      <SiteHeader />
      <OpenAppPopup />
      {user ? null : <JoinPanel onContinue={() => login()} />}

      <div
        className={`grid w-full gap-3 px-3 py-3 ${
          related.length ? "lg:grid-cols-[minmax(0,1fr)_260px]" : ""
        }`}
      >
        <div className="min-w-0">
      <article className="border-line rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Link href="/feed" className="text-muted mt-1 shrink-0" aria-label="Back to discussions">
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

        <PostImages attachments={post.attachments} expandable className="mt-3" />
        {post.attachments.some((item) => item.type !== "image") ? (
          <div className="mt-3 space-y-2">
            {post.attachments.map((item) => {
              if (item.type === "image") return null;
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
          commentCount={commentCount}
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
          {notice ? <p className="text-danger mb-2 text-sm">{notice}</p> : null}
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
        {comments.length > visibleComments.length ? (
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

        <PostRail title="Related posts" posts={related} />
      </div>
    </div>
  );
}
