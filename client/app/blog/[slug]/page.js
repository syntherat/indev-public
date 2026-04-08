import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "../posts";
import styles from "./page.module.css";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }) {
  const post = getBlogPostBySlug(params?.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.root}>
      <article className={styles.article}>
        <Link href="/blog" className={styles.backLink}>
          Back to blog
        </Link>

        <p className={styles.category}>{post.category}</p>
        <h1>{post.title}</h1>

        <div className={styles.metaRow}>
          <span>{post.publishedAt}</span>
          <span>{post.readTime}</span>
        </div>

        <img src={post.image} alt={post.imageAlt} className={styles.heroImage} />

        <div className={styles.content}>
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
