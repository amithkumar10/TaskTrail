import { connectDB } from "@/app/lib/mongo";

export async function POST(req: Request) {

    const db = await connectDB();

    const { username, password, role} = await req.json(); 

    const user = await db.collection("users").findOne({ username});

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (user.password !== password) {
        return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (user.role !== role) {
        return Response.json({ message: "Role mismatch" }, { status: 403 });
    }

    return Response.json({
        message: "Login successful",
        username: user.username,
        role: user.role,
        userId: user._id
    });
}