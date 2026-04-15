import Link from "next/link";

export default function ArchiveList({ posts }) {
  return (
    <ul className="archiv">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link> {post.date}
        </li>
      ))}
    </ul>
  );
}
