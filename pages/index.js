import Link from "next/link";
import { getAllPosts } from "../lib/posts";

export async function getStaticProps() {
  const posts = getAllPosts();

  return {
    props: {
      newestPosts: posts.slice(0, 8),
      archivePosts: posts.slice(8),
    },
  };
}

function DisplayContainer({ data }) {
  return (
    <div className="blog-container">
      {data.map((post) => (
        <div key={post.slug} className="blog-entry">
          <img src={post.image} alt="blog-foto" />
          <h3>{post.title}</h3>
          <p>{post.preview}...</p>

          <div className="meta">
            {post.date} · {post.author}
          </div>

          <Link href={`/blog/${post.slug}`}>Weiterlesen</Link>
        </div>
      ))}
    </div>
  );
}

function NewestPosts({ posts }) {
  return (
    <section className="blog-section">
      <DisplayContainer data={posts.slice(0, 4)} />
      <DisplayContainer data={posts.slice(4)} />
    </section>
  );
}

export default function Blog({ newestPosts, archivePosts }) {
  return (
    <>
      {/* Welcome text */}
      <div className="welcome-container">
        <h2 className="welcome">
          Willkommen auf wegatnews, der digitalen Schülerzeitung am Altenforst.
        </h2>
      </div>

      {/* Newest blog posts */}
      <NewestPosts posts={newestPosts} />

      {/* Contact section */}
      <section>
        <div className="image-or-text">
          <h2>Ideen, Artikel, Probleme, Fragen?</h2>
          <p>
            Einfach per Teams oder E-Mail an Vincent Cui,
            vincent.cui@altenforst.de
          </p>
          <p>
            Wir treffen uns jeden Donnerstag in der Mittagspause vor den
            Computerräumen.
          </p>
          <p>Komm doch einfach mal vorbei!</p>
        </div>
      </section>

      {/* Archive */}
      <section>
        <h1 className="archiv">Archiv</h1>
        <ul className="archiv">
          {archivePosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link> {post.date}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}