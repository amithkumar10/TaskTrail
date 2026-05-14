import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";

/**
 * GET /api/modules?departmentId=xxx
 * Returns all modules for a department, sorted by name.
 */
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");

    const query: any = {};
    if (departmentId) query.departmentId = departmentId;

    const modules = await db
      .collection("modules")
      .find(query)
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(modules);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/modules
 * Creates a new module inside a department.
 * Body: { departmentId, name, description? }
 */
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();

    if (!body.departmentId || !body.name?.trim()) {
      return NextResponse.json(
        { error: "departmentId and module name are required" },
        { status: 400 }
      );
    }

    const result = await db.collection("modules").insertOne({
      departmentId: body.departmentId,
      name: body.name.trim(),
      description: body.description?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Module created", moduleId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create module" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/modules
 * Deletes a module and cascades to its tasks and assignments.
 * Body: { moduleId }
 */
export async function DELETE(req: NextRequest) {
  try {
    const db = await connectDB();
    const { moduleId } = await req.json();

    if (!moduleId || !ObjectId.isValid(moduleId)) {
      return NextResponse.json(
        { error: "Valid moduleId is required" },
        { status: 400 }
      );
    }

    // Cascade: assignments → tasks → module
    await db
      .collection("task_assignments")
      .deleteMany({ moduleId });
    await db.collection("kb_tasks").deleteMany({ moduleId });
    await db
      .collection("modules")
      .deleteOne({ _id: new ObjectId(moduleId) });

    return NextResponse.json({ message: "Module deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete module" },
      { status: 500 }
    );
  }
}
