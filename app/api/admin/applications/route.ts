import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
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
