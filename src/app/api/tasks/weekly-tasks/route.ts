import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongo";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const db = await connectDB();

    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(today);
    start.setDate(today.getDate() + diffToMonday);
    start.setHours(0,0,0,0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23,59,59,999);

    const tasks = await db
      .collection("tasks")
      .find(
        { status:"completed", createdAt:{ $gte:start, $lte:end }},
        { projection:{ name:1, _id:0 }}
      )
      .toArray();

    const names = tasks.map(t=>t.name);

    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:"amith10mnr@gmail.com",
      subject:"Weekly Task Report",
      text:`Completed Tasks:\n\n${names.join("\n")}`
    });

    return NextResponse.json({message:"Report sent"});
  } catch(error:any){
    return NextResponse.json({error:error.message},{status:500});
  }
}