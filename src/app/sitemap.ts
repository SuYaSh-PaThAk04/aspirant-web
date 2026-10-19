import type { MetadataRoute } from "next";
import { listChannels } from "@/lib/channels";
import { listSitemapPosts } from "@/lib/posts";
import { channelPath, feedPostPath } from "@/lib/site";

export const revalidate = 3600;

const PRODUCTION_ORIGIN = "https://www.aspirantadda.com";

const staticPages: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/feed", changeFrequency: "hourly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

function origin() {
  return (process.env.PUBLIC_SITE_URL || PRODUCTION_ORIGIN).replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = origin();
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  try {
    const [posts, channels] = await Promise.all([listSitemapPosts(), listChannels()]);

    return [
      ...pages,
      ...channels.map((channel) => ({
        url: `${baseUrl}${channelPath(channel.id)}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...posts.flatMap((post) => {
        const slug = post.slug.trim().toLowerCase();
        if (!slug) return [];
        return [
          {
            url: `${baseUrl}${feedPostPath(slug)}`,
            lastModified: post.createdAt ? new Date(post.createdAt) : undefined,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ];
      }),
    ];
  } catch {
    return pages;
  }
}
