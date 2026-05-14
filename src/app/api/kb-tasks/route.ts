import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";

/**
 * GET /api/kb-tasks?moduleId=xxx  OR  ?departmentId=xxx
 * Returns KB tasks with optional filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);

    const moduleId = searchParams.get("moduleId");
    const departmentId = searchParams.get("departmentId");

    const query: any = {};
    if (moduleId) query.moduleId = moduleId;
    if (departmentId) query.departmentId = departmentId;

    const tasks = await db
      .collection("kb_tasks")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/kb-tasks
 * Creates a new Knowledge Base task.
 */
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();

    if (!body.moduleId || !body.departmentId || !body.title?.trim()) {
      return NextResponse.json(
        { error: "moduleId, departmentId, and title are required" },
        { status: 400 }
      );
    }

    const result = await db.collection("kb_tasks").insertOne({
      moduleId: body.moduleId,
      departmentId: body.departmentId,
      title: body.title.trim(),
      description: body.description?.trim() || "",
      priority: body.priority || "medium",
      difficulty: body.difficulty || "beginner",
      expectedDays: body.expectedDays || 1,
      tags: Array.isArray(body.tags) ? body.tags : [],
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      resources: Array.isArray(body.resources) ? body.resources : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Task created", taskId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/kb-tasks
 * Updates an existing KB task.
 * Body: { taskId, ...fieldsToUpdate }
 */
export async function PUT(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();

    if (!body.taskId || !ObjectId.isValid(body.taskId)) {
      return NextResponse.json(
        { error: "Valid taskId is required" },
        { status: 400 }
      );
    }

    const { taskId, ...updates } = body;

    // Only allow updating specific fields
    const allowed = [
      "title",
      "description",
      "priority",
      "difficulty",
      "expectedDays",
      "tags",
      "attachments",
      "resources",
    ];
    const sanitised: any = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) sanitised[key] = updates[key];
    }
    sanitised.updatedAt = new Date();

    const result = await db
      .collection("kb_tasks")
      .updateOne({ _id: new ObjectId(taskId) }, { $set: sanitised });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update task" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/kb-tasks
 * Deletes a KB task and its assignments.
 * Body: { taskId }
 */
export async function DELETE(req: NextRequest) {
  try {
    const db = await connectDB();
    const { taskId } = await req.json();

    if (!taskId || !ObjectId.isValid(taskId)) {
      return NextResponse.json(
        { error: "Valid taskId is required" },
        { status: 400 }
      );
    }

    await db
      .collection("task_assignments")
      .deleteMany({ kbTaskId: taskId });
    await db
      .collection("kb_tasks")
      .deleteOne({ _id: new ObjectId(taskId) });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}
