import { summarizeGoals } from "./src/_lib/goals.js";

const contentKinds = ["posts", "projects", "poems"];

function publishedItems(collection, kind) {
  const items = collection.getFilteredByGlob(`src/content/${kind}/*.md`);
  for (const item of items) {
    const { title, description, date, draft } = item.data;
    if (!title?.trim() || !description?.trim() || !date || Number.isNaN(new Date(date).valueOf())) {
      throw new Error(`${item.inputPath}: title, description, and a valid date are required.`);
    }
    if (draft !== undefined && typeof draft !== "boolean") {
      throw new Error(`${item.inputPath}: draft must be true or false, without quotation marks.`);
    }
    for (const field of ["repository", "demo"]) {
      if (item.data[field] && !/^https?:\/\//.test(item.data[field])) {
        throw new Error(`${item.inputPath}: ${field} must be an http(s) URL.`);
      }
    }
  }
  return items.filter((item) => !item.data.draft).sort((a, b) => {
    if (kind === "projects") {
      const order = (a.data.order ?? Infinity) - (b.data.order ?? Infinity);
      if (order && !Number.isNaN(order)) return order;
    }
    return b.date - a.date || a.inputPath.localeCompare(b.inputPath);
  });
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());
  eleventyConfig.addFilter("goalSummary", summarizeGoals);
  eleventyConfig.addFilter("latest", (items, count = 1) => items.slice(0, count));
  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString().slice(0, 10));
  eleventyConfig.addFilter("readableDate", (value) =>
    new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)),
  );
  for (const kind of contentKinds) {
    eleventyConfig.addCollection(kind, (collection) => publishedItems(collection, kind));
  }
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
