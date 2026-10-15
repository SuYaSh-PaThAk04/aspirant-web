import { notFound, permanentRedirect } from "next/navigation";
import { postIdFromSlug, postPath } from "@/lib/site";

export default async function LegacyPostRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postId = postIdFromSlug(slug);
  if (!postId) notFound();
  permanentRedirect(postPath(postId));
}
