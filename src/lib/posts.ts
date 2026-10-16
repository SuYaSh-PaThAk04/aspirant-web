import { cache } from "react";
import { ObjectId, type Document, type Sort } from "mongodb";
import { getDb } from "@/lib/mongo";

export type PublicAuthor = {
  username: string;
  name: string;
  imageUrl: string;
  verified: boolean;
};

export type PublicComment = {
  id: string;
  text: string;
  createdAt: string | null;
  author: PublicAuthor;
  replies: PublicComment[];
};

export type PublicPost = {
  postId: string;
  title: string;
  slug: string;
  text: string;
  createdAt: string | null;
  roomId: string;
  room: string;
  likes: number;
  liked: boolean;
  commentCount: number;
  attachments: { type: string; url: string }[];
  options: { value: string; votes: number }[];
  author: PublicAuthor | null;
  comments: PublicComment[];
  examTags: string[];
  subjectTags: string[];
};

type UserDoc = {
  _id?: unknown;
  username?: string;
  name?: string;
  imageUrl?: string;
  isVerified?: boolean;
};

type CommentDoc = {
  _id?: unknown;
  senderId?: string;
  text?: string;
  createdAt?: Date;
  deletedAt?: Date | null;
  deletedBy?: string | null;
  parentCommentId?: string | null;
};

type PostDoc = Document & {
  title?: string;
  slug?: string;
  text?: string;
  senderId?: string;
  roomId?: string;
  createdAt?: Date;
  deletedAt?: Date | null;
  deletedBy?: string | null;
  feedPinnedByAdmin?: boolean;
  likes?: unknown[];
  comments?: CommentDoc[];
  attachments?: { type?: string; url?: string }[];
  options?: { value?: string; votes?: unknown[] }[] | null;
};

type IndexDoc = Document & {
  postId?: unknown;
  indexedAt?: Date;
  decision?: {
    should_index?: boolean;
    expires_relevance?: string;
    priority_score?: number;
    exam_tags?: string[];
    subject_tags?: string[];
    flags?: {
      wellbeing_alert?: boolean;
      misinformation_risk?: boolean;
      spam_or_promotion?: boolean;
      policy_violation?: boolean;
    };
  };
};

const TIER1 = "post_index_tier1";
const HOME_LIMIT = 30;
const RELATED_LIMIT = 8;
const SITEMAP_LIMIT = 5000;

const publicFilter = {
  "decision.should_index": true,
  "decision.expires_relevance": { $ne: "time_bound_expired" },
  "decision.flags.wellbeing_alert": { $ne: true },
  "decision.flags.policy_violation": { $ne: true },
  "decision.flags.spam_or_promotion": { $ne: true },
  "decision.flags.misinformation_risk": { $ne: true },
};

function asObjectId(id: unknown): ObjectId | null {
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && ObjectId.isValid(id) && id.length === 24) return new ObjectId(id);
  return null;
}

function postIdValues(postId: string) {
  const id = asObjectId(postId);
  if (!id) return null;
  return [id, postId];
}

function plainText(value: unknown) {
  return String(value ?? "")
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\\r", "\n");
}

function iso(value: Date | undefined | null) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : new Date(value).toISOString();
}

function authorView(user: UserDoc | undefined): PublicAuthor {
  return {
    username: String(user?.username ?? "").trim(),
    name: String(user?.name ?? "").trim(),
    imageUrl: String(user?.imageUrl ?? "").trim(),
    verified: user?.isVerified === true,
  };
}

function isPublicDecision(row: IndexDoc) {
  const decision = row.decision;
  const flags = decision?.flags;
  return (
    decision?.should_index === true &&
    decision.expires_relevance !== "time_bound_expired" &&
    flags?.wellbeing_alert !== true &&
    flags?.policy_violation !== true &&
    flags?.spam_or_promotion !== true &&
    flags?.misinformation_risk !== true
  );
}

function visibleComments(comments: CommentDoc[]) {
  return comments.filter((comment) => !comment.deletedAt && !comment.deletedBy);
}

function commentView(comment: CommentDoc, users: Map<string, UserDoc>, replies: PublicComment[]): PublicComment {
  return {
    id: String(comment._id ?? ""),
    text: plainText(comment.text),
    createdAt: iso(comment.createdAt),
    author: authorView(users.get(String(comment.senderId ?? ""))),
    replies,
  };
}

