import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let db;

export async function connectToDatabase() {
  if (!client || !db) {
    client = await MongoClient.connect(uri);
    db = client.db("evaluations");
  }
  return { db };
}
