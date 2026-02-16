"use server";

import { promises as fs } from "fs";

/**
 * Docs:
 * 1. https://vercel.com/kb/guide/loading-static-file-nextjs-api-route
 */

export async function readFile(path: string) {
  return await fs.readFile(process.cwd() + path, "utf8");
}
