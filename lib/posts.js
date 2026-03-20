import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const slug =
      data.slug || (data.title ? slugify(data.title) : fileName.replace(/\.md$/, ""));

    return {
      slug,
      ...data,
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPostBySlug(slug) {
  const fileNames = fs.readdirSync(postsDirectory);

  for (const fileName of fileNames) {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const currentSlug =
      data.slug || (data.title ? slugify(data.title) : fileName.replace(/\.md$/, ""));

    if (currentSlug === slug) {
      const processedContent = await remark().use(html).process(content);

      return {
        slug: currentSlug,
        contentHtml: processedContent.toString(),
        ...data,
      };
    }
  }

  return null;
}