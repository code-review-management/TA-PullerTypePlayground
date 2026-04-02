import { RepoSchema } from "@/types/github.types";
import * as z from "zod";

export type RepoV2 = z.infer<typeof RepoSchemaV2>;

export const RepoSchemaV2 = z.object({
  data: z.array(RepoSchema),
  prev: z.number().optional(),
  next: z.number().optional(),
  first: z.number().optional(),
  last: z.number().optional(),
});
