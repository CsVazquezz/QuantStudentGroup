import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { sendAcceptanceEmail } from "@/lib/email";
import type { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { ids } = (await req.json()) as { ids?: number[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "no_ids" }, { status: 400 });
  }

  const conn = await getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT id, full_name, email, status FROM applications WHERE id IN (?)`,
      [ids]
    );

    const results: Record<number, "sent" | "sent_unrecorded" | "already_accepted" | "not_found" | "failed"> = {};

    for (const id of ids) {
      const app = rows.find(r => r.id === id);
      if (!app) { results[id] = "not_found"; continue; }
      if (app.status === "accepted") { results[id] = "already_accepted"; continue; }

      const sent = await sendAcceptanceEmail({ name: app.full_name, email: app.email });
      if (!sent.ok) { results[id] = "failed"; continue; }

      // The email is already out — never report this as "failed", or a retry
      // would send it twice. Flag it so the admin can fix the row by hand.
      try {
        await conn.execute(
          `UPDATE applications
           SET status = 'accepted', accepted_at = NOW(), resend_email_id = ?, email_delivery = 'sent'
           WHERE id = ?`,
          [sent.id ?? null, id]
        );
        results[id] = "sent";
      } catch (err) {
        console.error("[api/admin/accept] email sent but DB update failed", id, err);
        results[id] = "sent_unrecorded";
      }
    }

    return NextResponse.json({ results });
  } finally {
    await conn.destroy();
  }
}
