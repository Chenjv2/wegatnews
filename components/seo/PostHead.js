import Head from "next/head";

export default function PostHead({ post }) {
  const description = post.preview || post.title;

  return (
    <Head>
      <title>{post.title} | WE GAT NEWS</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      {post.image ? <meta property="og:image" content={post.image} /> : null}
    </Head>
  );
}
