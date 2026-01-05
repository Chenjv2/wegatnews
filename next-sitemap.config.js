// next-sitemap.config.js
const { getAllPosts } = require("./lib/posts");

const posts = getAllPosts(); // fetch all posts

/** next-sitemap.config.js */
module.exports = {
  siteUrl: 'https://wegatenews.de', // replace with your actual domain
  generateRobotsTxt: true,           // optional, generates robots.txt
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
};

