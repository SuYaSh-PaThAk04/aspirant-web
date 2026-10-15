import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/current-user";
import { PostView } from "@/components/PostView";
import { getPublicPost, listRelatedPosts, type PublicComment, type PublicPost } from "@/lib/posts";
import { absolutePostUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

function titleFrom(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "Discussion";
  return clean.length > 70 ? `${clean.slice(0, 67).trim()}…` : clean;
}

function descriptionFrom(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "A discussion on Aspirant Adda.";
  return clean.length > 160 ? `${clean.slice(0, 157).trim()}…` : clean;
}

function commentNodes(comments: PublicComment[]): Record<string, unknown>[] {
  return comments.slice(0, 50).map((comment) => ({
    "@type": "Comment",
    text: comment.text,
    datePublished: comment.createdAt ?? undefined,
    author: {
      "@type": "Person",
      name: comment.author.name || comment.author.username || "Aspirant",
    },
  }));
}

function jsonLd(post: PublicPost) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: titleFrom(post.text),
    text: post.text,
    datePublished: post.createdAt ?? undefined,
    url: absolutePostUrl(post.postId),
    author: {
      "@type": "Person",
      name: post.author?.name || post.author?.username || "Aspirant",
    },
    commentCount: post.commentCount,
    comment: commentNodes(post.comments),
  }).replace(/</g, "\\u003c");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const postId = /^[a-f0-9]{24}$/i.test(id) ? id.toLowerCase() : null;
  if (!postId) return { title: "Discussion" };
  const post = await getPublicPost(postId);
  if (!post) return { title: "Discussion" };
  const title = titleFrom(post.text);
  const description = descriptionFrom(post.text);
  const url = absolutePostUrl(post.postId);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) notFound();
  const postId = id.toLowerCase();
  const viewerId = (await currentUser())?.id ?? null;
  const post = await getPublicPost(postId, viewerId);
  if (!post) notFound();
  const related = await listRelatedPosts(post, viewerId);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(post) }} />
      <PostView post={post} related={related} />
    </>
  );
}
