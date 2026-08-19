import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { slugify } from "@/lib/blog";

function isAuthorized(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  return !!token && token === process.env.ADMIN_PASSWORD;
}

// Cheap auth check for the admin blog page to verify login state.
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const {
    author, slug: slugInput,
    titleEn, titleEs, excerptEn, excerptEs, contentEn, contentEs,
  } = body;

  if (
    typeof author     !== "string" || !author.trim()     ||
    typeof titleEn    !== "string" || !titleEn.trim()    ||
    typeof titleEs    !== "string" || !titleEs.trim()    ||
    typeof excerptEn  !== "string" || !excerptEn.trim()  ||
    typeof excerptEs  !== "string" || !excerptEs.trim()  ||
    typeof contentEn  !== "string" || !contentEn.trim()  ||
    typeof contentEs  !== "string" || !contentEs.trim()
  ) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  const slug = slugify(
    typeof slugInput === "string" && slugInput.trim() ? slugInput : titleEn,
  );
  if (!slug) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 422 });
  }

  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO blog_posts
         (slug, author, title_en, title_es, excerpt_en, excerpt_es, content_en, content_es)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug, author.trim(),
        titleEn.trim(), titleEs.trim(),
        excerptEn.trim(), excerptEs.trim(),
        contentEn, contentEs,
      ],
    );
    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "duplicate_slug" }, { status: 409 });
    }
    console.error("[api/admin/blog]", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  } finally {
    await conn.destroy();
  }
}
