import { connectDB } from "@/app/lib/mongo";

export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const { date, status, userId } = await req.json();

    if (!date || !status || !userId) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const validStatuses = ["Full Day", "WFH", "Half Day", "Leave"];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    // ✅ Store as Date object (CRITICAL FIX)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // ✅ Duplicate check aligned with Date type
    const existing = await db.collection("attendance").findOne({
      userId,
      date: normalizedDate,
    });

    if (existing) {
      return Response.json(
        { message: "Attendance already marked" },
        { status: 409 }
      );
    }

    const result = await db.collection("attendance").insertOne({
      userId,
      date: normalizedDate,
      status,
      createdAt: new Date(),
    });

    return Response.json({
      message: "Attendance added successfully",
      attendanceId: result.insertedId,
    });

  } catch (error) {
    console.error("Error adding attendance:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const db = await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    if (!userId || !date) {
      return Response.json(
        { message: "Missing userId or date" },
        { status: 400 }
      );
    }

    const baseDate = new Date(date);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    // ✅ Correct query (Date vs Date)
    const records = await db.collection("attendance").find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).toArray();

    // ✅ Map day → status
    const attendanceMap: Record<number, string> = {};

    records.forEach((rec: any) => {
      const day = new Date(rec.date).getDate();
      attendanceMap[day] = rec.status;
    });

    const totalDays = endDate.getDate();

    // ✅ Final expected output
    const result: string[] = [];

    for (let i = 1; i <= totalDays; i++) {
      result.push(attendanceMap[i] || "Leave"); // default fallback
    }

    return Response.json({
      success: true,
      days: totalDays,
      data: result,
    });

  } catch (error) {
    console.error("Error fetching attendance:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}