import { cache } from "react";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";

export type PublicChannel = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  memberCount: number;
};

export async function listChannels(): Promise<PublicChannel[]> {
  const db = await getDb();
  const rows = await db
    .collection("rooms")
    .aggregate<{ _id: unknown; name?: string; description?: string; imageUrl?: string; memberCount?: number }>([
      { $match: { deletedAt: null, deletedBy: null } },
      {
        $addFields: {
          sortOrder: {
            $convert: { input: { $ifNull: ["$order", 100] }, to: "double", onError: 100, onNull: 100 },
          },
          memberCount: { $size: { $ifNull: ["$participants", []] } },
        },
      },
      { $sort: { sortOrder: 1, _id: 1 } },
      { $project: { name: 1, description: 1, imageUrl: 1, memberCount: 1 } },
    ])
    .toArray();

  return rows
    .map((row) => ({
      id: String(row._id),
      name: String(row.name ?? "").trim(),
      description: String(row.description ?? "").trim(),
      imageUrl: String(row.imageUrl ?? "").trim(),
      memberCount: Number(row.memberCount ?? 0),
    }))
    .filter((row) => row.name);
}

export const getChannel = cache(async (id: string): Promise<PublicChannel | null> => {
  if (!ObjectId.isValid(id) || id.length !== 24) return null;
  const db = await getDb();
  const row = await db.collection("rooms").findOne(
    { _id: new ObjectId(id), deletedAt: null, deletedBy: null },
    { projection: { name: 1, description: 1, imageUrl: 1, participants: 1 } },
  );
  const name = String(row?.name ?? "").trim();
  if (!row || !name) return null;
  return {
    id: String(row._id),
    name,
    description: String(row.description ?? "").trim(),
    imageUrl: String(row.imageUrl ?? "").trim(),
    memberCount: Array.isArray(row.participants) ? row.participants.length : 0,
  };
});
