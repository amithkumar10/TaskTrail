import dns from "node:dns/promises";
import { MongoClient } from "mongodb";

// Use these DNS servers for Node's resolver (set once per process)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGO_URI = "mongodb+srv://amith:Hello%40mith18@mongodb.tyrxhwb.mongodb.net/TaskTrail?appName=MongoDB";
let client: MongoClient;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db("TaskTrail");
}