export function siteUrl() {
  return (process.env.PUBLIC_SITE_URL || "http://localhost:3001").replace(/\/$/, "");
}

export function channelPath(id: string) {
  return `/c/${id}`;
}

export function postPath(postId: string) {
  return `/post/${postId}`;
}

export function feedPostPath(slug: string) {
  return `/feed/post/${slug}`;
}

export function postHref(post: { postId: string; slug?: string }) {
  const slug = post.slug?.trim();
  return slug ? feedPostPath(slug) : postPath(post.postId);
}

export function postIdFromSlug(slug: string) {
  const match = slug.match(/([a-f0-9]{24})$/i);
  return match ? match[1].toLowerCase() : null;
}

export function absolutePostUrl(post: { postId: string; slug?: string }) {
  return `${siteUrl()}${postHref(post)}`;
}

export function appPostUrl(postId: string) {
  return `https://aspirantadda.in/post/${postId}`;
}

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.aspirantadda.app";
export const APP_STORE_URL = "https://apps.apple.com/us/app/aspirant-adda/id6747092407";
