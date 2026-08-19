import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const conn = await getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id, full_name, email, major, academic_stage, technical_level,
              interests, desired_role, campus_confirmed, open_sandbox, submitted_at,
              status, accepted_at, email_delivery
       FROM applications
       ORDER BY submitted_at DESC`
    );
    return NextResponse.json({ applications: rows });
  } finally {
    await conn.destroy();
  }
}
