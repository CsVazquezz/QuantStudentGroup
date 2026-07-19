import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { sendApplicationConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const {
    fullName, email, major, academicStage, technicalLevel,
    interests, desiredRole, campusConfirmed, openSandbox,
  } = body;

  // Server-side validation (mirrors client)
  if (
    typeof fullName      !== "string" || !fullName.trim()                   ||
    typeof email         !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof major         !== "string" || !major                             ||
    typeof academicStage !== "string" || !academicStage                    ||
    typeof openSandbox   !== "string" || openSandbox.trim().length < 50
  ) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  const values: (string | number)[] = [
    String(fullName).trim(),
    String(email).toLowerCase().trim(),
    String(major),
    String(academicStage),
    Number(technicalLevel) || 0,
    JSON.stringify(Array.isArray(interests) ? interests : []),
    String(desiredRole ?? ""),
    campusConfirmed ? 1 : 0,
    String(openSandbox).trim(),
  ];

  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO applications
         (full_name, email, major, academic_stage, technical_level,
          interests, desired_role, campus_confirmed, open_sandbox)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values,
    );

    // Fire-and-forget confirmation. We don't fail the request if Resend is
    // down or misconfigured — the application is already saved.
    sendApplicationConfirmation({
      name:  values[0] as string,
      email: values[1] as string,
    }).catch(err => console.error("[api/apply] email send failed", err));

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "duplicate_email" }, { status: 409 });
    }
    console.error("[api/apply]", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  } finally {
    await conn.destroy();
  }
}
