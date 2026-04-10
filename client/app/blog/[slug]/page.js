import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBlogBySlug } from "@/lib/blogApi";
import { markdownToHtml } from "@/lib/blogContent";
import BlogTableOfContents from "@/components/BlogTableOfContents";
import { blogPosts, getBlogPostBySlug } from "../posts";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function formatPublishedDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatReadTime(value) {
  if (typeof value === "string" && value.includes("min read")) {
    return value;
  }

  return `${value || 0} min read`;
}

function normalizeFallbackPost(post) {
  if (!post) {
    return null;
  }

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tag: post.category,
    publishDate: post.publishedAt,
    readTime: post.readTime,
    image: post.image,
    imageAlt: post.imageAlt,
    author: post.author,
    content: post.sections
      ? [post.title, ...post.sections.flatMap((section) => ["", `## ${section.heading}`, ...section.paragraphs, ""])]
          .join("\n")
      : String(post.excerpt || ""),
  };
}

async function loadBlogPost(slug) {
  try {
    return await getPublishedBlogBySlug(slug);
  } catch {
    return normalizeFallbackPost(getBlogPostBySlug(slug));
  }
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = await loadBlogPost(resolvedParams?.slug);

  if (!post) {
    notFound();
  }

  const heroImage = post.featuredImage || post.image;

  return (
    <main className={styles.root}>
      <div className={styles.heroBackdrop}>
        <img src={heroImage} alt={post.title} className={styles.heroImage} />
        <div className={styles.heroFade} />
      </div>

      <div className={styles.frame}>
        <article className={styles.article}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>{post.title}</span>
          </nav>

          <header className={styles.header}>
            <p className={styles.category}>{post.tag}</p>
            <h1>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>

            <div className={styles.metaRow}>
              <div className={styles.authorRow}>
                {post.author?.avatar ? (
                  <img src={post.author.avatar} alt={post.author?.name} className={styles.authorAvatar} />
                ) : (
                  <div className={styles.authorFallback}>{String(post.author?.name || "I").slice(0, 1)}</div>
                )}
                <span>{post.author?.name || "Indev Team"}</span>
              </div>
              <span>{formatPublishedDate(post.publishDate)}</span>
              <span>{formatReadTime(post.readTime)}</span>
            </div>
          </header>

          <div className={styles.content}>
            <article
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
            />
          </div>
        </article>

        <BlogTableOfContents markdown={post.content} />
      </div>
    </main>
  );
}
