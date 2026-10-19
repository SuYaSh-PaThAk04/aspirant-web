"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { track } from "@/lib/track";

async function sharePost(path: string, postId: string) {
  const url = new URL(path, window.location.origin).toString();
  const shared = () => {
    if (postId) track("post_shared", { path, postId });
  };
  if (navigator.share) {
    try {
      await navigator.share({ url });
      shared();
      return "shared" as const;
    } catch {
      return "cancelled" as const;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const input = document.createElement("textarea");
    input.value = url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.append(input);
    input.select();
    const ok = document.execCommand("copy");
    input.remove();
    if (!ok) return "cancelled" as const;
  }
  shared();
  return "copied" as const;
}

export function PostActions({
  likes,
  commentCount,
  liked = false,
  href,
  postId,
  onLike,
  onComment,
  commentOpen = false,
  variant = "inline",
}: {
  likes: number;
  commentCount: number;
  liked?: boolean;
  href: string;
  postId: string;
  onLike?: () => void;
  onComment?: () => void;
  commentOpen?: boolean;
  variant?: "inline" | "pills";
}) {
  const commentHref = `${href}#comments`;
  const pills = variant === "pills";
  const [copied, setCopied] = useState(false);
  const itemClass = pills
    ? "border-line bg-sunken text-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium"
    : "text-muted inline-flex items-center gap-1.5 text-sm font-medium";
  const heartClass = liked ? "fill-like text-like" : "";

  return (
    <div className={pills ? "mt-4 flex flex-wrap items-center gap-2" : "mt-3 flex items-center gap-5"}>
      {onLike ? (
        <button type="button" onClick={onLike} aria-pressed={liked} className={itemClass}>
          <Heart size={18} className={heartClass} />
          {likes}
        </button>
      ) : (
        <Link href={href} className={itemClass} aria-pressed={liked}>
          <Heart size={18} className={heartClass} />
          {likes}
        </Link>
      )}
      {onComment ? (
        <button type="button" onClick={onComment} aria-expanded={commentOpen} className={itemClass}>
          <MessageCircle size={18} />
          {commentCount}
        </button>
      ) : (
        <Link href={commentHref} className={itemClass}>
          <MessageCircle size={18} />
          {commentCount}
        </Link>
      )}
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void sharePost(href, postId).then((result) => {
            if (result !== "copied") return;
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          });
        }}
        className={itemClass}
        aria-label={copied ? "Link copied" : "Share"}
      >
        <Share2 size={18} />
        {copied ? "Copied" : pills ? "Share" : null}
      </button>
    </div>
  );
}
