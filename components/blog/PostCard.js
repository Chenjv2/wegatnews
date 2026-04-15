import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="blog-entry">
      <img src={post.image} alt="blog-foto" />
      <h3>{post.title}</h3>
      <p>{post.preview}...</p>

      <div className="meta">
        {post.date} · {post.author}
      </div>

      <Link href={`/blog/${post.slug}`}>Weiterlesen</Link>
    </div>
  );
}
