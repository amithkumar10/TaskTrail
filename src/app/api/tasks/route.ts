import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";
import { Task } from "@/app/models/Tasks";


// ADD TASK
export async function POST(req: NextRequest) {
    try {
        const db = await connectDB();

        const body: Task = await req.json();

        const result = await db.collection("tasks").insertOne({
            userId: body.userId,
            name: body.name,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({
            message: "Task created",
            taskId: result.insertedId
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// GET TASKS
export async function GET(req: NextRequest) {
    try {
        const db = await connectDB();

        const { searchParams } = new URL(req.url);

        const userId = searchParams.get("userId");
        const date = searchParams.get("date");

        let query: any = {};

        if (userId) query.userId = userId;
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: start, $lte: end };
        }

        const tasks = await db.collection("tasks").find(query).toArray();

        return NextResponse.json(tasks);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}


// MARK TASK DONE
export async function PATCH(req: NextRequest) {
  try {
    const db = await connectDB();

    const body = await req.json();

    if (!body.taskId || !ObjectId.isValid(body.taskId)) {
      return NextResponse.json(
        { error: "Invalid or missing taskId" },
        { status: 400 }
      );
    }

    if (body.timeSpent !== undefined && typeof body.timeSpent !== "number") {
      return NextResponse.json(
        { error: "timeSpent must be a number (minutes)" },
        { status: 400 }
      );
    }

    const result = await db.collection("tasks").updateOne(
      { _id: new ObjectId(body.taskId) },
      {
        $set: {
          status: "completed",
          ...(body.timeSpent !== undefined && { timeSpent: body.timeSpent }),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Task updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update task" },
      { status: 500 }
    );
  }
}