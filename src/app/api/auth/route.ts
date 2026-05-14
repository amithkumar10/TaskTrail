import { connectDB } from "@/app/lib/mongo";

const ADMIN_USERNAME = "admin@tasktrail.com";

function normalizeRole(role: unknown) {
    const value = typeof role === "string" ? role.trim().toLowerCase() : "";

    if (value === "admin") return "Admin";
    if (value === "employee") return "Employee";
    return "Intern";
}

export async function POST(req: Request) {
    const db = await connectDB();

    const { username, password } = await req.json();
    const normalizedUsername = typeof username === "string" ? username.trim().toLowerCase() : "";

    if (!normalizedUsername || !password) {
        return Response.json({ message: "Username and password are required" }, { status: 400 });
    }

    const user = await db.collection("users").findOne({
        username: normalizedUsername,
    });

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (user.password !== password) {
        return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const resolvedRole = normalizedUsername === ADMIN_USERNAME ? "Admin" : normalizeRole(user.role);

    return Response.json({
        message: "Login successful",
        username: user.username,
        role: resolvedRole,
        userId: user._id
    });
}