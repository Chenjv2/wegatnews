import { getAllPosts, getPostBySlug } from "../../lib/posts";
import Link from "next/link";
import Head from "next/head";

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} | Dein Seitenname</title>

        <meta
          name="description"
          content={post.preview || post.title}
        />

        {/* Open Graph / Social */}
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.preview || post.title}
        />
        <meta property="og:type" content="article" />

        {post.image && (
          <meta property="og:image" content={post.image} />
        )}
      </Head>

      <article className="post">
        <div className="post-container">
          <div className="image-or-text">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="post-image"
              />
            )}
          </div>

          <div className="image-or-text">
            <h1 className="post-title">{post.title}</h1>
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </div>
        </div>

        <p>{post.author}</p>
        <small>Bildquelle: {post.image_source}</small>
        <p></p>

        <Link href="/">Zurück zur Homepage</Link>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  return {
    props: { post },
  };
}
