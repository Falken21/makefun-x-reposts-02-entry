// Entry program for the make.fun bounty "makefun-x-reposts-02"
// (Get the most reposts and likes on make.fun's newest X posts).
//
// The real entry is a set of posts on X: each one quotes, or replies
// directly to, a different recent post by @makefunai, and each carries
// make.fun in its own words plus one of the entrant's play codes. This
// program's whole job is to hand those posts' addresses to the grader:
// it copies POSTS.json from the repository root into the output
// directory, byte for byte, so the house can read every listed post and
// count its reposts, quotes and likes itself. Nothing written here about
// the posts is scored, so the program writes nothing else.
//
// Node 22, standard library only, no network, no clock: run it twice and
// the output is identical. In the grader's sandbox the repository sits at
// /bot and the output at /output; outside it, MAKEFUN_BOT_DIR and
// MAKEFUN_OUTPUT_DIR point at the two directories instead.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POSTS.json");
const target = join(outputDir, "POSTS.json");

// Read the list before copying: a malformed POSTS.json should fail loudly
// here rather than be handed on. The shape is the one the bounty names,
// an object whose "posts" is a list of X post addresses.
const parsed = JSON.parse(readFileSync(source, "utf8")) as { posts?: unknown };
if (typeof parsed !== "object" || parsed === null || !Array.isArray(parsed.posts)) {
  console.error("POSTS.json must be a JSON object with a \"posts\" list");
  process.exit(1);
}
if (parsed.posts.some((post) => typeof post !== "string")) {
  console.error("Every entry in POSTS.json's \"posts\" list must be a string");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);
