import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

function mapDelivery(lastEvent: string | undefined): "delivered" | "bounced" | "sent" {
  if (lastEvent === "delivered") return "delivered";
  if (lastEvent === "bounced" || lastEvent === "complained") return "bounced";
  return "sent";
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "resend_not_configured" }, { status: 500 });
  }

  const conn = await getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT id, resend_email_id FROM applications
       WHERE status = 'accepted' AND resend_email_id IS NOT NULL
         AND (email_delivery IS NULL OR email_delivery = 'sent')`
    );

    const results: Record<number, string> = {};

    for (const row of rows) {
      const res = await fetch(`https://api.resend.com/emails/${row.resend_email_id}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) { results[row.id] = "check_failed"; continue; }

      const data = await res.json();
      const delivery = mapDelivery(data.last_event);
      await conn.execute(`UPDATE applications SET email_delivery = ? WHERE id = ?`, [delivery, row.id]);
      results[row.id] = delivery;
    }

    return NextResponse.json({ checked: rows.length, results });
  } finally {
    await conn.destroy();
  }
}
