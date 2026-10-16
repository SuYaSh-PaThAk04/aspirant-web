import { notFound, permanentRedirect } from "next/navigation";
import { getPostSlug } from "@/lib/posts";
import { feedPostPath, postIdFromSlug, postPath } from "@/lib/site";

export default async function LegacyPostRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postId = postIdFromSlug(slug);
  if (!postId) notFound();
  const stored = await getPostSlug(postId);
  permanentRedirect(stored ? feedPostPath(stored) : postPath(postId));
}
