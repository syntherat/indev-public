import Link from "next/link";
import { getPublishedBlogs } from "@/lib/blogApi";
import { blogPosts } from "./posts";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function formatPublishedDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function normalizeFallbackPost(post) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tag: post.category,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    image: post.image,
    imageAlt: post.imageAlt,
    author: post.author,
  };
}

async function loadBlogPosts() {
  try {
    const blogs = await getPublishedBlogs({ limit: 12 });

    return blogs.map((blog) => ({
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      tag: blog.tag,
      publishedAt: formatPublishedDate(blog.publishDate),
      readTime: `${blog.readTime} min read`,
      image: blog.featuredImage,
      imageAlt: `${blog.title} cover image`,
      author: blog.author,
    }));
  } catch {
    return blogPosts.map(normalizeFallbackPost);
  }
}

export default async function BlogPage() {
  const posts = await loadBlogPosts();

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
        {posts.length === 0 ? (
          <div className={styles.comingSoon}>
            <h2>Blogs are coming soon</h2>
            <p>We're working on some great content. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <article key={post.slug} className={styles.postCard}>
                <Link href={`/blog/${post.slug}`} className={styles.mediaLink}>
                  <img src={post.image} alt={post.imageAlt} className={styles.media} loading="lazy" />
                </Link>

                <div className={styles.postBody}>
                  <p className={styles.metaTop}>{post.tag}</p>
                  <h2>
                    <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>

                  <div className={styles.authorRow}>
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} alt={post.author.name} className={styles.authorAvatar} />
                    ) : null}
                    <div>
                      <p className={styles.authorName}>{post.author?.name || "Indev Team"}</p>
                      <div className={styles.metaBottom}>
                        <span>{post.publishedAt}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