function threadOf(post: PostDoc, users: Map<string, UserDoc>): PublicComment[] {
  const comments = visibleComments(post.comments ?? []);
  const top = comments.filter((comment) => !comment.parentCommentId);
  const topIds = new Set(top.map((comment) => String(comment._id ?? "")));
  const replies = comments.filter(
    (comment) => comment.parentCommentId && topIds.has(String(comment.parentCommentId)),
  );
  const orphans = comments.filter(
    (comment) => comment.parentCommentId && !topIds.has(String(comment.parentCommentId)),
  );
  return [...top, ...orphans].map((comment) =>
    commentView(
      comment,
      users,
      replies
        .filter((reply) => String(reply.parentCommentId) === String(comment._id ?? ""))
        .map((reply) => commentView(reply, users, [])),
    ),
  );
}

function previewDocs(post: PostDoc, limit: number) {
  const comments = visibleComments(post.comments ?? []);
  const top = comments.filter((comment) => !comment.parentCommentId);
  const topIds = new Set(top.map((comment) => String(comment._id ?? "")));
  const orphans = comments.filter(
    (comment) => comment.parentCommentId && !topIds.has(String(comment.parentCommentId)),
  );
  return [...top, ...orphans].slice(0, limit);
}

function isLikedBy(post: PostDoc, viewerId?: string | null) {
  if (!viewerId || !Array.isArray(post.likes)) return false;
  const viewer = viewerId.toLowerCase();
  return post.likes.some((id) => String(id).toLowerCase() === viewer);
}
function cardOf(
  row: IndexDoc,
  post: PostDoc | undefined,
  users: Map<string, UserDoc>,
  rooms: Map<string, string>,
  commentMode: "all" | "preview" | "none",
  viewerId?: string | null,
): PublicPost | null {
  if (!post || post.deletedAt || post.deletedBy) return null;
  const visible = visibleComments(post.comments ?? []);
  return {
    postId: String(post._id),
    title: String(post.title ?? "").replace(/\s+/g, " ").trim(),
    slug: String(post.slug ?? "").trim().toLowerCase(),
    text: plainText(post.text),
    createdAt: iso(post.createdAt),
    roomId: String(post.roomId ?? ""),
    room: rooms.get(String(post.roomId ?? "")) || "",
    likes: Array.isArray(post.likes) ? post.likes.length : 0,
    liked: isLikedBy(post, viewerId),
    commentCount: visible.length,
    attachments: (post.attachments ?? [])
      .map((item) => ({
        type: String(item.type ?? "other"),
        url: String(item.url ?? ""),
      }))
      .filter((item) => item.url.startsWith("https://")),
    options: (post.options ?? [])
      .map((option) => ({
        value: String(option.value ?? "").trim(),
        votes: Array.isArray(option.votes) ? option.votes.length : 0,
      }))
      .filter((option) => option.value),
    author: authorView(users.get(String(post.senderId ?? ""))),
    comments:
      commentMode === "all"
        ? threadOf(post, users)
        : commentMode === "preview"
          ? previewDocs(post, 2).map((comment) => commentView(comment, users, []))
          : [],
    examTags: Array.isArray(row.decision?.exam_tags) ? row.decision.exam_tags.filter(Boolean) : [],
    subjectTags: Array.isArray(row.decision?.subject_tags) ? row.decision.subject_tags.filter(Boolean) : [],
  };
}

const liveMatch = { deletedAt: null, deletedBy: null };

async function decorate(
  posts: PostDoc[],
  comments: "all" | "preview" | "none",
  indexById: Map<string, IndexDoc>,
  viewerId?: string | null,
): Promise<PublicPost[]> {
  const db = await getDb();
  const userIds = new Set<string>();
  const roomIds: string[] = [];
  for (const post of posts) {
    if (post.deletedAt || post.deletedBy) continue;
    if (post.senderId) userIds.add(String(post.senderId));
    if (post.roomId) roomIds.push(String(post.roomId));
    if (comments === "all") {
      for (const comment of visibleComments(post.comments ?? [])) {
        if (comment.senderId) userIds.add(String(comment.senderId));
      }
    } else if (comments === "preview") {
      for (const comment of previewDocs(post, 2)) {
        if (comment.senderId) userIds.add(String(comment.senderId));
      }
    }
  }

  const userObjectIds = [...userIds].map(asObjectId).filter((id): id is ObjectId => id !== null);
  const roomObjectIds = [...new Set(roomIds)].map(asObjectId).filter((id): id is ObjectId => id !== null);
  const [users, rooms] = await Promise.all([
    userObjectIds.length
      ? db
          .collection<UserDoc>("users")
          .find(
            { _id: { $in: userObjectIds } },
            { projection: { username: 1, name: 1, imageUrl: 1, isVerified: 1 } },
          )
          .toArray()
      : [],
    roomObjectIds.length
      ? db
          .collection("rooms")
          .find({ _id: { $in: roomObjectIds } }, { projection: { name: 1 } })
          .toArray()
      : [],
  ]);
  const userMap = new Map(users.map((user) => [String(user._id), user]));
  const roomMap = new Map(rooms.map((room) => [String(room._id), String(room.name ?? "")]));

  return posts
    .map((post) => cardOf(indexById.get(String(post._id)) ?? { postId: post._id }, post, userMap, roomMap, comments, viewerId))
    .filter((post): post is PublicPost => post !== null);
}

