import Link from "next/link";
import { blogPosts } from "./posts";
import styles from "./page.module.css";

export default function BlogPage() {
  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>The Journal</p>
          <h1 className={styles.title}>
            Handpicked <span>Insights</span>
          </h1>
          <p className={styles.subtitle}>
            Practical notes on building polished software products, shipping faster, and making design systems that
            hold up under real product pressure.
          </p>
        </div>
      </section>

      <section className={styles.postsSection}>
        <div className={styles.postsGrid}>
          {blogPosts.map((post) => (
            <article key={post.slug} className={styles.postCard}>
              <Link href={`/blog/${post.slug}`} className={styles.mediaLink}>
                <img src={post.image} alt={post.imageAlt} className={styles.media} loading="lazy" />
              </Link>

              <div className={styles.postBody}>
                <p className={styles.metaTop}>{post.category}</p>
                <h2>
                  <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                    {post.title}
                  </Link>
                </h2>
                <p className={styles.excerpt}>{post.excerpt}</p>

                <div className={styles.metaBottom}>
                  <span>{post.publishedAt}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
