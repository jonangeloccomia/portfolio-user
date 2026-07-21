import { MongoClient } from "mongodb";
import { env } from "@/config/env";

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(env.MONGODB_URI);

export const mongoClientPromise: Promise<MongoClient> =
  global.mongoClientPromise ?? client.connect();

global.mongoClientPromise = mongoClientPromise;
