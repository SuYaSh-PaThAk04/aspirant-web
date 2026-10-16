"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { track } from "@/lib/track";
function sharePost(path: string, postId: string) {
  const url = new URL(path, window.location.origin).toString();
  const shared = () => {
    if (postId) track("post_shared", { path, postId });
  };
  if (navigator.share) {
    void navigator.share({ url }).then(shared).catch(() => undefined);
    return;
  }
  void navigator.clipboard.writeText(url).then(shared).catch(() => undefined);
}

export function PostActions({
  likes,
  commentCount,
  liked = false,
  href,
  postId,
  onLike,
  variant = "inline",
}: {
  likes: number;
  commentCount: number;
  liked?: boolean;
  href: string;
  postId: string;
  onLike?: () => void;
  variant?: "inline" | "pills";
}) {
  const commentHref = `${href}#comments`;
  const pills = variant === "pills";
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
      <Link href={commentHref} className={itemClass}>
        <MessageCircle size={18} />
        {commentCount}
      </Link>
      <button type="button" onClick={() => sharePost(href, postId)} className={itemClass} aria-label="Share">
        <Share2 size={18} />
        {pills ? "Share" : null}
      </button>
    </div>
  );
}
