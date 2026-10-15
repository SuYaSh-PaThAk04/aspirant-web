import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGO_URI;
const analyticsUri = process.env.ANALYTICS_MONGO_URI || uri;
const dbName = process.env.MONGO_DB_NAME || "aspirant-adda";
const analyticsDbName = process.env.ANALYTICS_DB_NAME || "Adda50";

let clientPromise: Promise<MongoClient> | null = null;
let analyticsClientPromise: Promise<MongoClient> | null = null;

async function getClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().catch((error: unknown) => {
      clientPromise = null;
      throw error;
    });
  }
  return clientPromise;
}

async function getAnalyticsClient(): Promise<MongoClient> {
  if (!analyticsUri) {
    throw new Error("MONGO_URI is not set");
  }
  if (!analyticsClientPromise) {
    const client = new MongoClient(analyticsUri, { serverSelectionTimeoutMS: 10000 });
    analyticsClientPromise = client.connect().catch((error: unknown) => {
      analyticsClientPromise = null;
      throw error;
    });
  }
  return analyticsClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(dbName);
}

export async function getAnalyticsDb(): Promise<Db> {
  const client = await getAnalyticsClient();
  return client.db(analyticsDbName);
}
