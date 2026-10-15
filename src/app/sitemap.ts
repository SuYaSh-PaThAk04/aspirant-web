import type { MetadataRoute } from "next";
import { listSitemapPosts } from "@/lib/posts";
import { absolutePostUrl, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home = siteUrl();
  try {
    const posts = await listSitemapPosts();
    return [
      { url: home, changeFrequency: "hourly", priority: 1 },
      ...posts.map((post) => ({
        url: absolutePostUrl(post.postId),
        lastModified: post.createdAt ? new Date(post.createdAt) : undefined,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return [{ url: home }];
  }
}
