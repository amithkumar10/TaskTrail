// app/api/send-credentials/route.js
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "gmail", // swap for your provider e.g. "outlook", or use host/port for custom SMTP
  auth: {
    user: process.env.EMAIL_USER,   // e.g. noreply@tasktrail.com
    pass: process.env.EMAIL_PASS,   // App Password (not your regular password)
  },
});

export async function POST(req) {
  try {
    const { name, email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "Missing required fields: email, username, or password." },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: `"TaskTrail" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your TaskTrail Intern Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background-color: #000; padding: 24px 32px;">
            <h1 style="color: #fff; margin: 0; font-size: 20px; letter-spacing: -0.3px;">TaskTrail</h1>
          </div>

          <!-- Body -->
          <div style="padding: 32px; background-color: #fff;">
            <h2 style="margin: 0 0 8px; font-size: 18px; color: #111;">Welcome aboard, ${name}! 👋</h2>
            <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px;">
              Your intern account has been created. Use the credentials below to sign in.
            </p>

            <!-- Credentials box -->
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px 24px; margin-bottom: 24px;">
              <p style="margin: 0 0 12px; font-size: 13px; color: #374151;">
                <span style="font-weight: 600; color: #111;">Username</span><br/>
                <span style="font-family: monospace; font-size: 14px;">${username}</span>
              </p>
              <p style="margin: 0; font-size: 13px; color: #374151;">
                <span style="font-weight: 600; color: #111;">Password</span><br/>
                <span style="font-family: monospace; font-size: 14px;">${password}</span>
              </p>
            </div>

            <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">
              Please sign in at <a href="https://sst-task-trail.vercel.app" style="color: #3b82f6; text-decoration: none;">Task Trail</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 11px; color: #9ca3af; text-align: center;">
              © ${new Date().getFullYear()} TaskTrail · This is an automated message, please do not reply.
            </p>
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Credentials sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Nodemailer error:", error);
    return NextResponse.json(
      { message: "Failed to send email.", error: error.message },
      { status: 500 }
    );
  }
}