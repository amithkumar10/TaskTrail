import { MongoClient } from "mongodb";

const uri = "mongodb+srv://amith:Hello%40mith18@mongodb.tyrxhwb.mongodb.net/TaskTrail?appName=MongoDB"
const client = new MongoClient(uri);

export async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db("TaskTrail");
}