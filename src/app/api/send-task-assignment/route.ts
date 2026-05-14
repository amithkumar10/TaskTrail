import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

/**
 * POST /api/send-task-assignment
 * Sends task assignment emails to selected interns.
 *
 * Body: {
 *   taskIds: string[],
 *   internIds: string[],
 *   departmentName: string,
 *   moduleName: string,
 *   deadlineDays?: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const {
      taskIds,
      internIds,
      departmentName,
      moduleName,
      deadlineDays,
    } = body;

    if (
      !Array.isArray(taskIds) ||
      taskIds.length === 0 ||
      !Array.isArray(internIds) ||
      internIds.length === 0
    ) {
      return NextResponse.json(
        { error: "taskIds and internIds are required" },
        { status: 400 }
      );
    }

    // ── Fetch tasks ──────────────────────────────────────────────────────
    const tasks = await db
      .collection("kb_tasks")
      .find({ _id: { $in: taskIds.map((id: string) => new ObjectId(id)) } })
      .toArray();

    // ── Fetch interns ────────────────────────────────────────────────────
    const interns = await db
      .collection("users")
      .find({ _id: { $in: internIds.map((id: string) => new ObjectId(id)) } })
      .toArray();

    if (tasks.length === 0 || interns.length === 0) {
      return NextResponse.json(
        { error: "No matching tasks or interns found" },
        { status: 404 }
      );
    }

    // ── Build email transporter ──────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const deadlineDate = deadlineDays
      ? new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000)
      : null;

    const deadlineStr = deadlineDate
      ? deadlineDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "No specific deadline";

    // ── Priority colour mapping ──────────────────────────────────────────
    const priorityColor: Record<string, string> = {
      critical: "#dc2626",
      high: "#ea580c",
      medium: "#ca8a04",
      low: "#16a34a",
    };

    const difficultyLabel: Record<string, string> = {
      beginner: "🟢 Beginner",
      intermediate: "🔵 Intermediate",
      advanced: "🟣 Advanced",
    };

    // ── Build task rows HTML ─────────────────────────────────────────────
    const taskRowsHtml = tasks
      .map(
        (t, i) => `
        <tr>
          <td style="padding:10px 14px;border:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px;">${i + 1}</td>
          <td style="padding:10px 14px;border:1px solid #e5e7eb;">
            <div style="font-weight:600;color:#111;font-size:14px;margin-bottom:4px;">${t.title}</div>
            ${t.description ? `<div style="color:#6b7280;font-size:12px;margin-bottom:6px;">${t.description.slice(0, 150)}${t.description.length > 150 ? "…" : ""}</div>` : ""}
            <div style="display:flex;gap:12px;font-size:11px;">
              <span style="color:${priorityColor[t.priority] || "#6b7280"};">● ${(t.priority || "medium").toUpperCase()}</span>
              <span style="color:#6b7280;">${difficultyLabel[t.difficulty] || t.difficulty}</span>
              <span style="color:#6b7280;">⏱ ${t.expectedDays || 1} day(s)</span>
            </div>
          </td>
        </tr>
        ${
          t.resources && t.resources.length > 0
            ? `<tr>
                <td style="border:1px solid #e5e7eb;"></td>
                <td style="padding:8px 14px;border:1px solid #e5e7eb;background:#f9fafb;">
                  <div style="font-size:11px;color:#374151;font-weight:600;margin-bottom:4px;">📚 Learning Resources:</div>
                  ${t.resources
                    .map(
                      (r: any) =>
                        `<div style="font-size:12px;margin-bottom:2px;">
                          <a href="${r.url}" style="color:#3b82f6;text-decoration:none;">→ ${r.title}</a>
                          <span style="color:#9ca3af;font-size:10px;margin-left:4px;">(${r.type})</span>
                        </div>`
                    )
                    .join("")}
                </td>
              </tr>`
            : ""
        }
        ${
          t.attachments && t.attachments.length > 0
            ? `<tr>
                <td style="border:1px solid #e5e7eb;"></td>
                <td style="padding:8px 14px;border:1px solid #e5e7eb;background:#fefce8;">
                  <div style="font-size:11px;color:#374151;font-weight:600;margin-bottom:4px;">📎 Attachments:</div>
                  ${t.attachments
                    .map(
                      (url: string) =>
                        `<div style="font-size:12px;margin-bottom:2px;">
                          <a href="${url}" style="color:#3b82f6;text-decoration:none;">→ ${url.length > 60 ? url.slice(0, 60) + "…" : url}</a>
                        </div>`
                    )
                    .join("")}
                </td>
              </tr>`
            : ""
        }`
      )
      .join("");

    // ── Send email to each intern ────────────────────────────────────────
    let sentCount = 0;

    for (const intern of interns) {
      if (!intern.email) continue;

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="background:#000;padding:24px 32px;">
            <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:-0.3px;">TaskTrail</h1>
          </div>
          <div style="padding:28px 32px;background:#fff;">
            <h2 style="margin:0 0 6px;font-size:18px;color:#111;">New Tasks Assigned 📋</h2>
            <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">
              Hi <strong>${intern.name || "Intern"}</strong>, you have been assigned <strong>${tasks.length}</strong> task(s).
            </p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#f0f5ff;border-radius:6px;">
              <tr>
                <td style="padding:12px 16px;border-right:1px solid #dbeafe;">
                  <div style="font-size:10px;color:#6b7280;text-transform:uppercase;">Department</div>
                  <div style="font-size:14px;font-weight:bold;color:#111;">${departmentName || "—"}</div>
                </td>
                <td style="padding:12px 16px;border-right:1px solid #dbeafe;">
                  <div style="font-size:10px;color:#6b7280;text-transform:uppercase;">Module</div>
                  <div style="font-size:14px;font-weight:bold;color:#111;">${moduleName || "—"}</div>
                </td>
                <td style="padding:12px 16px;">
                  <div style="font-size:10px;color:#6b7280;text-transform:uppercase;">Deadline</div>
                  <div style="font-size:14px;font-weight:bold;color:#111;">${deadlineStr}</div>
                </td>
              </tr>
            </table>

            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:8px 14px;border:1px solid #e5e7eb;width:40px;color:#6b7280;font-size:12px;">#</th>
                  <th style="padding:8px 14px;border:1px solid #e5e7eb;text-align:left;color:#6b7280;font-size:12px;">Task Details</th>
                </tr>
              </thead>
              <tbody>
                ${taskRowsHtml}
              </tbody>
            </table>
          </div>
          <div style="background:#f3f4f6;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
              © ${new Date().getFullYear()} TaskTrail · This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"TaskTrail" <${process.env.EMAIL_USER}>`,
          to: intern.email,
          subject: `New Task Assignment — ${departmentName || "TaskTrail"}`,
          html,
        });
        sentCount++;
      } catch (mailErr) {
        console.error(
          `Failed to send email to ${intern.email}:`,
          mailErr
        );
      }
    }

    // ── Mark assignments as emailed ──────────────────────────────────────
    if (sentCount > 0) {
      const emailedInternIds = interns
        .filter((i) => i.email)
        .map((i) => i._id.toString());

      await db.collection("task_assignments").updateMany(
        {
          kbTaskId: { $in: taskIds },
          internId: { $in: emailedInternIds },
        },
        { $set: { emailSent: true } }
      );
    }

    return NextResponse.json({
      message: `Emails sent to ${sentCount} intern(s)`,
      sentCount,
    });
  } catch (error: any) {
    console.error("send-task-assignment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send emails" },
      { status: 500 }
    );
  }
}
