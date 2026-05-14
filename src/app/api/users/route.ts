import { connectDB } from "@/app/lib/mongo";

function normalizeRole(role: unknown) {
  const value = typeof role === "string" ? role.trim().toLowerCase() : "";

  if (value === "admin") return "Admin";
  if (value === "employee") return "Employee";
  return "Intern";
}

export async function GET() {
  const db = await connectDB();

  const users = await db.collection("users").find({}).toArray();

  return Response.json(users);
}

export async function POST(req: Request) {
  const db = await connectDB();

  const body = await req.json();
  const normalizedUsername = typeof body.username === "string" ? body.username.trim().toLowerCase() : body.username;
  // Ensure project is stored as an array of strings
  const projects = Array.isArray(body.project)
    ? body.project.map((p: any) => String(p))
    : (body.project ? [String(body.project)] : []);

  const result = await db.collection("users").insertOne({
    name: body.name,
    username: normalizedUsername,
    project: projects,
    manager: body.manager,
    position: body.position,
    role: normalizeRole(body.role),
    password: body.password,
    email: body.email
  });

  return Response.json({
    message: "User added successfully",
    userId: result.insertedId
  });
}