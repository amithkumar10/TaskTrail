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

    const existing = await db.collection("attendance").findOne({
      userId,
      date: date,
    });

    if (existing) {
      return Response.json(
        { message: "Attendance already marked" },
        { status: 409 }
      );
    }

    const result = await db.collection("attendance").insertOne({
      userId,
      date: date,
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
    const date = searchParams.get("date"); // "YYYY-MM-DD"

    if (!userId || !date) {
      return Response.json(
        { message: "Missing userId or date" },
        { status: 400 }
      );
    }

    // Extract year & month from input date
    const [year, month] = date.split("-");

    const startDate = `${year}-${month}-01`;

    const endDay = new Date(Number(year), Number(month), 0).getDate();
    const endDate = `${year}-${month}-${String(endDay).padStart(2, "0")}`;

    // ✅ String-based query
    const records = await db.collection("attendance").find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).toArray();

    // Map day → status
    const attendanceMap: Record<number, string> = {};

    records.forEach((rec: any) => {
      const day = parseInt(rec.date.split("-")[2]);
      attendanceMap[day] = rec.status;
    });

    const totalDays = endDay;

    const result: string[] = [];

    for (let i = 1; i <= totalDays; i++) {
      result.push(attendanceMap[i] || "Leave");
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