import { getAllPosts } from "../lib/posts";

const SITE_URL = "https://deinedomain.de"; // 🔴 CHANGE THIS

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  ${posts
    .map(
      (post) => `
    <url>
      <loc>${SITE_URL}/blog/${post.slug}</loc>
      <lastmod>${new Date(post.date).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join("")}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const posts = getAllPosts();

  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
