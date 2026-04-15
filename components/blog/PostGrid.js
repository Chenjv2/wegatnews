import PostCard from "./PostCard";

export default function PostGrid({ posts }) {
  return (
    <div className="blog-container">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
