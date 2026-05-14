import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";

/**
 * GET /api/kb-tasks/search?q=xxx&departmentId=xxx&moduleId=xxx
 * Searches KB tasks by title, description, and tags using regex.
 */
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim();
    const departmentId = searchParams.get("departmentId");
    const moduleId = searchParams.get("moduleId");

    if (!q) {
      return NextResponse.json(
        { error: "Search query 'q' is required" },
        { status: 400 }
      );
    }

    const filter: any = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    };

    if (departmentId) filter.departmentId = departmentId;
    if (moduleId) filter.moduleId = moduleId;

    const results = await db
      .collection("kb_tasks")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
