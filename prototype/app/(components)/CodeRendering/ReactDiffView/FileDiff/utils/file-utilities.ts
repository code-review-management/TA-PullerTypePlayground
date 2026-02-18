"use server";

import { promises as fs } from "fs";

/**
 * Documentation:
 * 1. https://vercel.com/kb/guide/loading-static-file-nextjs-api-route
 * - Referenced to read file contents in Next.js.
 */

export async function readSampleDiff() {
  const path =
    "/app/(components)/CodeRendering/ReactDiffView/FileDiff/sample-data/sample-diff.txt";
  const contents = await fs.readFile(process.cwd() + path, "utf8");
  return contents;
}
