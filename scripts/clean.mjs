import { rm } from "node:fs/promises";
// Remove stale pages when an entry is deleted, renamed, or returned to draft.
await rm(new URL("../_site/", import.meta.url), { recursive: true, force: true });
