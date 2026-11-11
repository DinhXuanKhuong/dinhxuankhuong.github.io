import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const kinds = { post: "posts", poem: "poems", project: "projects" };
const [kind, title, ...options] = process.argv.slice(2);
const usage = 'Usage: npm run new -- <post|poem|project> "Your title" [--date YYYY-MM-DD]';

try {
  if (!kinds[kind] || !title?.trim()) throw new Error(usage);
  let date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  if (options.length) {
    if (options.length !== 2 || options[0] !== "--date") throw new Error(usage);
    date = options[1];
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    throw new Error("Use a real date in YYYY-MM-DD format.");
  }
  const slug = title.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d")
    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  if (!slug) throw new Error("The title must contain letters or numbers.");
  const folder = path.join("src", "content", kinds[kind]);
  const filename = path.join(folder, `${kind === "project" ? "" : `${date}-`}${slug}.md`);
  const details = kind === "project"
    ? 'category: Project\n# repository: https://github.com/your-name/your-repo\n# demo: https://example.com\n# order: 1\n'
    : `category: ${kind === "poem" ? "Poetry" : "Personal"}\n`;
  const body = kind === "poem"
    ? "Write your poem here.\nEach new line stays on its own line.\n\nA blank line starts a new stanza.\n"
    : "Write your introduction here.\n\n## About\n\nAdd your writing, images, or code here.\n";
  await mkdir(folder, { recursive: true });
  await writeFile(filename, `---\ntitle: ${JSON.stringify(title.trim())}\ndate: ${date}\ndescription: "Add a short description for the archive."\n${details}draft: true\n---\n\n${body}`, { flag: "wx" });
  console.log(`Created ${filename}\nEdit the file, then set draft: false when it is ready to appear on the site.`);
} catch (error) {
  console.error(error.code === "EEXIST" ? "That content file already exists; nothing was overwritten." : error.message);
  process.exitCode = 1;
}
