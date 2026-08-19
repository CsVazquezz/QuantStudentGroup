import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conn = await getConnection();
  try {
    await conn.execute(`DELETE FROM blog_posts WHERE id = ?`, [id]);
    return NextResponse.json({ ok: true });
  } finally {
    await conn.destroy();
  }
}
