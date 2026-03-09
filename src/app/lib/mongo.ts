import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://amith:Hello%40mith18@mongodb.tyrxhwb.mongodb.net/TaskTrail?appName=MongoDB";
let client: MongoClient;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db("TaskTrail");
}