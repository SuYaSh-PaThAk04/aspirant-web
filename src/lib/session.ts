export const TOKEN_COOKIE = "aa_token";

const idPattern = /^[a-f0-9]{24}$/i;

export type SessionUser = {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
};

function readId(value: unknown): string {
  if (typeof value === "string" && idPattern.test(value)) return value.toLowerCase();
  if (value && typeof value === "object") {
    const oid = (value as { $oid?: unknown }).$oid;
    if (typeof oid === "string" && idPattern.test(oid)) return oid.toLowerCase();
  }
  return "";
}

export function sessionUser(value: unknown): SessionUser {
  const user = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: readId(user._id) || readId(user.id),
    name: typeof user.name === "string" ? user.name.trim() : "",
    username: typeof user.username === "string" ? user.username.trim() : "",
    imageUrl: typeof user.imageUrl === "string" ? user.imageUrl.trim() : "",
  };
}
