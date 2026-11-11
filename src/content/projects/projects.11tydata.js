export default {
  layout: "layouts/entry.njk",
  kind: "projects",
  navKey: "projects",
  archiveUrl: "/projects.html",
  archiveLabel: "Back to projects",
  eleventyComputed: {
    permalink: (data) => data.draft ? false : `/projects/${data.page.inputPath.split("/").pop().replace(/\.md$/, "")}.html`,
  },
};
