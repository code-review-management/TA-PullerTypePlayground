"use server";

import { promises as fs } from "fs";

export async function readFile() {
  const pathSampleDiff =
    "/app/(components)/CodeRendering/ReactDiffView/sample-data/sample-diff.txt";
  const data = await fs.readFile(process.cwd() + pathSampleDiff, "utf8");
  return data;
}
