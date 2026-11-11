export default {
  layout: "layouts/entry.njk",
  kind: "poems",
  navKey: "poems",
  archiveUrl: "/poems.html",
  archiveLabel: "Back to poems",
  eleventyComputed: {
    permalink: (data) => data.draft ? false : `/poems/${data.page.inputPath.split("/").pop().replace(/\.md$/, "")}.html`,
  },
};
