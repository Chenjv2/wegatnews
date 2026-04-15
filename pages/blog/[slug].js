import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "../../lib/posts";
import PostHead from "../../components/seo/PostHead";

export default function Post({ post }) {
  return (
    <>
      <PostHead post={post} />

      <article className="post">
        <div className="post-container">
          <div className="image-or-text">
            {post.image ? (
              <img src={post.image} alt={post.title} className="post-image" />
            ) : null}
          </div>

          <div className="image-or-text">
            <h1 className="post-title">{post.title}</h1>
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </div>
        </div>

        <div className="post-meta-block">
          <p>{post.author}</p>
          <small>Bildquelle: {post.image_source}</small>
        </div>

        <Link href="/">Zurück zur Homepage</Link>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const slugs = getAllPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
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

