import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { mapRow, type BlogPostRow } from "@/lib/blog";

export async function GET() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id, slug, author, title_en, title_es, excerpt_en, excerpt_es, content_en, content_es, published_at
       FROM blog_posts
       ORDER BY published_at DESC`
    );
    const posts = (rows as BlogPostRow[]).map(mapRow);
    return NextResponse.json({ posts });
  } finally {
    await conn.destroy();
  }
}
