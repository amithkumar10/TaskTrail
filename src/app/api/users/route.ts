import { connectDB } from "@/app/lib/mongo";

export async function GET() {
  const db = await connectDB();

  const users = await db.collection("users").find({}).toArray();

  return Response.json(users);
}

export async function POST(req: Request) {
  const db = await connectDB();

  const body = await req.json();

  const result = await db.collection("users").insertOne({
    name: body.name,
    username: body.username,
    project: body.project,
    manager: body.manager,
    position: body.position,
    role: body.role,
    password: body.password,
    email: body.email
  });

  return Response.json({
    message: "User added successfully",
    userId: result.insertedId
  });
}