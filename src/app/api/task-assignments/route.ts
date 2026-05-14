import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";

/**
 * GET /api/task-assignments?internId=xxx  OR  ?departmentId=xxx
 * Lists task assignments.
 */
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);

    const internId = searchParams.get("internId");
    const departmentId = searchParams.get("departmentId");

    const query: any = {};
    if (internId) query.internId = internId;
    if (departmentId) query.departmentId = departmentId;

    const assignments = await db
      .collection("task_assignments")
      .find(query)
      .sort({ assignedAt: -1 })
      .toArray();

    return NextResponse.json(assignments);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/task-assignments
 * Bulk-assign tasks to interns.
 * Body: { taskIds: string[], internIds: string[], departmentId, moduleId, deadlineDays? }
 *
 * Creates one assignment document for each (task, intern) combination.
 */
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const { taskIds, internIds, departmentId, moduleId, deadlineDays } = body;

    if (
      !Array.isArray(taskIds) ||
      taskIds.length === 0 ||
      !Array.isArray(internIds) ||
      internIds.length === 0
    ) {
      return NextResponse.json(
        { error: "taskIds and internIds arrays are required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const deadline = deadlineDays
      ? new Date(now.getTime() + deadlineDays * 24 * 60 * 60 * 1000)
      : null;

    const docs = [];
    for (const taskId of taskIds) {
      for (const internId of internIds) {
        docs.push({
          kbTaskId: taskId,
          internId,
          departmentId: departmentId || "",
          moduleId: moduleId || "",
          assignedAt: now,
          deadline,
          emailSent: false,
        });
      }
    }

    const result = await db
      .collection("task_assignments")
      .insertMany(docs);

    return NextResponse.json(
      {
        message: "Tasks assigned successfully",
        insertedCount: result.insertedCount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to assign tasks" },
      { status: 500 }
    );
  }
}
