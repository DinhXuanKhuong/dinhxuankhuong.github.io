import test from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, writeFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const cli = path.join(root, "node_modules/@11ty/eleventy/cmd.cjs");
const creator = path.join(root, "scripts/new-content.mjs");
const read = (file) => readFile(file, "utf8");
const fixture = (title, extra = "", body = "Fixture content.") =>
  `---\ntitle: ${JSON.stringify(title)}\ndate: 2026-11-11\ndescription: "A fixture description."\n${extra}---\n\n${body}\n`;

test("new-content creates safe drafts, supports Vietnamese titles, and refuses overwrites", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "khuong-authoring-"));
  try {
    const args = [creator, "poem", "Điều Anh Muốn Nói", "--date", "2026-11-11"];
    execFileSync(process.execPath, args, { cwd: dir });
    const filename = path.join(dir, "src/content/poems/2026-11-11-dieu-anh-muon-noi.md");
    const original = await read(filename);
    assert.match(original, /draft: true/);
    assert.match(original, /title: "Điều Anh Muốn Nói"/);
    assert.equal(spawnSync(process.execPath, args, { cwd: dir }).status, 1);
    assert.equal(await read(filename), original);
    assert.equal(spawnSync(process.execPath, [creator, "post", "Invalid", "--date", "2026-02-30"], { cwd: dir }).status, 1);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("published content automatically appears in archives; drafts stay out of every output", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "khuong-build-"));
  try {
    await cp(path.join(root, "src"), path.join(dir, "src"), { recursive: true });
    const content = path.join(dir, "src/content");
    await writeFile(path.join(content, "posts/2026-11-11-new-post.md"), fixture("Newest post", "draft: false\n", 'A code example: `{{ untouched }}`.'));
    await writeFile(path.join(content, "posts/2026-11-11-hidden.md"), fixture("Private draft marker", "draft: true\n"));
    await writeFile(path.join(content, "poems/2026-11-11-poem.md"), fixture("Bài thơ đầu tiên", "language: vi\ndraft: false\n", "Dòng thứ nhất\nDòng thứ hai\n\nKhổ thứ hai."));
    await writeFile(path.join(content, "projects/new-project.md"), fixture("New project", "repository: https://github.com/example/project\ndraft: false\n"));
    execFileSync(process.execPath, [cli, `--config=${path.join(root, "eleventy.config.js")}`], { cwd: dir, stdio: "pipe" });
    const out = path.join(dir, "_site");
    const homepage = await read(path.join(out, "index.html"));
    assert.match(homepage, /Newest post/);
    assert.doesNotMatch(homepage, /Selected projects|Private draft marker/);
    assert.match(homepage, /final-year Computer Science student/);
    assert.match(homepage, /HCMUS Campus, Vietnam - 2025/);
    assert.match(await read(path.join(out, "blog.html")), /Newest post/);
    assert.doesNotMatch(await read(path.join(out, "blog.html")), /Private draft marker/);
    await assert.rejects(access(path.join(out, "posts/2026-11-11-hidden.html")));
    assert.match(await read(path.join(out, "posts/2026-11-11-new-post.html")), /\{\{ untouched \}\}/);
    assert.match(await read(path.join(out, "poems.html")), /Bài thơ đầu tiên/);
    const poem = await read(path.join(out, "poems/2026-11-11-poem.html"));
    assert.match(poem, /lang="vi"/);
    assert.match(poem, /class="poem-body"/);
    assert.match(poem, /Dòng thứ nhất\nDòng thứ hai/);
    assert.match(await read(path.join(out, "projects.html")), /New project/);
    assert.match(await read(path.join(out, "projects/new-project.html")), /https:\/\/github.com\/example\/project/);
    await access(path.join(out, "posts/2026-01-10-welcome.html"));
    execFileSync(process.execPath, [path.join(root, "scripts/check-site.mjs"), out], { stdio: "pipe" });
    await writeFile(path.join(content, "poems/bad-draft.md"), fixture("Bad draft", 'draft: "false"\n'));
    assert.notEqual(spawnSync(process.execPath, [cli, `--config=${path.join(root, "eleventy.config.js")}`], { cwd: dir }).status, 0);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
