import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { mapRow, type BlogPostRow } from "@/lib/blog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const conn = await getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id, slug, author, title_en, title_es, excerpt_en, excerpt_es, content_en, content_es, published_at
       FROM blog_posts
       WHERE slug = ?
       LIMIT 1`,
      [slug],
    );
    const row = (rows as BlogPostRow[])[0];
    if (!row) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ post: mapRow(row) });
  } finally {
    await conn.destroy();
  }
}
