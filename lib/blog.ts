export type BlogPost = {
  id: number;
  slug: string;
  author: string;
  title: { en: string; es: string };
  excerpt: { en: string; es: string };
  content: { en: string; es: string }; // markdown
  publishedAt: string; // ISO
};

export type BlogPostRow = {
  id: number;
  slug: string;
  author: string;
  title_en: string;
  title_es: string;
  excerpt_en: string;
  excerpt_es: string;
  content_en: string;
  content_es: string;
  published_at: string;
};

export function mapRow(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    author: row.author,
    title: { en: row.title_en, es: row.title_es },
    excerpt: { en: row.excerpt_en, es: row.excerpt_es },
    content: { en: row.content_en, es: row.content_es },
    publishedAt: row.published_at,
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
