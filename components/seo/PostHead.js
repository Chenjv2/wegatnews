import Head from "next/head";

export default function PostHead({ post }) {
  const description = post.preview || post.title;
  const url = `https://wegatnews.de/blog/${post.slug}`;
  const image = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `https://wegatnews.de${post.image}`
    : null;

  return (
    <Head>
      <title>{post.title} | WE GAT NEWS</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={post.title} />
      <meta property="og:site_name" content="WE GAT NEWS" />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      {image ? <meta property="og:image" content={image} /> : null}
    </Head>
  );
}
