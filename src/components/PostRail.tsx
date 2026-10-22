"use client";

import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import type { PublicPost } from "@/lib/posts";
import { postHref } from "@/lib/site";

function displayName(author: { name: string; username: string } | null) {
  return author?.name || author?.username || "Aspirant";
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

export function PostRail({
  title,
  posts,
  className = "",
}: {
  title: string;
  posts: PublicPost[];
  className?: string;
}) {
  if (!posts.length) return null;

  return (
    <aside className={`lg:sticky lg:top-16 lg:self-start ${className}`}>
      <h2 className="px-1 text-sm">{title}</h2>
      <ul className="border-line mt-2 divide-y divide-line overflow-hidden rounded-2xl border bg-card">
        {posts.map((item) => (
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
  );
}