async function hydrate(rows: IndexDoc[], comments: "all" | "preview" | "none", viewerId?: string | null): Promise<PublicPost[]> {
  const db = await getDb();
  const indexById = new Map<string, IndexDoc>();
  const postIds: ObjectId[] = [];
  for (const row of rows) {
    const id = asObjectId(row.postId);
    if (!id) continue;
    postIds.push(id);
    indexById.set(String(id), row);
  }
  if (!postIds.length) return [];

  const found = await db
    .collection<PostDoc>("room_messages")
    .find({ _id: { $in: postIds } })
    .toArray();
  const byId = new Map(found.map((post) => [String(post._id), post]));
  const ordered = postIds
    .map((id) => byId.get(String(id)))
    .filter((post): post is NonNullable<typeof post> => post !== undefined);
  return decorate(ordered, comments, indexById, viewerId);
}

export type PostPage = {
  posts: PublicPost[];
  cursor: string | null;
};

function encodeCursor(post: PostDoc) {
  const createdAt = post.createdAt ? new Date(post.createdAt).toISOString() : new Date(0).toISOString();
  return `${createdAt}|${String(post._id)}`;
}

function decodeCursor(cursor: string) {
  const split = cursor.lastIndexOf("|");
  if (split <= 0) return null;
  const createdAt = new Date(cursor.slice(0, split));
  const id = asObjectId(cursor.slice(split + 1));
  if (!id || Number.isNaN(createdAt.getTime())) return null;
  return { createdAt, id };
}

const SEARCH_MIN = 2;
const SEARCH_MAX = 80;

