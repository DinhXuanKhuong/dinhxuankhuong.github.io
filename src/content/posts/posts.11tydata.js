export default {
  layout: "layouts/entry.njk",
  kind: "posts",
  navKey: "blog",
  archiveUrl: "/blog.html",
  archiveLabel: "Back to the blog",
  eleventyComputed: {
    permalink: (data) => data.draft ? false : `/posts/${data.page.inputPath.split("/").pop().replace(/\.md$/, "")}.html`,
  },
};
