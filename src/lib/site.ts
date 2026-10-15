export function siteUrl() {
  return (process.env.PUBLIC_SITE_URL || "http://localhost:3001").replace(/\/$/, "");
}

export function channelPath(id: string) {
  return `/c/${id}`;
}

export function postPath(postId: string) {
  return `/post/${postId}`;
}

export function postIdFromSlug(slug: string) {
  const match = slug.match(/([a-f0-9]{24})$/i);
  return match ? match[1].toLowerCase() : null;
}

export function absolutePostUrl(postId: string) {
  return `${siteUrl()}${postPath(postId)}`;
}

export function appPostUrl(postId: string) {
  return `https://aspirantadda.in/post/${postId}`;
}

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.aspirantadda.app";
export const APP_STORE_URL = "https://apps.apple.com/us/app/aspirant-adda/id6747092407";
