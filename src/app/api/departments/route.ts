import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";

/**
 * GET /api/departments
 * Returns all departments sorted by name.
 */
export async function GET() {
  try {
    const db = await connectDB();
    const departments = await db
      .collection("departments")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(departments);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/departments
 * Creates a new department.
 * Body: { name, description?, color }
 */
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    const result = await db.collection("departments").insertOne({
      name: body.name.trim(),
      description: body.description?.trim() || "",
      color: body.color || "#6366f1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Department created", departmentId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create department" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/departments
 * Deletes a department and cascades to its modules, tasks, and assignments.
 * Body: { departmentId }
 */
export async function DELETE(req: NextRequest) {
  try {
    const db = await connectDB();
    const { departmentId } = await req.json();

    if (!departmentId || !ObjectId.isValid(departmentId)) {
      return NextResponse.json(
        { error: "Valid departmentId is required" },
        { status: 400 }
      );
    }

    // Cascade delete: assignments → tasks → modules → department
    await db
      .collection("task_assignments")
      .deleteMany({ departmentId });
    await db.collection("kb_tasks").deleteMany({ departmentId });
    await db.collection("modules").deleteMany({ departmentId });
    await db
      .collection("departments")
      .deleteOne({ _id: new ObjectId(departmentId) });

    return NextResponse.json({ message: "Department deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete department" },
      { status: 500 }
    );
  }
}
