import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const db = await connectDB();

    // ── 1. Compute current week range (Mon → Sun) ──────────────────────────
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(today);
    start.setDate(today.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    // ── 2. Fetch all interns ───────────────────────────────────────────────
    const users = await db
      .collection("users")
      .find(
        { role: "Intern" }, // optional: filter only interns
        { projection: { _id: 1, name: 1, project: 1 } } // ← "project" not "projectName"
      )
      .toArray();

    if (users.length === 0) {
      return NextResponse.json({ message: "No interns found" });
    }

    // ── 3. Fetch all completed tasks — userId is stored as a STRING in tasks
    const userIdStrings = users.map((u) => u._id.toString()); // ✅ match the string type

    const allTasks = await db
      .collection("tasks")
      .find(
        {
          userId: { $in: userIdStrings }, // ✅ now string vs string — will match
          status: "completed",
          createdAt: { $gte: start, $lte: end },
        },
        { projection: { name: 1, userId: 1, _id: 0 } }
      )
      .toArray();

    // ── 4. Group tasks by userId ───────────────────────────────────────────
    const tasksByUser: Record<string, string[]> = {};

    for (const task of allTasks) {
      const key = task.userId; 
      if (!tasksByUser[key]) tasksByUser[key] = [];
      tasksByUser[key].push(task.name);
    }

    // ── 5. Build email sections per intern ────────────────────────────────
    const internSections = users
      .map((user) => {
        const tasks = tasksByUser[user._id.toString()] ?? [];

        const taskRows =
          tasks.length > 0
            ? tasks
                .map(
                  (taskName, i) => `
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e0e0e0;text-align:center;color:#555;">${i + 1}</td>
                    <td style="padding:8px 12px;border:1px solid #e0e0e0;color:#333;">${taskName}</td>
                  </tr>`
                )
                .join("")
            : `<tr>
                <td colspan="2" style="padding:10px;border:1px solid #e0e0e0;text-align:center;color:#aaa;font-style:italic;">
                  No tasks completed this week
                </td>
               </tr>`;

        return `
          <div style="margin-bottom:36px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#2c3e50;">
                  <td colspan="2" style="padding:12px 16px;">
                    <span style="color:#fff;font-size:15px;font-weight:bold;">${user.name}</span>
                    <span style="color:#95a5a6;font-size:13px;margin-left:10px;">— ${user.project ?? "Unassigned"}</span>
                    <span style="float:right;color:#ecf0f1;font-size:12px;margin-top:2px;">
                      ${tasks.length} task${tasks.length !== 1 ? "s" : ""} completed
                    </span>
                  </td>
                </tr>
                <tr style="background:#f7f7f7;">
                  <th style="padding:8px 12px;border:1px solid #e0e0e0;width:40px;color:#666;">#</th>
                  <th style="padding:8px 12px;border:1px solid #e0e0e0;text-align:left;color:#666;">Task Name</th>
                </tr>
              </thead>
              <tbody>${taskRows}</tbody>
            </table>
          </div>`;
      })
      .join("");

    // ── 6. Totals ──────────────────────────────────────────────────────────
    const totalTasks = allTasks.length;
    const activeInterns = users.filter(
      (u) => (tasksByUser[u._id.toString()]?.length ?? 0) > 0
    ).length;

    const weekLabel = `${start.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })} – ${end.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;

    // ── 7. Send email ──────────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TaskTrail" <${process.env.EMAIL_USER}>`,
      to: "amith10mnr@gmail.com",
      subject: `Weekly Intern Report — ${weekLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#333;">
          <img src="https://sst-task-trail.vercel.app/TaskTrail-Logo.png" alt="TaskTrail"
            style="display:block;margin:24px auto 0;max-width:180px;width:100%;" />
          <h2 style="color:#2c3e50;margin-top:20px;">Weekly Intern Task Report</h2>
          <p><b>Hello,</b><br/><br/>Here is the <b>summary of tasks completed this week</b> across all interns.</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;background:#eaf4fb;">
            <tr>
              <td style="padding:12px 16px;border-right:1px solid #cde6f5;">
                <div style="font-size:11px;color:#7f8c8d;text-transform:uppercase;">Week</div>
                <div style="font-size:14px;font-weight:bold;color:#2c3e50;">${weekLabel}</div>
              </td>
              <td style="padding:12px 16px;border-right:1px solid #cde6f5;">
                <div style="font-size:11px;color:#7f8c8d;text-transform:uppercase;">Total Interns</div>
                <div style="font-size:14px;font-weight:bold;color:#2c3e50;">${users.length}</div>
              </td>
              <td style="padding:12px 16px;border-right:1px solid #cde6f5;">
                <div style="font-size:11px;color:#7f8c8d;text-transform:uppercase;">Active This Week</div>
                <div style="font-size:14px;font-weight:bold;color:#27ae60;">${activeInterns}</div>
              </td>
              <td style="padding:12px 16px;">
                <div style="font-size:11px;color:#7f8c8d;text-transform:uppercase;">Tasks Completed</div>
                <div style="font-size:14px;font-weight:bold;color:#2980b9;">${totalTasks}</div>
              </td>
            </tr>
          </table>

          ${internSections}

          <p style="margin-top:20px;font-size:12px;color:#999;">
            For a detailed view, visit the <a href="https://sst-task-trail.vercel.app/dashboard" style="color:#3498db;text-decoration:none;">TaskTrail Dashboard</a>.
          </p>
          <p style="font-size:12px;color:#999;"><b>Note:</b> This is an automated weekly report generated by TaskTrail.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Weekly report sent successfully",
      meta: { week: weekLabel, totalInterns: users.length, activeInterns, totalTasksCompleted: totalTasks },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}