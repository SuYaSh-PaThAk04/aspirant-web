import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/current-user";
import { PostView } from "@/components/PostView";
import { getPublicPostBySlug, listRelatedPosts, type PublicComment, type PublicPost } from "@/lib/posts";
import { absolutePostUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

function titleFrom(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "Discussion";
  return clean.length > 70 ? `${clean.slice(0, 67).trim()}…` : clean;
}

function headline(post: PublicPost) {
  return post.title || titleFrom(post.text);
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
    headline: headline(post),
    text: post.text,
    datePublished: post.createdAt ?? undefined,
    url: absolutePostUrl(post),
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: "Discussion" };
  const title = headline(post);
  const description = descriptionFrom(post.text);
  const url = absolutePostUrl(post);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function FeedPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const viewerId = (await currentUser())?.id ?? null;
  const post = await getPublicPostBySlug(slug, viewerId);
  if (!post) notFound();
  const related = await listRelatedPosts(post, viewerId);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(post) }} />
      <PostView post={post} related={related} />
    </>
  );
}
