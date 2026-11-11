import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const output = path.resolve(process.argv[2] || "_site");
async function htmlFiles(folder) {
  const files = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const fullPath = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(fullPath));
    else if (entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}
const files = await htmlFiles(output);
const failures = [];
for (const filename of files) {
  const html = await readFile(filename, "utf8");
  if (!/<title>[^<]+<\/title>/.test(html) || !html.includes('name="viewport"')) failures.push(`${filename}: missing page metadata`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const link = match[1];
    if (!link || link.startsWith("#") || /^(?:[a-z][\w+.-]*:|\/\/)/i.test(link)) continue;
    const url = decodeURIComponent(link.split(/[?#]/, 1)[0]);
    const target = url.startsWith("/") ? path.join(output, url) : path.resolve(path.dirname(filename), url);
    try {
      const info = await stat(target);
      if (info.isDirectory()) await stat(path.join(target, "index.html"));
    } catch { failures.push(`${path.relative(output, filename)}: broken link ${link}`); }
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else console.log(`Checked metadata and internal links in ${files.length} generated pages.`);