export function cleanQuery(value: string) {
  return value.trim().slice(0, SEARCH_MAX);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listMessages(
  extra: Document,
  cursor: string | null | undefined,
  withPinned: boolean,
  viewerId?: string | null,
): Promise<PostPage> {
  const db = await getDb();
  const messages = db.collection<PostDoc>("room_messages");
  const decoded = cursor ? decodeCursor(cursor) : null;
  if (cursor && !decoded) return { posts: [], cursor: null };

  const older = decoded
    ? {
        $or: [
          { createdAt: { $lt: decoded.createdAt } },
          { createdAt: decoded.createdAt, _id: { $lt: decoded.id } },
        ],
      }
    : {};
  const [pinned, recent] = await Promise.all([
    withPinned && !decoded
      ? messages.find({ ...liveMatch, ...extra, feedPinnedByAdmin: true }).sort({ createdAt: -1, _id: -1 }).toArray()
      : Promise.resolve([]),
    messages
      .find({
        ...liveMatch,
        ...extra,
        ...(withPinned ? { feedPinnedByAdmin: { $ne: true } } : {}),
        ...older,
      })
      .sort({ createdAt: -1, _id: -1 })
      .limit(HOME_LIMIT + 1)
      .toArray(),
  ]);
  const hasMore = recent.length > HOME_LIMIT;
  const page = hasMore ? recent.slice(0, HOME_LIMIT) : recent;
  const last = page[page.length - 1];
  return {
    posts: await decorate([...pinned, ...page], "none", new Map(), viewerId),
    cursor: hasMore && last ? encodeCursor(last) : null,
  };
}

export async function listPublicPosts(cursor?: string | null, viewerId?: string | null): Promise<PostPage> {
  return listMessages({}, cursor, true, viewerId);
}

export async function searchPublicPosts(query: string, cursor?: string | null, viewerId?: string | null): Promise<PostPage> {
  const q = cleanQuery(query);
  if (q.length < SEARCH_MIN) return { posts: [], cursor: null };
  return listMessages({ text: { $regex: escapeRegex(q), $options: "i" } }, cursor, false, viewerId);
}

export async function listChannelPosts(roomId: string, cursor?: string | null, viewerId?: string | null): Promise<PostPage> {
  const id = asObjectId(roomId);
  if (!id) return { posts: [], cursor: null };
  return listMessages({ roomId: { $in: [String(id), id] } }, cursor, false, viewerId);
}

export async function createPost(input: { roomId: string; senderId: string; text: string }): Promise<PublicPost | null> {
  const senderId = asObjectId(input.senderId);
  const roomId = asObjectId(input.roomId);
  if (!senderId || !roomId) return null;
  const db = await getDb();
  const room = await db.collection("rooms").findOne(
    { _id: roomId, deletedAt: null, deletedBy: null },
    { projection: { name: 1 } },
  );
  if (!room || !String(room.name ?? "").trim()) return null;

  const now = new Date();
  const inserted = await db.collection<PostDoc>("room_messages").insertOne({
    roomId: String(roomId),
    senderId: String(senderId),
    text: input.text,
    createdAt: now,
    updatedAt: now,
    likes: [],
    sharesBy: [],
    comments: [],
    deletedAt: null,
    deletedBy: null,
    attachments: [],
    reportedBy: [],
    isPinned: false,
    options: null,
    savedBy: [],
    pinnedBy: [],
    feedPinnedByAdmin: false,
    engagementScore: 0,
    trendingScore: 0,
    scoreUpdatedAt: null,
  });
  const post = await db.collection<PostDoc>("room_messages").findOne({ _id: inserted.insertedId });
  if (!post) return null;
  const [card] = await decorate([post], "none", new Map());
  return card ?? null;
}

async function presentMessage(message: PostDoc, viewerId?: string | null) {
  const id = asObjectId(message._id);
  if (!id) return null;
  const db = await getDb();
  const values = postIdValues(String(id));
  const row = values
    ? await db.collection<IndexDoc>(TIER1).findOne({ postId: { $in: values }, ...publicFilter })
    : null;
  const indexById = new Map<string, IndexDoc>();
  if (row && isPublicDecision(row)) indexById.set(String(id), row);
  const [post] = await decorate([message], "all", indexById, viewerId);
  return post ?? null;
}

export async function getPostSlug(postId: string) {
  const id = asObjectId(postId);
  if (!id) return null;
  const db = await getDb();
  const message = await db.collection<PostDoc>("room_messages").findOne(
    { _id: id, ...liveMatch },
    { projection: { slug: 1 } },
  );
  const slug = String(message?.slug ?? "").trim().toLowerCase();
  return slug || null;
}

export const getPublicPostBySlug = cache(async (slug: string, viewerId?: string | null) => {
  const clean = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean)) return null;
  const db = await getDb();
  const message = await db.collection<PostDoc>("room_messages").findOne({ slug: clean, ...liveMatch });
  if (!message) return null;
  return presentMessage(message, viewerId);
});

export const getPublicPost = cache(async (postId: string, viewerId?: string | null) => {
  const id = asObjectId(postId);
  if (!id) return null;
  const db = await getDb();
  const message = await db.collection<PostDoc>("room_messages").findOne({ _id: id, ...liveMatch });
  if (!message) return null;
  return presentMessage(message, viewerId);
});

export async function listRelatedPosts(post: PublicPost, viewerId?: string | null) {
  const values = postIdValues(post.postId);
  if (!values) return [];
  const db = await getDb();
  const tagClauses = [
    ...(post.examTags.length ? [{ "decision.exam_tags": { $in: post.examTags } }] : []),
    ...(post.subjectTags.length ? [{ "decision.subject_tags": { $in: post.subjectTags } }] : []),
  ];
  const tags = tagClauses.length > 0;
  const filter = tags
    ? {
        ...publicFilter,
        postId: { $nin: values },
        $or: tagClauses,
      }
    : { ...publicFilter, postId: { $nin: values } };
  const sort: Sort = tags
    ? { "decision.priority_score": -1, indexedAt: -1 }
    : { indexedAt: -1 };
  const rows = await db
    .collection<IndexDoc>(TIER1)
    .find(filter)
    .sort(sort)
    .limit(RELATED_LIMIT + 6)
    .toArray();
  const posts = await hydrate(rows, "none", viewerId);
  return posts.filter((item) => item.postId !== post.postId).slice(0, RELATED_LIMIT);
}

export async function listSitemapPosts() {
  const db = await getDb();
  const rows = await db
    .collection<IndexDoc>(TIER1)
    .find(publicFilter, { projection: { postId: 1 } })
    .sort({ indexedAt: -1 })
    .limit(SITEMAP_LIMIT)
    .toArray();
  const posts = await hydrate(rows, "none");
  return posts.map((post) => ({
    postId: post.postId,
    slug: post.slug,
    text: post.text,
    createdAt: post.createdAt,
  }));
}
